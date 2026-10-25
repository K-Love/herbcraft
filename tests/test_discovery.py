import unittest
from html.parser import HTMLParser
from pathlib import Path
import build_discovery

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.urls = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and attrs.get('class') == 'herb-card':
            self.urls.append(attrs['href'])

class DiscoveryTests(unittest.TestCase):
    def test_generated_files_are_reproducible(self):
        paths = [Path(p) for p in ['herb-directory.html', 'herb-directory/index.html', 'herb-search-index.js']]
        before = [p.read_bytes() for p in paths]
        build_discovery.build()
        self.assertEqual(before, [p.read_bytes() for p in paths])

    def test_both_directories_match_catalogue(self):
        expected = [h['url'] for h in build_discovery.catalogue()]
        for p in ['herb-directory.html', 'herb-directory/index.html']:
            links = Links(); links.feed(Path(p).read_text())
            self.assertEqual(links.urls, expected)

    def test_card_fields_are_escaped(self):
        html = build_discovery.render_cards([dict(url='/herbs/test', name='<img onerror="x">', scientific='A & B')])
        self.assertNotIn('<img', html)
        self.assertIn('A &amp; B', html)
        self.assertIn('&quot;', html)

if __name__ == '__main__': unittest.main()
