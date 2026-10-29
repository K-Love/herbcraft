# Wild Thesis launch

This PR prepares the rebrand for preview. It does not change Netlify's primary domain or enable cross-domain redirects.

## Review and launch

1. Review the deploy preview on desktop and phone: homepage, directory search, a profile, navigation, footer, and a missing URL.
2. Confirm HTTPS works for both `wildthesis.com` and `www.wildthesis.com` in Netlify. Keep the existing HerbCraft domain attached and renewed.
3. After approval, merge this PR and confirm the production deploy succeeds. Set `wildthesis.com` as the primary domain on the existing Netlify project in the same launch window, so canonical URLs and the primary domain agree.
4. Verify the old domain and `www` redirect to the new primary, retaining paths and queries. Check `/herbs/ginger`, `/herb-detail.html?herb=ginger`, `/herb-directory?search=mint`, and an unknown URL (which must retain a real 404 status).
5. Do not add a forced old-to-new redirect while the old domain remains primary: Netlify's primary-domain redirect could create a loop. If automatic alias redirects are insufficient, investigate the actual response chain before adding rules.
6. Verify the new property in Search Console, submit `https://wildthesis.com/sitemap.xml`, and complete the domain-move workflow as appropriate. Monitor indexing and 404 reports after launch.

## Deliberately preserved

- Existing page paths, route rules, research content, source-check status, and recorded dates.
- `hello@herbcraft.app` and `herbcraft@backstageinteractive.com`: no new mailbox has been confirmed. Verify delivery before changing contact details.
- Existing Amazon affiliate identifier and analytics identifier.
- Internal `HerbCraftSearchIndex` global, which is a code contract rather than public branding.
- Historical project documents and the GitHub repository name.

## Rollback

If launch fails, restore the previous Netlify production deploy and restore `herbcraft.app` as primary together. Leave both new domain aliases attached while diagnosing; do not delete DNS records or the original domain.
