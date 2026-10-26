// Compatibility for static hosts without query-string redirects.
// No profile content is rendered here; generated HTML is the only profile view.
(() => {
    const slug = new URLSearchParams(window.location.search).get('herb');
    if (slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        window.location.replace('/herbs/' + slug + window.location.hash);
    }
})();
