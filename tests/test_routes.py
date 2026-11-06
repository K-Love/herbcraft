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

    def request(self, path, method='GET', host=None):
        conn = http.client.HTTPConnection(*self.server.server_address)
        headers = {'Host': host} if host else {}
        conn.request(method, path, headers=headers)
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

    def test_old_hosts_redirect_without_touching_primary_or_preview(self):
        preserved = (
            ('herbcraft.app', '/herbs/ginger', 'https://wildthesis.com/herbs/ginger'),
            ('www.herbcraft.app', '/herbs/ginger', 'https://wildthesis.com/herbs/ginger'),
            ('herbcraft.app:443', '/', 'https://wildthesis.com/'),
            ('herbcraft.app', '/herb-detail.html?herb=ginger', 'https://wildthesis.com/herb-detail.html?herb=ginger'),
            ('www.herbcraft.app', '/herb-detail?herb=ginger&utm_source=test', 'https://wildthesis.com/herb-detail?herb=ginger&utm_source=test'),
            ('herbcraft.app', '/herb-directory?search=mint', 'https://wildthesis.com/herb-directory?search=mint'),
            ('herbcraft.app', '/contact/thanks', 'https://wildthesis.com/contact/thanks'),
            ('herbcraft.app', '/contact/thanks/', 'https://wildthesis.com/contact/thanks/'),
            ('www.herbcraft.app', '/not-a-real-page', 'https://wildthesis.com/not-a-real-page'),
        )
        for host, path, location in preserved:
            for method in ('GET', 'HEAD'):
                status, headers, body = self.request(path, method, host)
                self.assertEqual(status, 301, (host, path, method))
                self.assertEqual(headers['Location'], location)
                self.assertEqual(body, b'')
        for host in ('wildthesis.com', 'www.wildthesis.com', 'deploy-preview-27--herbcraftapp.netlify.app', 'not-herbcraft.app'):
            status, headers, _ = self.request('/herbs/ginger', host=host)
            self.assertEqual(status, 200, host)
            self.assertNotIn('Location', headers)
        status, headers, _ = self.request('/herb-detail.html?herb=ginger', host='wildthesis.com')
        self.assertEqual(status, 301)
        self.assertEqual(headers['Location'], '/herbs/ginger')
        # The local server adds a trailing slash for a directory. It stays on
        # this host and keeps the query. Netlify Pretty URLs serve this path
        # directly; either way it is not a cross-host redirect.
        status, headers, _ = self.request('/herb-directory?search=mint', host='wildthesis.com')
        self.assertEqual(status, 301)
        self.assertEqual(headers['Location'], '/herb-directory/?search=mint')
        status, headers, body = self.request('/herb-directory/?search=mint', host='wildthesis.com')
        self.assertEqual(status, 200)
        self.assertNotIn('Location', headers)
        self.assertIn(b'Herb Directory', body)
        status, headers, body = self.request('/contact/thanks/', host='www.wildthesis.com')
        self.assertEqual(status, 200)
        self.assertNotIn('Location', headers)
        self.assertIn(b'Thank you', body)

    def test_missing_old_host_redirects_and_primary_remains_404(self):
        # A 301 moves the alias to the canonical host. That host then returns
        # the real 404, because one response cannot both change hosts and
        # report the missing canonical URL.
        status, headers, body = self.request('/not-a-real-page', host='herbcraft.app')
        self.assertEqual(status, 301)
        self.assertEqual(headers['Location'], 'https://wildthesis.com/not-a-real-page')
        self.assertEqual(body, b'')
        for method in ('GET', 'HEAD'):
            status, headers, body = self.request('/not-a-real-page', method, 'wildthesis.com')
            self.assertEqual(status, 404)
            self.assertNotIn('Location', headers)
            if method == 'GET':
                self.assertIn(b'Page Not Found', body)
            else:
                self.assertEqual(body, b'')

class RedirectFileTests(unittest.TestCase):
    def test_leading_rules_are_only_the_old_hosts(self):
        import serve
        rules = serve.redirect_rules((ROOT / '_redirects').read_text())
        host_rules = []
        saw_path_rule = False
        for sources, destination, status in rules:
            if '://' in sources[0]:
                self.assertFalse(saw_path_rule)
                host_rules.append((sources, destination, status))
            else:
                saw_path_rule = True
                self.assertNotIn('://', destination)
        schemes = set()
        for sources, destination, status in host_rules:
            self.assertEqual(sources[1:], [])
            self.assertEqual(status, '301!')
            self.assertEqual(destination, 'https://wildthesis.com/:splat')
            scheme, _, rest = sources[0].partition('://')
            host, _, path = rest.partition('/')
            schemes.add((scheme, host, path))
        self.assertEqual(schemes, {
            ('http', 'herbcraft.app', '*'),
            ('https', 'herbcraft.app', '*'),
            ('http', 'www.herbcraft.app', '*'),
            ('https', 'www.herbcraft.app', '*'),
        })
        self.assertEqual(serve.OLD_HOSTS, {'herbcraft.app', 'www.herbcraft.app'})
        text = (ROOT / '_redirects').read_text()
        self.assertIn('/herb-detail.html herb=:herb /herbs/:herb 301!\n', text)
        self.assertIn('/herb-detail herb=:herb /herbs/:herb 301!\n', text)


if __name__ == '__main__':
    unittest.main()
