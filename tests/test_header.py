"""Keep navigation available and consistent across every page family."""
import unittest
from pathlib import Path
import build_headers

ROOT = Path(__file__).resolve().parents[1]


class HeaderTests(unittest.TestCase):
    def test_all_headers_match_shared_source(self):
        self.assertEqual(build_headers.build(check=True), [])

    def test_every_header_loads_its_styles_and_interaction(self):
        pages = 0
        for path in ROOT.rglob('*.html'):
            if path == ROOT / 'components/site-header.html':
                continue
            html = path.read_text()
            if not build_headers.PATTERN.search(html):
                continue
            pages += 1
            with self.subTest(page=str(path.relative_to(ROOT))):
                self.assertEqual(html.count('href="/site-header.css"'), 1)
                self.assertEqual(html.count('src="/site-header.js"'), 1)
                self.assertIn('href="/" aria-label="Wild Thesis home"', html)
        self.assertGreater(pages, 70)
