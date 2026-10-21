"""Docs indexing against the real public tree."""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from docs_agent.docs_index import load_pages
from docs_agent.validate import _resolve

ROOT = Path(__file__).resolve().parents[3]


class DocsIndexTests(unittest.TestCase):
    def test_checkout_directories_named_docs_do_not_change_routes(self):
        with tempfile.TemporaryDirectory() as directory:
            docs_root = Path(directory) / "docs" / "docs" / "docs"
            page_path = docs_root / "02-tools-features" / "brain-vault.mdx"
            page_path.parent.mkdir(parents=True)
            page_path.write_text("---\ntitle: Brain Vault\n---\n# Brain Vault\n", encoding="utf-8")
            pages = load_pages(docs_root)
            self.assertEqual(len(pages), 1)
            self.assertEqual(pages[0].path, "docs/02-tools-features/brain-vault.mdx")
            self.assertEqual(pages[0].slug, "/tools-features/brain-vault")

    def test_public_pages_keep_their_routes(self):
        pages = {page.slug: page for page in load_pages(ROOT / "docs")}
        self.assertIn("/tools-features/brain-vault", pages)
        self.assertEqual(pages["/tools-features/brain-vault"].title, "Brain Vault")
        self.assertIn("/common-tasks/deployment/embed-chatbot", pages)
        self.assertIn("/common-tasks/knowledge-management/add-knowledge-sources", pages)

    def test_relative_doc_links_resolve_like_docusaurus(self):
        resolved = _resolve(
            "/common-tasks/knowledge-management/add-knowledge-sources",
            "../../getting-started/quickstart-guide/create-botstack",
        )
        self.assertEqual(resolved, "/getting-started/quickstart-guide/create-botstack")
        slugs = {page.slug for page in load_pages(ROOT / "docs")}
        self.assertIn(resolved, slugs)


if __name__ == "__main__":
    unittest.main()
