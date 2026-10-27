# Discovery build and validation

The first repair keeps the existing HTML/CSS/JavaScript site and Python tooling.

`python3 build_discovery.py` regenerates `herb-search-index.js` and the card regions
in both directory variants. Commit these outputs along with source changes; there
is no verified automatic build command in the repository. The generated assets
need no server runtime or package installation in production.

The build reads identities from `herbs.json` and discovery membership from
`discovery-profiles.json`. The initial 22 profiles remain discoverable; the
integration does not expand the directory to all 50 profiles. The old renderer
is no longer a dependency. Inclusion is not clinical approval: only the three
pilot profiles have source-check metadata, and the remaining profiles retain
their pending-review labels. To add an entry, first prepare its static profile,
then update the explicit list and regenerate discovery assets.

## Checks

Run from the repository root:

```sh
python3 build_discovery.py
python3 -m unittest discover -s tests -p 'test_*.py' -v
node --check script.js
node --check herb-directory.js
node --check herb-search-index.js
```

DOM tests use LinkeDOM as a test-only dependency, installed outside the project:

```sh
npm install --prefix /tmp/herbcraft-test linkedom@0.18.14 --no-save --ignore-scripts
NODE_PATH=/tmp/herbcraft-test/node_modules node --test tests/discovery.test.cjs
```

These cover static card parity, generated-file reproducibility, escaping,
common/botanical-name filtering, query injection, reset, keyboard autocomplete,
search form semantics, and navigation toggle/Escape behavior. They do not replace
real-browser layout, touch, or screen-reader testing.

## Preview acceptance

- Homepage: type `ginger`, click Search Herbs, confirm filtered directory.
- Homepage: type `Valeriana`, ArrowDown and Enter; verify destination.
- Directory: search `Zingiber`; Ginger should be the only result.
- Select B while searching Zingiber; empty state must explain how to recover.
- Clear: all 22 cards return, query parameter disappears, input regains focus.
- Load either directory URL with JavaScript disabled; all 22 links remain.
- At 375px and 320px: no horizontal overflow; toggle navigation and dismiss with
  Escape; search fields/buttons and alphabetical controls remain usable.
- At desktop width: navigation is visible and the mobile toggle is hidden.
- Check browser console and hosting preview before merging.

No production merge or deployment is included in this change.
