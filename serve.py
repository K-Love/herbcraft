#!/usr/bin/env python3
import http.server
import os

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?')[0].rstrip('/')
        base = os.getcwd()
        if path.startswith('/herbs/') and len(path.split('/')) == 3:
            slug = path.split('/')[2]
            if slug and not os.path.exists(base + path):
                self.path = '/herbs/index.html'
        super().do_GET()

if __name__ == '__main__':
    PORT = 8080
    with http.server.HTTPServer(('', PORT), CleanURLHandler) as httpd:
        print(f'Serving at http://localhost:{PORT}')
        httpd.serve_forever()
