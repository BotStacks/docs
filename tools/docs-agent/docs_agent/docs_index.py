"""Read the Docusaurus tree and find the few pages a change could affect."""

from __future__ import annotations

import re
from pathlib import Path

from docs_agent.models import DocPage, PullRequest

_NUMBER_PREFIX = re.compile(r"^\d+[-_]+")
_HEADING = re.compile(r"^#{1,3}\s+(.+)$", re.MULTILINE)

# Topic words -> fragments that identify an existing public page.
_TOPIC_PAGES: tuple[tuple[tuple[str, ...], tuple[str, ...]], ...] = (
    (
        ("brain vault", "brainvault", "knowledge", "crawler", "crawl", "upload", "pdf", "docx", "csv"),
        ("brain-vault", "knowledge-management", "knowledge-base", "add-knowledge"),
    ),
    (
        ("dirtbox", "dirt box", "transcript", "test case"),
        ("dirtbox", "testing-and-improvement", "transcript"),
    ),
    (
        ("widget", "embed", "activation", "install", "chatbot"),
        ("embed-chatbot", "deployment", "activation-kit"),
    ),
    (
        ("godaddy", "airo", "bubble", "webflow", "wix", "squarespace", "slack", "discord", "whatsapp", "crisp", "integration"),
        ("integrations", "godaddy", "airo", "bubble", "webflow", "wix", "squarespace", "slack", "discord", "whatsapp", "crisp"),
    ),
    (
        ("sequence studio", "node", "conversation flow"),
        ("sequence-studio", "conversation-design", "understand-nodes"),
    ),
    (
        ("billing", "usage", "plan", "cost"),
        ("usage-and-costs", "track-usage"),
    ),
)


def _frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end < 0:
        return {}
    block = text[3:end]
    data: dict[str, str] = {}
    for line in block.splitlines():
        if not line.strip() or line.strip().startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        data[key.strip()] = value.strip().strip("'\"")
    return data


def slug_for(path: str, frontmatter: dict[str, str]) -> str:
    """Docusaurus route for a docs file when routeBasePath is `/`.

    `path` is a repository-relative path such as `docs/04-tools-features/01-brain-vault.mdx`,
    or a path already relative to the docs content directory. Only a leading
    `docs/` prefix is removed. A `docs` directory inside the checkout path,
    or a nested `docs/` folder in the content tree, is left in place.
    """
    relative = path.replace("\\", "/")
    if relative.startswith("docs/"):
        relative = relative[len("docs/"):]
    parts = [part for part in relative.split("/") if part not in {"", "."}]
    stem = parts[-1].rsplit(".", 1)[0]
    if frontmatter.get("id"):
        stem = frontmatter["id"]
    parts[-1] = stem
    cleaned = [_NUMBER_PREFIX.sub("", part) for part in parts]
    slug = "/" + "/".join(part for part in cleaned if part)
    override = frontmatter.get("slug")
    if override:
        slug = override if override.startswith("/") else "/" + override
    return slug.rstrip("/") or "/"


def load_pages(docs_root: Path) -> list[DocPage]:
    pages: list[DocPage] = []
    if not docs_root.is_dir():
        return pages
    for path in sorted(docs_root.rglob("*")):
        if path.suffix.lower() not in {".md", ".mdx"}:
            continue
        text = path.read_text(encoding="utf-8")
        meta = _frontmatter(text)
        try:
            content_path = path.resolve().relative_to(docs_root.resolve())
        except ValueError:
            content_path = path
        repo_path = f"docs/{content_path.as_posix()}"
        headings = tuple(match.group(1).strip() for match in _HEADING.finditer(text))
        pages.append(
            DocPage(
                path=repo_path,
                title=meta.get("title", ""),
                description=meta.get("description", ""),
                headings=headings,
                text=text,
                slug=slug_for(repo_path, meta),
            )
        )
    return pages


def match_pages(pr: PullRequest, pages: list[DocPage], limit: int = 3) -> list[DocPage]:
    haystack = " ".join(
        [pr.title, pr.body, *(item.filename for item in pr.files)]
    ).lower()
    wanted: set[str] = set()
    for keywords, fragments in _TOPIC_PAGES:
        if any(keyword in haystack for keyword in keywords):
            wanted.update(fragments)
    if not wanted:
        return []
    scored: list[tuple[int, DocPage]] = []
    for page in pages:
        identity = f"{page.path} {page.slug} {page.title}".lower()
        score = sum(1 for fragment in wanted if fragment in identity)
        if score:
            scored.append((score, page))
    scored.sort(key=lambda item: (-item[0], item[1].path))
    return [page for _, page in scored[:limit]]


def excerpt(page: DocPage, limit: int) -> str:
    if len(page.text) <= limit:
        return page.text
    return page.text[:limit] + "\n\n[truncated]\n"

