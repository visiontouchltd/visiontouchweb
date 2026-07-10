/* Chatbot intent-engine tests. Run:  node build/test-chatbot-intents.mjs
   Loads the SAME engine + data files the browser uses. Exits 1 on failure. */
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
await import(pathToUrl('assets/js/chatbot-engine.js'));
function pathToUrl(rel) { return new URL('file:///' + path.join(ROOT, rel).replace(/\\/g, '/')).href; }

const engine = globalThis.VTChatEngine;
const intents = JSON.parse(readFileSync(path.join(ROOT, 'assets/data/chatbot-intents.json'), 'utf8'));
const knowledge = JSON.parse(readFileSync(path.join(ROOT, 'assets/data/chatbot-knowledge.json'), 'utf8'));
engine.init(intents, knowledge);

const cases = [
  // [message, expected intent, expected service (optional), expected area (optional)]
  ['Hello', 'greeting'],
  ['hi there', 'greeting'],
  ['Do you do loft conversions?', 'service', 'loft-conversions'],
  ['Can you renovate my kitchen?', 'service', 'kitchen-installation'],
  ['do you do roofing', 'service', 'roofing'],
  ['Can you convert a garage into a room?', 'service', 'garage-conversions'],
  ['I need new flooring in the living room', 'service', 'flooring'],
  ['can you remove a load bearing wall', 'service', 'structural-work'],
  ['Do you work in Wembley?', 'areas', null, 'Wembley'],
  ['do you cover croydon', 'areas', null, 'Croydon'],
  ['Are you available in Greater London?', 'areas'],
  ['How much will an extension cost?', 'quote', 'house-extensions'],
  ['Can I get a quote?', 'quote'],
  ['how much does a new bathroom cost', 'quote', 'bathroom-installation'],
  ['whats your pricing', 'quote'],
  ['Do I need planning permission?', 'planning'],
  ['can you help with building regulations', 'planning'],
  ['do you handle structural calculations', 'planning'],
  ['How long does a loft conversion take?', 'timeline', 'loft-conversions'],
  ['What is your process?', 'process'],
  ['do you visit the site first', 'process'],
  ['Are you reliable?', 'trust'],
  ['do you guarantee your work', 'trust'],
  ['can i see previous projects', 'trust'],
  ['Do you work with landlords?', 'investor'],
  ['do you work with developers', 'investor'],
  ['I want to speak to someone', 'human'],
  ['can someone call me back', 'human'],
  ['what are your opening hours', 'contact'],
  ['whats your email address', 'contact'],
  ['there is a gas leak and the wall is collapsing', 'emergency'],
  ['what services do you offer', 'services-general'],
  ['thanks', 'thanks'],
  ['tell me about quantum physics', 'fallback'],
  ['what is the meaning of life', 'fallback'],
];

let pass = 0, fail = 0;
for (const [msg, wantIntent, wantService, wantArea] of cases) {
  const r = engine.detect(msg);
  const okIntent = r.intent === wantIntent;
  const okService = wantService === undefined || wantService === null || r.service === wantService;
  const okArea = wantArea === undefined || r.area === wantArea;
  if (okIntent && okService && okArea) {
    pass++;
  } else {
    fail++;
    console.error(`✗ "${msg}"\n    got  intent=${r.intent} service=${r.service} area=${r.area} conf=${r.confidence.toFixed(2)}\n    want intent=${wantIntent} service=${wantService ?? '-'} area=${wantArea ?? '-'}`);
  }
}

// Confidence sanity: fallback must be low, clear matches must clear the threshold
const low = engine.detect('random gibberish xyzzy plugh').confidence;
const high = engine.detect('do I need planning permission for a loft conversion').confidence;
if (low > 0.2) { fail++; console.error(`✗ fallback confidence too high: ${low}`); }
if (high < 0.5) { fail++; console.error(`✗ strong-match confidence too low: ${high}`); }

console.log(`\n${pass + (fail === 0 ? 2 : 0)}/${cases.length + 2} checks — ${fail === 0 ? 'ALL PASS ✓' : fail + ' FAILED'}`);
process.exit(fail === 0 ? 0 : 1);
