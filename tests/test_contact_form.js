const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const email = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const skipDirs = new Set(['.git', 'node_modules', 'dist', 'build']);

function files(dir, acc = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (skipDirs.has(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files(full, acc);
        else if (/\.(html|js|cjs|json|xml|md|css|txt|py)$/i.test(entry.name)) acc.push(full);
        else acc.push(full);
    }
    return acc;
}

const htmlFiles = [];
for (const file of files(root)) {
    const rel = path.relative(root, file);
    if (rel === path.join('tests', 'test_contact_form.js')) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (/\.(html|js|cjs|json|xml|md|css|txt|py)$/i.test(file)) {
        assert.equal(text.includes('mailto:'), false, rel + ' contains mailto:');
        assert.equal(/tel:/i.test(text), false, rel + ' contains tel:');
        const found = text.match(email);
        assert.equal(found, null, rel + ' contains an email address: ' + found);
    }
    if (file.endsWith('.html')) htmlFiles.push({ rel, text });
}

const contact = htmlFiles.find(file => file.rel === path.join('contact', 'index.html'));
assert.ok(contact, 'contact page exists');
assert.match(contact.text, /<h1>Contact<\/h1>/);
assert.doesNotMatch(contact.text, /Contact Us/);
assert.match(contact.text, /data-netlify="true"/);
assert.match(contact.text, /netlify-honeypot="bot-field"/);
assert.match(contact.text, /name="contact"/);
assert.match(contact.text, /method="POST"/);
assert.match(contact.text, /action="\/contact\/thanks\/"/);
assert.match(contact.text, /name="form-name" value="contact"/);
assert.match(contact.text, /name="bot-field"/);
assert.match(contact.text, /name="name"/);
assert.match(contact.text, /type="email"/);
assert.match(contact.text, /name="message"/);
assert.match(contact.text, /WildThesis/);

const thanks = htmlFiles.find(file => file.rel === path.join('contact', 'thanks', 'index.html'));
assert.ok(thanks, 'thank-you page exists');
assert.match(thanks.text, /Thank you/);
assert.match(thanks.text, /WildThesis/);
assert.equal(thanks.text.includes('<form'), false, 'thank-you page must not contain a second form');

for (const file of htmlFiles) {
    if (!file.text.includes('class="nav__list"')) continue;
    const nav = file.text.split('class="nav__list"')[1].split('</ul>')[0];
    assert.match(nav, /href="\/contact\/"/, file.rel + ' header nav is missing Contact');
    const footer = file.text.split('class="footer__nav-list"')[1];
    assert.ok(footer, file.rel + ' is missing a footer nav');
    assert.match(footer.split('</ul>')[0], /href="\/contact\/"/, file.rel + ' footer nav is missing Contact');
}

const missing = htmlFiles.find(file => file.rel === '404.html');
assert.match(missing.text, /href="\/contact\/"/);

console.log('contact form, thank-you page, navigation, and email scan passed');
