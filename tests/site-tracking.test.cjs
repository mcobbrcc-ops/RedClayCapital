const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { webcrypto } = require('node:crypto');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const load = () => { const file = require.resolve('../lib/siteTracking.ts'); delete require.cache[file]; return require(file); };
let storage;
function visit(value) { global.window.location = new URL(value); }
beforeEach(() => {
  storage = new Map();
  global.sessionStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  global.window = { location: new URL('https://redclaycap.com/get-offer?email=private@example.invalid#private'), crypto: webcrypto };
  global.document = { referrer: 'https://search.invalid/private?email=private@example.invalid' };
  Object.defineProperty(global, 'navigator', { value: { doNotTrack: '0' }, configurable: true });
});
test('direct GA receives a real generate_lead gtag event with category-only context', async () => {
  const tracker = load(); const events = [];
  window.gtag = (...args) => events.push(args);
  tracker.configureSiteTracking({ gaId: 'G-TEST' }); tracker.allowTracking(true);
  await tracker.trackSiteEvent('generate_lead', 'synthetic-private-reference');
  assert.equal(events.length, 1);
  assert.deepEqual(events[0], ['event', 'generate_lead', { page_type: 'offer', page_location: 'https://redclaycap.com/get-offer', page_referrer: '', page_title: 'Red Clay Capital', send_to: 'G-TEST' }]);
  assert.doesNotMatch(JSON.stringify(events), /private|example.invalid/);
});
test('GA events queued before script loading use the standard gtag arguments shape', async () => {
  const tracker = load(); tracker.configureSiteTracking({ gaId: 'G-TEST' }); tracker.allowTracking(true);
  await tracker.trackSiteEvent('form_start');
  assert.deepEqual(Array.from(window.dataLayer[0]).slice(0, 2), ['event', 'form_start']);
  assert.equal(window.dataLayer[0].event, undefined);
});
test('GTM owns one custom event when both containers are configured', async () => {
  const tracker = load(); tracker.configureSiteTracking({ gaId: 'G-TEST', gtmId: 'GTM-TEST' }); tracker.allowTracking(true);
  window.gtag = () => assert.fail('GTM configuration must not also emit GA events');
  await tracker.trackSiteEvent('generate_lead', 'receipt-one');
  assert.equal(window.dataLayer.length, 1);
  assert.equal(window.dataLayer[0].event, 'generate_lead');
});
test('duplicate clicks and refreshes emit one conversion without storing the raw reference', async () => {
  let tracker = load(); tracker.configureSiteTracking({ gaId: 'G-TEST' }); tracker.allowTracking(true);
  await Promise.all([tracker.trackSiteEvent('generate_lead', 'private-receipt'), tracker.trackSiteEvent('generate_lead', 'private-receipt')]);
  assert.equal(window.dataLayer.length, 1);
  assert.doesNotMatch(JSON.stringify([...storage]), /private-receipt/);
  tracker = load(); tracker.configureSiteTracking({ gaId: 'G-TEST' }); tracker.allowTracking(true);
  await tracker.trackSiteEvent('generate_lead', 'private-receipt');
  assert.equal(window.dataLayer.length, 1);
  await tracker.trackSiteEvent('generate_lead', 'later-inquiry');
  assert.equal(window.dataLayer.length, 2);
});
test('no provider, withheld consent, DNT and missing acceptance receipt suppress events', async () => {
  const tracker = load(); tracker.allowTracking(true);
  await tracker.trackSiteEvent('form_start'); assert.equal(window.dataLayer, undefined);
  tracker.configureSiteTracking({ gaId: 'G-TEST' }); tracker.allowTracking(false);
  await tracker.trackSiteEvent('generate_lead', 'receipt'); assert.equal(window.dataLayer, undefined);
  tracker.allowTracking(true); navigator.doNotTrack = '1';
  await tracker.trackSiteEvent('form_start'); assert.equal(window.dataLayer, undefined);
  navigator.doNotTrack = '0'; await tracker.trackSiteEvent('generate_lead'); assert.equal(window.dataLayer, undefined);
});
test('first and later campaign touch survive internal navigation without storing private URL parameters', () => {
  const tracker = load();
  visit('https://redclaycap.com/areas-we-serve/north-carolina?utm_source=newsletter&email=private@example.invalid');
  tracker.captureTouch();
  visit('https://redclaycap.com/get-offer?utm_source=google&utm_campaign=synthetic_test&name=private');
  tracker.captureTouch();
  visit('https://redclaycap.com/contact?phone=9195550100');
  const result = tracker.captureTouch();
  assert.equal(result.firstTouch.utm_source, 'newsletter');
  assert.equal(result.latestTouch.utm_source, 'google');
  assert.equal(result.attribution.utm_campaign, 'synthetic_test');
  assert.equal(result.latestTouch.pageUrl, 'https://redclaycap.com/contact');
  assert.equal(result.referringUrl, 'https://search.invalid');
  assert.doesNotMatch(JSON.stringify([...storage]), /private|9195550100|example.invalid/);
  assert.equal(load().captureTouch().firstTouch.utm_source, 'newsletter');
});
test('blocked browser storage preserves form attribution and memory deduplication', async () => {
  global.sessionStorage = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
  const tracker = load(); tracker.configureSiteTracking({ gaId: 'G-TEST' }); tracker.allowTracking(true);
  assert.ok(tracker.captureTouch());
  await tracker.trackSiteEvent('generate_lead', 'receipt'); await tracker.trackSiteEvent('generate_lead', 'receipt');
  assert.equal(window.dataLayer.length, 1);
});
test('arbitrary URL paths and analytics failures cannot leak form data or break accepted submission', async () => {
  const tracker = load(); tracker.configureSiteTracking({ gaId: 'G-TEST' }); tracker.allowTracking(true);
  visit('https://redclaycap.com/private-owner/private@example.invalid');
  assert.equal(tracker.trackingPageContext(window.location.pathname).page_location, 'https://redclaycap.com/site');
  window.gtag = () => { throw new Error('tracking blocked'); };
  await assert.doesNotReject(() => tracker.trackSiteEvent('generate_lead', 'receipt'));
});
