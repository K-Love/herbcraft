const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync('legacy-profile-redirect.js', 'utf8');
for (const [search, expected] of [
    ['?herb=ginger', '/herbs/ginger#safety'],
    ['?herb=st-johns-wort', '/herbs/st-johns-wort#safety'],
    ['?herb=unknown-herb', '/herbs/unknown-herb#safety'],
    ['?herb=//evil.example', null],
    ['?herb=%3Cscript%3E', null],
    ['?herb=ginger%0A', null],
    ['', null]
]) {
    let destination = null;
    vm.runInNewContext(code, {URLSearchParams, window: {location: {
        search, hash: '#safety', replace: value => { destination = value; }
    }}});
    assert.equal(destination, expected, search);
}
console.log('7 legacy redirect cases passed');
