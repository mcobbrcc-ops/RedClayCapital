// Run with the read-only RCI release contract path to check real schema compatibility.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { buildWebsiteLeadPayload } = require('../lib/internetLeadValidation.ts');
const { INTERNET_LEAD_CONSENT_VERSION } = require('../lib/internetLeadContract.ts');
if (!process.argv[2]) throw new Error('Supply the existing RCI src/lib/internet-leads/contract.ts path');
const { internetLeadSubmissionSchema } = require(path.resolve(process.argv[2]));
for (const preferredContactMethod of ['phone', 'sms', 'email']) {
  const payload = buildWebsiteLeadPayload({ name: 'Synthetic QA Seller', address: '100 TEST ONLY Lane, Raleigh, NC 27601', phone: preferredContactMethod === 'email' ? '' : '9195550100', email: preferredContactMethod === 'email' ? 'synthetic@example.invalid' : '', preferredContactMethod, consent: true, consentVersion: INTERNET_LEAD_CONSENT_VERSION, submissionId: '945d92b1-026a-4a91-94a0-2b6df3af2893', submittedAt: '2026-09-05T14:00:00.000Z' });
  const result = internetLeadSubmissionSchema.safeParse(payload);
  assert.equal(result.success, true, JSON.stringify(result.error?.issues));
}
console.log('RCI schema compatibility passed for phone, sms and email-only submissions. No network or database delivery performed.');
