/* Focused server contract tests. All storage/RCI fetches are simulated; this is not live delivery proof. */
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createHash, createHmac } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const originalLoad = Module._load;
let deferred = [];
Module._load = function (name, parent, main) {
  if (name === 'server-only') return {};
  if (name === 'next/server') return { after: callback => deferred.push(callback) };
  return originalLoad.call(this, name.startsWith('@/') ? path.resolve(__dirname, '..', name.slice(2)) : name, parent, main);
};
const { buildWebsiteLeadPayload, sanitizeAttribution, sanitizeAttributionTouch, sanitizeLeadUrl, readLeadRequest } = require('../lib/internetLeadValidation.ts');
const { stableStringify, INTERNET_LEAD_CONSENT_VERSION } = require('../lib/internetLeadContract.ts');
const { durablyAcceptWebsiteLead, deliverWebsiteLeadOutbox } = require('../lib/internetLeadOutbox.ts');
const { POST } = require('../app/api/leads/route.ts');
const form = overrides => ({ name: 'Synthetic QA Seller', address: '100 TEST ONLY Lane, Raleigh, NC 27601', phone: '', email: 'synthetic@example.invalid', preferredContactMethod: 'email', consent: true, consentVersion: INTERNET_LEAD_CONSENT_VERSION, submissionId: '945d92b1-026a-4a91-94a0-2b6df3af2893', submittedAt: '2026-09-05T14:00:00.000Z', ...overrides });
const request = body => new Request('https://redclaycap.com/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const json = (body, status = 200) => Response.json(body, { status });
const hash = value => createHash('sha256').update(value).digest('hex');
beforeEach(() => {
  deferred = [];
  Object.assign(process.env, { WEBSITE_OUTBOX_SUPABASE_URL: 'https://storage.test.invalid', WEBSITE_OUTBOX_SUPABASE_KEY: 'test-key', WEBSITE_INTEGRATION_ID: 'immutable-test-integration', WEBSITE_INTEGRATION_ACCEPT_SECRET: 'test-accept', WEBSITE_INTEGRATION_WORKER_SECRET: 'test-worker', RCI_INTAKE_KEY_ID: 'test-key-id', RCI_INTAKE_HMAC_SECRET: 'test-hmac', RCI_INTAKE_URL: 'https://rci.test.invalid/api/internet-leads/intake', LEAD_INTAKE_HASH_SALT: 'test-salt' });
  global.fetch = async () => { throw new Error('Unexpected outbound fetch in isolated test'); };
});
test('email-only and phone-only inquiries; consent channels follow preference', () => {
  assert.deepEqual(buildWebsiteLeadPayload(form()).consent.channels, ['email']);
  const phone = buildWebsiteLeadPayload(form({ email: '', phone: '+1 (919) 555-0100', preferredContactMethod: 'sms' }));
  assert.deepEqual(phone.consent.channels, ['sms']);
  assert.equal(phone.contact.email, '');
});
test('invalid bodies, malformed contact, mismatched preference, consent and honeypot reject explicitly', () => {
  for (const input of [null, [], form({ name: 'A' }), form({ address: 'X' }), form({ phone: 'call 9195550100' }), form({ email: 'bad' }), form({ preferredContactMethod: 'sms' }), form({ consent: 'true' }), form({ consentVersion: 'old' }), form({ company: 'autofilled business' }), form({ submissionId: 'not-uuid' })]) assert.throws(() => buildWebsiteLeadPayload(input));
});
test('only permitted attribution survives; URLs have no query, fragments, credentials or external referrer path', () => {
  assert.equal(sanitizeLeadUrl('/get-offer?email=private@example.invalid#name'), 'https://redclaycap.com/get-offer');
  assert.equal(sanitizeLeadUrl('javascript:alert(1)'), '');
  assert.equal(sanitizeLeadUrl('https://user:pass@evil.invalid/'), '');
  assert.deepEqual(sanitizeAttribution({ utm_source: 'google', gclid: 'click_test-123', email: 'private@example.invalid', utm_campaign: 'private@example.invalid', utm_term: '919-555-0100', arbitrary: 'private' }), { utm_source: 'google', gclid: 'click_test-123' });
  assert.deepEqual(sanitizeAttributionTouch({ landingPath: '/areas/north-carolina?address=private', referrer: 'https://search.invalid/private?name=private', arbitrary: 'private' }), { landingPath: '/areas/north-carolina', referringUrl: 'https://search.invalid' });
});
test('timestamp, payload hash and attribution remain stable on retry; later inquiry has a new identity', () => {
  const input = form({ attribution: { utm_source: 'google' }, firstTouch: { utm_source: 'newsletter' }, latestTouch: { utm_source: 'google' } });
  assert.equal(stableStringify(buildWebsiteLeadPayload(input)), stableStringify(buildWebsiteLeadPayload(JSON.parse(JSON.stringify(input)))));
  assert.notEqual(buildWebsiteLeadPayload(input).externalSubmissionId, buildWebsiteLeadPayload(form({ submissionId: 'a45d92b1-026a-4a91-94a0-2b6df3af2893' })).externalSubmissionId);
  assert.equal(buildWebsiteLeadPayload(form()).attribution.source, 'unknown');
});
test('streamed bytes are bounded without trusting content-length', async () => {
  await assert.rejects(() => readLeadRequest(request({ details: 'x'.repeat(40000) })), error => error.status === 413);
  const misleading = new Request('https://redclaycap.com/api/leads', { method: 'POST', headers: { 'content-type': 'application/json', 'content-length': '1' }, body: JSON.stringify({ details: 'x'.repeat(40000) }) });
  await assert.rejects(() => readLeadRequest(misleading), error => error.status === 413);
  assert.deepEqual(await readLeadRequest(request(form())), form());
});
test('durable acceptance uses only configured integration identity and hashes private evidence', async () => {
  delete process.env.RCI_INTAKE_URL; // Delivery configuration is not a prerequisite to durable acceptance.
  global.fetch = async (url, options) => {
    assert.match(String(url), /website_accept_lead_outbox$/);
    const body = JSON.parse(options.body);
    assert.equal(body.p_integration_id, 'immutable-test-integration');
    assert.equal(body.p_payload.workspaceId, undefined);
    assert.notEqual(body.p_ip_hash, '192.0.2.1');
    return json([{ submission_id: 'receipt', submission_status: 'PENDING', duplicate: false }]);
  };
  const accepted = await durablyAcceptWebsiteLead(buildWebsiteLeadPayload(form({ workspaceId: 'attacker', userId: 'attacker' })), { ip: '192.0.2.1', userAgent: 'Synthetic QA' });
  assert.equal(accepted.submission_id, 'receipt');
});
test('response loss after durable write retries the identical ID/hash and yields duplicate receipt', async () => {
  let saved;
  global.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    if (!saved) { saved = body; throw new DOMException('simulated response loss', 'TimeoutError'); }
    assert.equal(body.p_external_submission_id, saved.p_external_submission_id);
    assert.equal(body.p_payload_hash, saved.p_payload_hash);
    return json([{ submission_id: 'saved-receipt', submission_status: 'PENDING', duplicate: true }]);
  };
  const input = buildWebsiteLeadPayload(form());
  await assert.rejects(() => durablyAcceptWebsiteLead(input, { ip: '', userAgent: '' }));
  assert.equal((await durablyAcceptWebsiteLead(input, { ip: '', userAgent: '' })).duplicate, true);
});
test('public route never reports success before storage; honeypot and rate limits return honest failure', async () => {
  assert.equal((await POST(request(form({ company: 'bot' })))).status, 400);
  assert.equal((await POST(request(form()))).status, 503);
  global.fetch = async () => json({ code: 'P0001', message: 'submission rate limit reached' }, 400);
  assert.equal((await POST(request(form()))).status, 429);
  assert.equal(deferred.length, 0);
  global.fetch = async () => json([{ submission_id: 'receipt', submission_status: 'PENDING', duplicate: false }]);
  const response = await POST(request(form()));
  assert.equal(response.status, 202);
  assert.equal((await response.json()).reference, form().submissionId);
  assert.equal(deferred.length, 1);
});
function deliveryFetch(remote, log) {
  const payload = buildWebsiteLeadPayload(form());
  return async (url, options) => {
    const body = JSON.parse(options.body);
    log.push({ url: String(url), body, options });
    if (String(url).endsWith('website_claim_lead_outbox')) return json([{ submission_id: 'row', external_submission_id: payload.externalSubmissionId, payload, payload_hash: hash(stableStringify(payload)), attempt_number: 1 }]);
    if (String(url).startsWith('https://rci.test.invalid')) return remote(options);
    return json({});
  };
}
test('downstream timeout persists retry; recovery sends authenticated stable payload and saves receipt', async () => {
  const log = [];
  global.fetch = deliveryFetch(async () => { throw new DOMException('timeout', 'TimeoutError'); }, log);
  assert.equal((await deliverWebsiteLeadOutbox(2)).retrying, 1);
  assert.equal(log.at(-1).body.p_retryable, true);
  global.fetch = deliveryFetch(async options => {
    const headers = options.headers;
    const canonical = ['v1', headers['x-redclay-timestamp'], headers['x-redclay-nonce'], hash(options.body), 'POST', '/api/internet-leads/intake'].join('\n');
    assert.equal(headers['x-redclay-signature'], createHmac('sha256', 'test-hmac').update(canonical).digest('hex'));
    assert.equal(options.redirect, 'manual');
    return json({ ok: true, inquiryId: 'inquiry', duplicate: true });
  }, log);
  assert.equal((await deliverWebsiteLeadOutbox(2)).delivered, 1);
  assert.match(log.at(-1).url, /website_complete_lead_outbox$/);
});
test('malformed successful downstream response retries instead of losing accepted inquiry', async () => {
  const log = [];
  global.fetch = deliveryFetch(async () => json({ ok: true }), log);
  assert.equal((await deliverWebsiteLeadOutbox()).retrying, 1);
  assert.equal(log.at(-1).body.p_retryable, true);
});
test('permanent downstream rejection is visible as a dead letter', async () => {
  const log = [];
  global.fetch = deliveryFetch(async () => json({ ok: false }, 400), log);
  assert.equal((await deliverWebsiteLeadOutbox()).deadLettered, 1);
  assert.equal(log.at(-1).body.p_retryable, false);
});
test('all market and campaign paths keep first and submission touch independent', () => {
  for (const landingPath of ['/areas/north-carolina', '/areas/georgia', '/areas/ohio', '/get-offer']) {
    const payload = buildWebsiteLeadPayload(form({ landingPageUrl: `https://redclaycap.com${landingPath}?utm_source=search&name=private`, firstTouch: { utm_source: 'newsletter', landingPath }, latestTouch: { utm_source: 'google', pageUrl: '/get-offer?email=private' }, attribution: { utm_source: 'google', utm_campaign: 'synthetic_qa' } }));
    assert.equal(payload.attribution.landingPageUrl, `https://redclaycap.com${landingPath}`);
    assert.equal(payload.attribution.firstTouch.utm_source, 'newsletter');
    assert.equal(payload.attribution.latestTouch.utm_source, 'google');
    assert.equal(payload.attribution.latestTouch.pageUrl, 'https://redclaycap.com/get-offer');
  }
});
test('reusing an ID with edited details surfaces a conflict instead of false success', async () => {
  global.fetch = async () => json({ code: '23505', message: 'submission identifier already exists with different content' }, 409);
  const response = await POST(request(form()));
  assert.equal(response.status, 409);
  assert.equal((await response.json()).ok, false);
});
test('a lost receipt after successful remote write remains eligible for durable retry', async () => {
  const log = [];
  const standard = deliveryFetch(async () => json({ ok: true, inquiryId: 'already-written-inquiry' }), log);
  global.fetch = async (url, options) => {
    if (String(url).endsWith('website_complete_lead_outbox')) throw new DOMException('simulated lost receipt', 'TimeoutError');
    return standard(url, options);
  };
  assert.equal((await deliverWebsiteLeadOutbox()).retrying, 1);
  assert.equal(log.at(-1).body.p_error_class, 'receipt_persistence');
  assert.equal(log.at(-1).body.p_retryable, true);
});
test('missing or gated receiver preserves the lead for retry and never follows a signed redirect', async () => {
  for (const status of [301, 302, 307, 308, 401, 403, 404]) {
    const log = [];
    global.fetch = deliveryFetch(async options => {
      assert.equal(options.redirect, 'manual');
      return new Response('<html>Access required</html>', { status, headers: { location: 'https://unintended.test.invalid/access', 'content-type': 'text/html' } });
    }, log);
    const result = await deliverWebsiteLeadOutbox(2);
    assert.equal(result.retrying, 1);
    assert.equal(result.deadLettered, 0);
    assert.equal(log.filter(call => call.url.startsWith('https://rci.test.invalid')).length, 1);
    assert.equal(log.some(call => call.url.startsWith('https://unintended.test.invalid')), false);
    assert.equal(log.at(-1).body.p_retryable, true);
    assert.equal(log.at(-1).body.p_error_class, `receiver_configuration_${status}`);
  }
});
