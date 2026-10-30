"""Synchronize the static header without requiring JavaScript to render navigation."""
import argparse
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent
PATTERN = re.compile(r'<header class="header">.*?</header>', re.S)


def build(check=False):
    source = (ROOT / 'components/site-header.html').read_text().strip()
    stale = []
    for path in ROOT.rglob('*.html'):
        if path == ROOT / 'components/site-header.html':
            continue
        html = path.read_text()
        updated = PATTERN.sub(lambda _: source, html)
        if updated != html:
            stale.append(str(path.relative_to(ROOT)))
            if not check:
                path.write_text(updated)
    return stale


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    stale = build(args.check)
    if args.check and stale:
        raise SystemExit('Stale headers: ' + ', '.join(stale))
    print('Shared headers verified.' if args.check else 'Shared headers synchronized. Run build.py after template changes.')
