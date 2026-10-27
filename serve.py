#!/usr/bin/env python3
"""Local static server with clean HTML URLs; no legacy profile catch-all."""
import http.server
from pathlib import Path
import re
from urllib.parse import parse_qs, quote, urlsplit


class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        url = urlsplit(self.path)
        path = url.path.rstrip('/') or '/'
        if path in ('/herb-detail', '/herb-detail.html'):
            slug = parse_qs(url.query).get('herb', [''])[0]
            if re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
                return self.redirect('/herbs/' + slug)
        if path.endswith('.html') and Path(self.translate_path(path)).is_file():
            return self.redirect(quote(path[:-5], safe='/') + ('?' + url.query if url.query else ''))
        target = Path(self.translate_path(path))
        if not target.is_file() and not target.is_dir():
            html = Path(str(target) + '.html')
            if html.is_file():
                self.path = path + '.html' + ('?' + url.query if url.query else '')
        return super().send_head()

    def send_error(self, code, message=None, explain=None):
        page = Path(self.directory) / '404.html'
        if code != 404 or not page.is_file():
            return super().send_error(code, message, explain)
        body = page.read_bytes()
        self.send_response(404)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(body)

    def redirect(self, target):
        self.send_response(301)
        self.send_header('Location', target)
        self.send_header('Content-Length', '0')
        self.end_headers()
        return None


if __name__ == '__main__':
    with http.server.ThreadingHTTPServer(('', 8080), CleanURLHandler) as httpd:
        print('Serving at http://localhost:8080')
        httpd.serve_forever()
