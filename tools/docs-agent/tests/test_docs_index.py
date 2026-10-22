"""Docs indexing against the real public tree and isolated path fixtures."""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from docs_agent.docs_index import load_pages, slug_for
from docs_agent.validate import _resolve

ROOT = Path(__file__).resolve().parents[3]


class DocsIndexTests(unittest.TestCase):
    def test_public_pages_keep_their_routes(self):
        pages = {page.slug: page for page in load_pages(ROOT / "docs")}
        brain = pages["/tools-features/brain-vault"]
        self.assertEqual(brain.title, "Brain Vault")
        self.assertEqual(brain.path, "docs/04-tools-features/01-brain-vault.mdx")
        self.assertIn("/common-tasks/deployment/embed-chatbot", pages)
        self.assertEqual(
            next(page.path for page in pages.values() if page.slug == "/"),
            "docs/01-index.mdx",
        )

    def test_relative_doc_links_resolve_like_docusaurus(self):
        resolved = _resolve(
            "/common-tasks/knowledge-management/add-knowledge-sources",
            "../../getting-started/quickstart-guide/create-botstack",
        )
        self.assertEqual(resolved, "/getting-started/quickstart-guide/create-botstack")
        slugs = {page.slug for page in load_pages(ROOT / "docs")}
        self.assertIn(resolved, slugs)
        self.assertIn("/common-tasks/deployment/embed-chatbot", slugs)

    def test_slug_for_strips_only_a_leading_docs_prefix(self):
        self.assertEqual(
            slug_for("docs/04-tools-features/01-brain-vault.mdx", {}),
            "/tools-features/brain-vault",
        )
        self.assertEqual(
            slug_for("docs/docs/nested-guide.md", {}),
            "/docs/nested-guide",
        )
        self.assertEqual(
            slug_for(r"docs\03-common-tasks\04-deployment\embed-chatbot.mdx", {"id": "embed-chatbot"}),
            "/common-tasks/deployment/embed-chatbot",
        )
        self.assertEqual(slug_for("docs/01-index.mdx", {"slug": "/"}), "/")
        self.assertEqual(
            slug_for("docs/99-widget.mdx", {"id": "embed-chatbot", "slug": "/common-tasks/deployment/embed-chatbot"}),
            "/common-tasks/deployment/embed-chatbot",
        )
        checkout = "/home/runner/work/docs/docs/docs/04-tools-features/01-brain-vault.mdx"
        self.assertNotEqual(slug_for(checkout, {}), "/docs/docs/tools-features/brain-vault")
        self.assertTrue(slug_for(checkout, {}).startswith("/home/runner/work/docs/docs/docs/"))

    def test_load_pages_ignores_the_github_actions_checkout_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            docs_root = Path(tmp) / "home" / "runner" / "work" / "docs" / "docs" / "docs"
            brain = docs_root / "04-tools-features" / "01-brain-vault.mdx"
            nested = docs_root / "docs" / "guide.md"
            index = docs_root / "01-index.mdx"
            brain.parent.mkdir(parents=True)
            nested.parent.mkdir()
            brain.write_text("---\ntitle: Brain Vault\n---\n# Brain Vault\n", encoding="utf-8")
            nested.write_text("# Nested\n", encoding="utf-8")
            index.write_text("---\ntitle: Home\nslug: /\n---\n# Home\n", encoding="utf-8")
            pages = {page.slug: page for page in load_pages(docs_root)}
        self.assertEqual(pages["/tools-features/brain-vault"].path, "docs/04-tools-features/01-brain-vault.mdx")
        self.assertEqual(pages["/docs/guide"].path, "docs/docs/guide.md")
        self.assertEqual(pages["/"].path, "docs/01-index.mdx")
        self.assertEqual(pages["/"].title, "Home")


if __name__ == "__main__":
    unittest.main()
