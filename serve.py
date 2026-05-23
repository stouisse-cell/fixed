#!/usr/bin/env python3
import http.server
import os
import sys

port = int(os.environ.get('PORT', 3456))
directory = '/Users/alirahim/Desktop/Updatedsitemay13_complete'

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)
    def log_message(self, format, *args):
        pass  # suppress logs

with http.server.HTTPServer(('', port), Handler) as httpd:
    print(f'Serving on port {port}', flush=True)
    httpd.serve_forever()
