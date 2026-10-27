# Integrated profile foundation release

This branch combines PRs #17–21 into one main-targeted release candidate. It
preserves their history and includes the search/directory repair, reproducible
profile generator, three-profile source pilot, canonical routing, and helpful
404 page. The older PRs remain open for reference; use this integrated PR for
the release rather than merging each stacked branch separately.

Integration adjustment: discovery now reads an explicit 22-ID list from
`discovery-profiles.json`, not the retired legacy renderer. Profile identities
come from current `herbs.json`, so the source pilot's botanical names also appear
in search and directory cards. This does not expand editorial scope or imply
clinical review. The old JavaScript renderer is no longer used by discovery.

The workflow runs Python profile/source/route/link/discovery tests, bookmark
redirect tests, and six DOM behavior tests. LinkeDOM is a pinned test-only
package installed outside the project; production remains static HTML/CSS/JS.

Validated locally: 29 Python tests; 6 DOM tests; 7 redirect cases; all 50 profile
outputs reproduce; both directory variants and the search index reproduce;
no missing local destinations in the published HTML anchor audit.

## Remaining release check

The supplied URL https://herbcraft.app is the production domain. A live baseline
check cannot validate unmerged branch code. No preview link was present in the
checked PR comments or commit statuses; the GitHub connector does not expose
deployment records. Actual hosting rules and mobile/desktop visual layout have
not yet been verified for this release candidate.

Use a hosting preview built from this branch to check:

1. Homepage search submits its text; scientific-name autocomplete works.
2. Directory search/filter/reset works on mobile and desktop, with no horizontal
   overflow. Keyboard menu dismissal and focus remain usable.
3. Ginger, peppermint and chamomile show source-check labels and references;
   pending profiles retain honest pending-review labels.
4. Legacy bookmarks reach the same canonical static profile. Missing URLs show
   the custom botanical page with HTTP 404, and all recovery links work.
5. Check header, citation links, and the 404 page at 320px/375px and desktop widths.

Nothing has been merged or deployed by this work. After preview verification,
merge this single release PR and repeat the smoke checks against production.
