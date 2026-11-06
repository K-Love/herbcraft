# Wild Thesis launch

`wildthesis.com` is the Netlify primary domain. `www.wildthesis.com` already redirects there. `herbcraft.app` and `www.herbcraft.app` remain attached as aliases.

## Old-host redirects

Those aliases were still returning HTTP 200. Netlify serves an existing file ahead of a shadowable redirect, so a domain alias does not leave the old host unless the rule is forced. `_redirects` now starts with forced 301s for `http` and `https` on `herbcraft.app` and `www.herbcraft.app` only. The splat keeps the path, and Netlify appends the original query string on a 301.

The rules do not match `wildthesis.com`, `www.wildthesis.com`, or a deploy preview. They cannot loop with Netlify's primary-domain redirect. Do not replace them with an unscoped `/*` rule, and do not add them again while an old host is primary.

A missing path on the primary domain stays a genuine 404. The same path on an old host is a 301 to that path on `https://wildthesis.com`, and the second response is the 404. One response cannot both move the host and report the missing canonical path. Missing URLs are not rewritten to the homepage.

The legacy path rules are unchanged and apply after the request reaches the primary host. `/herb-detail.html?herb=ginger` first moves to that same path and query on `https://wildthesis.com`. The existing rule then rewrites the path to `/herbs/ginger` and Netlify keeps the query string, which is the current primary-host behavior.

## Check after this deploy

1. `https://herbcraft.app/herbs/ginger` and `https://www.herbcraft.app/herbs/ginger` return 301 to `https://wildthesis.com/herbs/ginger`.
2. `https://herbcraft.app/herb-detail.html?herb=ginger` returns 301 to `https://wildthesis.com/herb-detail.html?herb=ginger`. The next response rewrites the path to `/herbs/ginger` and keeps the query, same as a request that already started on the primary host.
3. `https://herbcraft.app/herb-directory?search=mint` returns 301 to the same path and query on `https://wildthesis.com`.
4. `https://herbcraft.app/contact/thanks/` returns 301 to `https://wildthesis.com/contact/thanks/`.
5. `https://wildthesis.com/not-a-real-page` returns 404 with no Location header. `https://herbcraft.app/not-a-real-page` returns 301 to that URL, which then returns 404.
6. `https://wildthesis.com/herbs/ginger` stays on the primary host. `https://www.wildthesis.com/herbs/ginger` may 301 to the apex, and must not point at an old host.

Deploy-preview hostnames are not the old domains, so this preview will not show the host redirect. The rules are covered by the local host tests.

Confirm the Netlify Forms `contact` form is detected on the production deploy and that its existing notification settings still reach the operator. Leave the public pages without a published mailbox.

Verify the new property in Search Console, submit `https://wildthesis.com/sitemap.xml`, and complete the domain-move workflow as appropriate. Monitor indexing and 404 reports after launch.

## Deliberately preserved

- Existing page paths, route rules, research content, source-check status, and recorded dates.
- The Netlify contact form and thank-you page. Public pages do not publish a mailbox.
- Existing Amazon affiliate identifier and analytics identifier.
- Internal `HerbCraftSearchIndex` global, which is a code contract rather than public branding.
- Historical project documents and the GitHub repository name.

## Rollback

If launch fails, restore the previous Netlify production deploy and restore `herbcraft.app` as primary together. This deploy's host rules point at `wildthesis.com`; leaving them published while an old host is primary can loop. Leave both new domain aliases attached while diagnosing; do not delete DNS records or the original domain.
