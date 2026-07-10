/* Cloudflare Pages Function: POST /api/chat/lead
   Receives a qualified lead from the chatbot, validates it, optionally checks
   a Cloudflare Turnstile token, then forwards it to the existing enquiry
   pipeline (Web3Forms → inquiries@visiontouchltd.co.uk).

   Env vars (all optional — sensible defaults built in):
     CHATBOT_FORM_ENDPOINT   default https://api.web3forms.com/submit
     CHATBOT_FORM_KEY        default: the site's public Web3Forms access key
     CHATBOT_CONTACT_EMAIL   informational only (used in error messages)
     TURNSTILE_SECRET_KEY    if set, a `turnstileToken` field becomes required
   Note: the widget also has a client-side fallback that posts to Web3Forms
   directly if this function is unreachable — never block on this endpoint. */

const DEFAULT_FORM_KEY = 'bfc71cc9-2ef2-4d65-a6f3-56e8bd231e6b'; // public Web3Forms key (same as site forms)

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });

const FIELDS = ['name', 'contact', 'project_type', 'location', 'property_type', 'description', 'timeframe', 'plans', 'preferred_contact', 'source'];

export async function onRequestPost({ request, env }) {
  try {
    const b = await request.json().catch(() => null);
    if (!b) return json({ success: false, error: 'invalid json' }, 400);

    // validation
    const clean = {};
    for (const f of FIELDS) {
      if (typeof b[f] === 'string' && b[f].trim()) clean[f] = b[f].trim().slice(0, f === 'description' ? 1000 : 200);
    }
    if (!clean.name || !clean.contact || !clean.project_type) {
      return json({ success: false, error: 'name, contact and project_type are required' }, 400);
    }
    const looksContact = /^[0-9 +()\-]{7,}$/.test(clean.contact) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.contact);
    if (!looksContact) return json({ success: false, error: 'contact must be a phone number or email' }, 400);

    // optional Turnstile verification
    if (env.TURNSTILE_SECRET_KEY) {
      const token = b.turnstileToken;
      if (!token) return json({ success: false, error: 'turnstile token required' }, 403);
      const v = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get('cf-connecting-ip') || '' })
      }).then((r) => r.json()).catch(() => ({ success: false }));
      if (!v.success) return json({ success: false, error: 'turnstile verification failed' }, 403);
    }

    // forward to the enquiry pipeline
    const fd = new FormData();
    fd.append('access_key', env.CHATBOT_FORM_KEY || DEFAULT_FORM_KEY);
    fd.append('subject', `Chatbot Enquiry — ${clean.project_type}${clean.location ? ' in ' + clean.location : ''}`);
    fd.append('from_name', 'Vision Touch Website Chatbot');
    for (const [k, v] of Object.entries(clean)) fd.append(k, v);

    const endpoint = env.CHATBOT_FORM_ENDPOINT || 'https://api.web3forms.com/submit';
    const res = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
    const out = await res.json().catch(() => ({ success: res.ok }));

    return json({ success: !!out.success }, out.success ? 200 : 502);
  } catch (e) {
    return json({ success: false, error: 'internal' }, 500);
  }
}
