from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import unittest
import build_conditions
import test_routes
ROOT = test_routes.ROOT

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            self.links.append(dict(attrs).get('href', ''))

class NotFoundHTTPTests(unittest.TestCase):
    setUpClass = classmethod(test_routes.RouteTests.setUpClass.__func__)
    tearDownClass = classmethod(test_routes.RouteTests.tearDownClass.__func__)
    request = test_routes.RouteTests.request

    def test_missing_urls_serve_custom_page_with_404(self):
        for path in ('/not-a-page', '/herbs/not-a-herb', '/deeply/nested/missing?x=%3Cscript%3E'):
            with self.subTest(path=path):
                status, headers, body = self.request(path)
                self.assertEqual(status, 404)
                self.assertEqual(body, (ROOT / '404.html').read_bytes())
                self.assertNotIn('Location', headers)
                self.assertIn('noindex,follow', body.decode())
                status, headers, body = self.request(path, 'HEAD')
                self.assertEqual(status, 404)
                self.assertEqual(body, b'')
                self.assertEqual(int(headers['Content-Length']), (ROOT / '404.html').stat().st_size)

    def test_recovery_assets_and_destinations_are_reachable(self):
        parser = Links()
        parser.feed((ROOT / '404.html').read_text())
        for href in parser.links + ['/404.css']:
            if href.startswith('#'):
                continue
            self.assertEqual(self.request(href)[0], 200, href)

class InternalLinkTests(unittest.TestCase):
    def test_published_html_links_have_existing_local_destinations(self):
        missing = []
        for page in ROOT.rglob('*.html'):
            if 'template' in page.name:
                continue
            parser = Links()
            parser.feed(page.read_text())
            for href in parser.links:
                if not href or href.startswith('#'):
                    continue
                url = urlsplit(urljoin('https://wildthesis.com/' + page.relative_to(ROOT).as_posix(), href))
                if url.scheme not in ('http', 'https') or url.netloc != 'wildthesis.com':
                    continue
                target = ROOT / unquote(url.path).strip('/')
                if not (target.is_file() or (target / 'index.html').is_file() or Path(str(target) + '.html').is_file()):
                    missing.append((str(page.relative_to(ROOT)), href))
        self.assertEqual(missing, [])

    def test_condition_generator_does_not_link_unpublished_profiles(self):
        html = build_conditions.generate_herb_cards({'id': 'blood-sugar', 'herbs': ['berberine', 'bitter-melon']}, {})
        self.assertEqual(html.strip(), '')
