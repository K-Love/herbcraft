# Canonical profile routing

Generated `herbs/<id>.html` files are the profile view. Vercel and Netlify no
longer fall back to the JavaScript profile shell. Apache and the local Python
server resolve clean URLs to existing HTML files, leaving unknown URLs as 404s.

Old `herb-detail.html?herb=ginger` bookmarks redirect to `/herbs/ginger`.
The compatibility pages also provide a small JavaScript redirect for hosts or
query combinations not covered by server rules, and a usable directory link
without JavaScript. They do not load the old renderer. `herb-detail.js` remains
unloaded in the repository for compatibility with PR #17's discovery generator;
its embedded summaries are not a content source for the new profile routes.

## Verification

Run from repository root:

```
python3 -m unittest discover -s tests -p 'test_*.py' -v
node tests/test_legacy_redirect.js
python3 build.py --check
```

The HTTP tests use a real local server and compare all 50 clean profile responses
byte-for-byte with generated HTML. They cover missing-profile 404s, GET/HEAD,
legacy redirects, query strings, trailing slashes, assets, and the absence of
legacy renderer script tags. Seven JavaScript cases cover valid bookmarks,
unknown slugs, invalid input, and fragment preservation.

These tests do not emulate hosting-provider routing. Before merging/releasing,
verify the actual preview host serves `/herbs/ginger`, `/herbs/peppermint`, and
`/herbs/chamomile` with their source-check labels and reference links; test
`/herbs/no-such-herb` returns HTTP 404 and old bookmarks arrive at the same
profiles. Check desktop/mobile layout and citations in a real browser. No
preview URL was available in the checked commit statuses. Nothing was deployed.

Netlify uses its native clean HTML resolution / Pretty URLs. Removed the invalid
middle-wildcard HTML redirect and corrected query condition order, following
https://docs.netlify.com/manage/routing/redirects/redirect-options/ .
Vercel retains `cleanUrls: true`, following
https://vercel.com/docs/project-configuration/vercel-json .
Apache requires 2.4 with mod_rewrite and permission for these overrides; Apache
and the provider configurations have not been executed in this environment.

This branch stacks on PR #19, which stacks on #18. PR #17 is separate. Merge and
validate the combined changes in a hosting preview before production release.
