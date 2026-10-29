"""Guard the domain migration against stale public metadata and broken contacts."""
from pathlib import Path
import re
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]


class BrandTests(unittest.TestCase):
    def test_public_html_has_no_old_brand_outside_preserved_identifiers(self):
        for path in ROOT.rglob('*.html'):
            if '.git' in path.parts:
                continue
            text = path.read_text()
            text = re.sub(r'[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}|herbcraft0a-20', '', text)
            with self.subTest(page=str(path.relative_to(ROOT))):
                self.assertNotRegex(text.lower(), 'herbcraft')

    def test_sitemap_and_robots_use_new_domain(self):
        root = ET.parse(ROOT / 'sitemap.xml').getroot()
        urls = root.findall('{*}url/{*}loc')
        self.assertGreater(len(urls), 50)
        for url in urls:
            self.assertTrue(url.text.startswith('https://wildthesis.com/'), url.text)
        self.assertIn('Sitemap: https://wildthesis.com/sitemap.xml', (ROOT / 'robots.txt').read_text())

    def test_existing_contact_mailboxes_are_preserved(self):
        self.assertIn('mailto:hello@herbcraft.app', (ROOT / 'contact/index.html').read_text())
        self.assertIn('herbcraft@backstageinteractive.com', (ROOT / 'privacy/index.html').read_text())


if __name__ == '__main__':
    unittest.main()
