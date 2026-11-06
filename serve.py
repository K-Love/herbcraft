#!/usr/bin/env python3
"""Local static server with clean HTML URLs; no legacy profile catch-all."""
import http.server
from pathlib import Path
import re
from urllib.parse import parse_qs, quote, urlsplit

ROOT = Path(__file__).resolve().parent
PRIMARY_ORIGIN = "https://wildthesis.com"


def redirect_rules(text):
    """Return redirect rules as (sources, destination, status) tuples.

    Comment lines are ignored. Host rules are only valid as a leading block,
    matching Netlify's first-match order.
    """
    rules = []
    for raw in text.splitlines():
        line = raw.split("#", 1)[0].strip()
        if not line:
            continue
        parts = line.split()
        if len(parts) < 3:
            raise ValueError("redirect rule needs from, to, and status: " + line)
        rules.append((parts[:-2], parts[-2], parts[-1]))
    return rules


def old_host_names(rules):
    """Hosts with a forced 301 to the primary origin, path and query preserved."""
    hosts = []
    for sources, destination, status in rules:
        source = sources[0]
        if "://" not in source:
            break
        if sources[1:] or status != "301!" or destination != PRIMARY_ORIGIN + "/:splat":
            raise ValueError("old-host rule must be a forced splat redirect: " + source)
        scheme, _, rest = source.partition("://")
        host, separator, path = rest.partition("/")
        if scheme not in ("http", "https") or separator != "/" or path != "*" or not host:
            raise ValueError("old-host rule must match an entire http(s) host: " + source)
        if host not in hosts:
            hosts.append(host)
    return frozenset(hosts)


OLD_HOSTS = old_host_names(redirect_rules((ROOT / "_redirects").read_text()))


class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def old_host_target(self):
        host = (self.headers.get("Host") or "").split(":", 1)[0].strip().lower().rstrip(".")
        if host not in OLD_HOSTS:
            return None
        url = urlsplit(self.path)
        path = url.path or "/"
        if not path.startswith("/"):
            path = "/" + path
        target = PRIMARY_ORIGIN + path
        if url.query:
            target += "?" + url.query
        return target

    def send_head(self):
        target = self.old_host_target()
        if target:
            return self.redirect(target)
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
