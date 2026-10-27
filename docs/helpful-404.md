# Helpful 404 and broken-link prevention

The custom `404.html` matches HerbCraft's parchment and botanical-green palette,
with a lightweight inline plant illustration and the headline “Looks like this
page has gone to seed.” Recovery links lead to the directory, home, three
published profiles, and safety notes. It requires no JavaScript, external fonts,
image downloads, or network calls beyond its own root-relative stylesheet.
Keyboard focus, a skip link, responsive cards and a mobile layout are included.
No missing URL is reflected into the page.

Netlify and Vercel discover the root `404.html` automatically. Apache uses a local
`ErrorDocument`; `serve.py` serves the same page with HTTP 404 for GET and HEAD.
Missing pages keep their requested URL and a real 404 status. There is no blanket
redirect to home, which would hide broken links and confuse visitors.

The static HTML anchor audit found two missing destinations on the blood-sugar
condition page: berberine and bitter melon. Removed their unavailable profile
cards and changed the condition generator to skip herbs absent from herbs.json.
Only the card fragment was regenerated; other condition copy and dates are
unchanged. This is not a review of the condition page's health claims.

CI now checks local anchor destinations across published HTML (excluding build
templates), the generator's missing-profile behavior, custom error GET/HEAD
responses, and all recovery destinations. The anchor audit does not inspect
external URLs, JavaScript-created links, fragments, or production traffic logs.
It prevents known internal dead ends; inbound typos and stale external links can
still produce 404s. Add specific redirects when a verified replacement exists.

Validation: 26 Python tests, 7 JavaScript cases, all 50 reproducible profiles,
and git diff --check pass locally. Browser layout and actual host behavior still
need a deployed preview check; the cloud browser cannot reach the local server.

Host references:
- https://vercel.com/kb/guide/custom-404-page
- https://docs.netlify.com/manage/routing/redirects/redirect-options/
- https://httpd.apache.org/docs/current/en/custom-error.html

This change stacks on PR #20. No merge or deployment is included.
