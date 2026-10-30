// DOM regression checks. Install linkedom outside the repository and set NODE_PATH.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { parseHTML } = require('linkedom');
const test = require('node:test');

function page(path, search = '') {
    const { document, window } = parseHTML(fs.readFileSync(path, 'utf8'));
    const location = { href: 'https://wildthesis.com/' + path + search, search };
    const context = vm.createContext({ document, window: {
        document, location, innerWidth: 375,
        history: { replaceState(_state, _title, url) { location.href = String(url); } },
        addEventListener() {},
    }, URL, URLSearchParams, setTimeout, console });
    window.HTMLElement.prototype.scrollIntoView = () => {};
    document.querySelectorAll('*').forEach(el => {
        el.scrollIntoView = () => {};
        el.focus = () => {};
    });
    const run = file => vm.runInContext(fs.readFileSync(file, 'utf8'), context);
    const event = (target, type, extras = {}) => {
        const e = new window.Event(type, { bubbles: true, cancelable: true });
        Object.assign(e, extras); target.dispatchEvent(e); return e;
    };
    return { document, context, run, event, ready: () => event(document, 'DOMContentLoaded'), location };
}

for (const path of ['herb-directory.html', 'herb-directory/index.html']) {
    test(path + ': static links, scientific search, combined filters and reset', () => {
        const p = page(path, '?search=Zingiber');
        assert.equal(p.document.querySelectorAll('#herb-grid a').length, 22);
        p.run('site-header.js'); p.run('script.js'); p.run('herb-directory.js'); p.ready();
        const visible = () => [...p.document.querySelectorAll('#herb-grid a')].filter(a => !a.hidden);
        assert.equal(visible().length, 1);
        assert.equal(visible()[0].dataset.name, 'Ginger');
        p.event(p.document.querySelector('[data-letter="B"]'), 'click');
        assert.equal(visible().length, 0);
        assert.equal(p.document.getElementById('directory-empty').hidden, false);
        assert.equal(p.document.querySelector('[data-letter="B"]').getAttribute('aria-pressed'), 'true');
        p.event(p.document.getElementById('directory-clear'), 'click');
        assert.equal(visible().length, 22);
        assert(!p.location.href.includes('search='));
    });
    test(path + ': hostile query stays text and navigation is connected', () => {
        const attack = '<img src=x onerror=alert(1)>';
        const p = page(path, '?search=' + encodeURIComponent(attack));
        p.run('site-header.js'); p.run('script.js'); p.run('herb-directory.js'); p.ready();
        assert.equal(p.document.querySelectorAll('img').length, 0);
        assert(p.document.getElementById('search-results-message').textContent.includes(attack));
        const toggle = p.document.querySelector('.header__menu-toggle');
        p.event(toggle, 'click');
        assert.equal(toggle.getAttribute('aria-expanded'), 'true');
        p.event(p.document, 'keydown', { key: 'Escape' });
        assert.equal(toggle.getAttribute('aria-expanded'), 'false');
    });
}

test('home: form submits query without JS; autocomplete covers supported scientific names', () => {
    const p = page('index.html');
    const input = p.document.getElementById('herb-search-input');
    const form = input.closest('form');
    assert.equal(form.getAttribute('action'), '/herb-directory');
    assert.equal(form.getAttribute('method'), 'get');
    assert.equal(input.getAttribute('name'), 'search');
    assert.equal(form.querySelector('button').getAttribute('type'), 'submit');
    let submitted = false;
    form.requestSubmit = () => { submitted = true; };
    p.run('herb-search-index.js'); p.run('site-header.js'); p.run('script.js'); p.ready();
    input.value = '  Valeriana  '; p.event(input, 'input');
    assert.equal(p.document.querySelectorAll('[role="option"]').length, 1);
    assert.equal(input.getAttribute('aria-expanded'), 'true');
    p.event(input, 'keydown', { key: 'ArrowDown' });
    assert.equal(input.getAttribute('aria-activedescendant'), 'search-item-0');
    p.event(input, 'keydown', { key: 'Enter' });
    assert.equal(p.location.href, '/herbs/valerian');
    p.event(input, 'keydown', { key: 'Escape' });
    assert.equal(input.getAttribute('aria-expanded'), 'false');
    assert.equal(input.hasAttribute('aria-activedescendant'), false);
    input.value = 'not-a-herb'; p.event(input, 'input');
    p.event(input, 'keydown', { key: 'Enter' });
    assert(submitted);
});

test('generated catalogue equals the explicit published discovery list', () => {
    const ids = JSON.parse(fs.readFileSync('discovery-profiles.json', 'utf8')).sort();
    const p = page('index.html'); p.run('herb-search-index.js');
    const generated = JSON.parse(JSON.stringify(p.context.window.HerbCraftSearchIndex));
    assert.deepEqual(generated.map(h => h.id).sort(), ids);
    for (const herb of generated) assert(fs.existsSync('herbs/' + herb.id + '.html'));
});

for (const path of ['herbs/ginger.html', 'about/index.html', 'quiz/index.html', '404.html']) {
    test(path + ': shared navigation works without discovery-page styling', () => {
        const p = page(path);
        assert.equal(p.document.querySelectorAll('.header .nav__link').length, 5);
        assert.equal(p.document.querySelector('.logo').getAttribute('href'), '/');
        p.run('site-header.js'); p.ready();
        const toggle = p.document.querySelector('.header__menu-toggle');
        p.event(toggle, 'click');
        assert.equal(toggle.getAttribute('aria-expanded'), 'true');
        assert.notEqual(p.document.body.style.overflow, 'hidden');
        p.event(p.document.querySelector('.nav__link'), 'click');
        assert.equal(toggle.getAttribute('aria-expanded'), 'false');
    });
}
