import functools
import http.client
import http.server
import json
from pathlib import Path
import threading
import unittest
from serve import CleanURLHandler

ROOT = Path(__file__).resolve().parents[1]

class QuietHandler(CleanURLHandler):
    def log_message(self, *args):
        pass

class RouteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(QuietHandler, directory=str(ROOT)))
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def request(self, path, method='GET'):
        conn = http.client.HTTPConnection(*self.server.server_address)
        conn.request(method, path)
        response = conn.getresponse()
        result = response.status, dict(response.getheaders()), response.read()
        conn.close()
        return result

    def test_every_clean_profile_serves_exact_generated_html(self):
        for herb in json.loads((ROOT / 'herbs.json').read_text()):
            slug = herb['id']
            with self.subTest(slug=slug):
                status, headers, body = self.request('/herbs/' + slug)
                self.assertEqual(status, 200)
                self.assertEqual(body, (ROOT / 'herbs' / (slug + '.html')).read_bytes())

    def test_unknown_profile_is_404_for_get_and_head(self):
        for method in ('GET', 'HEAD'):
            self.assertEqual(self.request('/herbs/no-such-herb', method)[0], 404)

    def test_legacy_redirect_and_html_canonicalization(self):
        for path in ('/herb-detail.html?herb=ginger', '/herb-detail?herb=ginger&utm_source=test', '/herbs/ginger.html'):
            for method in ('GET', 'HEAD'):
                status, headers, _ = self.request(path, method)
                self.assertEqual(status, 301)
                self.assertEqual(headers['Location'], '/herbs/ginger')

    def test_query_trailing_slash_and_head(self):
        expected = (ROOT / 'herbs/ginger.html').read_bytes()
        self.assertEqual(self.request('/herbs/ginger/?utm_source=test')[2], expected)
        status, headers, body = self.request('/herbs/ginger', 'HEAD')
        self.assertEqual(status, 200)
        self.assertEqual(int(headers['Content-Length']), len(expected))
        self.assertEqual(body, b'')

    def test_legacy_shells_do_not_load_stale_renderer(self):
        for page in ROOT.rglob('*.html'):
            self.assertNotRegex(page.read_text(), r'<script[^>]+src=["\'][^"\']*herb-detail\.js')

    def test_assets_and_directory_still_resolve(self):
        for path in ('/style.css', '/herb-directory/', '/herbs/'):
            self.assertEqual(self.request(path)[0], 200)

if __name__ == '__main__':
    unittest.main()
