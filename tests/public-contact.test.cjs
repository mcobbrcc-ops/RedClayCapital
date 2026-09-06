const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { publicContact } = require('../lib/publicContact.ts');
test('public Google Voice contact controls share the requested number and native destinations', () => {
  assert.equal(publicContact.phone, '(919) 588-3714');
  assert.equal(publicContact.phoneE164, '+19195883714');
  assert.equal(publicContact.phoneHref, 'tel:+19195883714');
  assert.equal(publicContact.smsHref, 'sms:+19195883714');
  assert.equal(publicContact.email, 'offers@redclaycap.com');
  assert.equal(publicContact.emailHref, 'mailto:offers@redclaycap.com');
  assert.equal(publicContact.smsHref.includes('?'), false);
});
