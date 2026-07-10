/* ============================================================================
   Vision Touch Ltd — "Vivi" assistant widget.
   Vanilla JS, lazy-loaded after page load (see footer loader in build/site.mjs).
   Layer 1: local intent engine (chatbot-engine.js + JSON data, loaded on first
            open) answers instantly with no network/AI dependency.
   Layer 2: optional server-side AI via /api/chat (Cloudflare Pages Function,
            env-gated) — only consulted when local confidence is low.
   Layer 3: rule-based fallback → human handover → lead capture / email draft.
   Lead submissions POST to /api/chat/lead, falling back to Web3Forms directly
   so no enquiry is ever lost (works on a plain static server too).
   Config injected by the page: window.VT_CHAT = {formKey,email,wa,tel}.
   ========================================================================== */
(function () {
  'use strict';
  if (window.__vtcBooted) return; window.__vtcBooted = true;

  var CFG = window.VT_CHAT || {};
  var EMAIL = CFG.email || 'inquiries@visiontouchltd.co.uk';
  var WA = CFG.wa || 'https://wa.me/447572222245';
  var TEL = CFG.tel || 'tel:+447572222245';
  var MAX_LEN = 500;

  var K = null, IN = null, engine = null;          // knowledge / intents / engine
  var panel, body, chipsEl, inputEl, launcher, nudge;
  var messages = [];                                // {role:'bot'|'user'|'note', html/text}
  var lead = null;                                  // active lead-capture state
  var loading = false, openState = false;

  /* ---------------------------------------------------------------- utils */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  /* markdown-lite: escape first, then **bold**, [text](url), bullets, newlines */
  function md(s) {
    var out = esc(s);
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\[([^\]]+)\]\(([a-z0-9\-./:#?=&%]+)\)/gi, function (_, t, u) {
      var ext = /^https?:/i.test(u);
      if (!ext && !/^[a-z0-9\-]+\.html(#[a-z0-9\-]*)?$/i.test(u)) return t; // only allow internal .html or http(s)
      return '<a href="' + u + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + t + '</a>';
    });
    // bullet blocks
    var lines = out.split('\n'), html = '', inList = false;
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i];
      if (/^- /.test(L)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += '<li>' + L.slice(2) + '</li>';
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += (html && L !== '' ? '<br>' : '') + L;
      }
    }
    if (inList) html += '</ul>';
    return html.replace(/(<br>){2,}/g, '<br><br>');
  }
  function phoneOk(v) { return /^[0-9 +()\-]{7,}$/.test(v); }
  function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  var OWL_SVG =
    '<svg class="vtc-owl" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<ellipse cx="32" cy="37" rx="21" ry="20" fill="#241F18"/>' +
    '<ellipse cx="32" cy="42" rx="13" ry="12" fill="#FBB040"/>' +
    '<path d="M13.5 30c-2.2-1.8-3.4-4-3.8-6.4 2.5.4 4.6 1.5 6.3 3.4L13.5 30zM50.5 30c2.2-1.8 3.4-4 3.8-6.4-2.5.4-4.6 1.5-6.3 3.4L50.5 30z" fill="#241F18"/>' +
    '<circle cx="24" cy="32" r="7.5" fill="#fff"/><circle cx="40" cy="32" r="7.5" fill="#fff"/>' +
    '<circle cx="24.8" cy="32.6" r="3.4" fill="#241F18"/><circle cx="39.2" cy="32.6" r="3.4" fill="#241F18"/>' +
    '<circle cx="26" cy="31.4" r="1.1" fill="#fff"/><circle cx="40.4" cy="31.4" r="1.1" fill="#fff"/>' +
    '<g class="vtc-owl-lids"><rect x="16.5" y="24.5" width="15" height="15" rx="7.5" fill="#241F18" transform="scale(1,0)"/><rect x="32.5" y="24.5" width="15" height="15" rx="7.5" fill="#241F18" transform="scale(1,0)"/></g>' +
    '<path d="M32 36.2l-3-3.4h6l-3 3.4z" fill="#E2620E"/>' +
    '<path d="M17 21c1.5-5.5 7.5-9.5 15-9.5S45.5 15.5 47 21c.3 1-.4 1.6-1.3 1.6H18.3c-.9 0-1.6-.6-1.3-1.6z" fill="#F7931E"/>' +
    '<rect x="13" y="21.4" width="38" height="3.6" rx="1.8" fill="#E2620E"/>' +
    '<rect x="29.4" y="12" width="5.2" height="6" rx="1.5" fill="#FBB040"/>' +
    '</svg>';

  var ICONS = {
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>'
  };

  /* --------------------------------------------------------- persistence */
  function save() {
    try { sessionStorage.setItem('vtc-log', JSON.stringify(messages.slice(-40))); } catch (e) {}
  }
  function restore() {
    try { return JSON.parse(sessionStorage.getItem('vtc-log') || '[]'); } catch (e) { return []; }
  }

  /* ------------------------------------------------------------ launcher */
  function buildLauncher() {
    launcher = el('button', 'vtc-launcher', OWL_SVG + '<span class="vtc-tip" aria-hidden="true">Need help planning your project?</span>');
    launcher.type = 'button';
    launcher.setAttribute('aria-label', 'Open Vision Touch assistant');
    launcher.addEventListener('click', function () {
      launcher.classList.add('vtc-wiggle');
      setTimeout(openPanel, 220);
    });
    document.body.appendChild(launcher);

    // one-per-session nudge bubble
    if (!sessionStorage.getItem('vtc-nudged')) {
      setTimeout(function () {
        if (openState) return;
        try { sessionStorage.setItem('vtc-nudged', '1'); } catch (e) {}
        nudge = el('div', 'vtc-nudge', 'Need a quote or advice? <button type="button" aria-label="Dismiss">&times;</button>');
        nudge.querySelector('button').addEventListener('click', function (e) { e.stopPropagation(); nudge.remove(); nudge = null; });
        nudge.addEventListener('click', function () { openPanel(); });
        document.body.appendChild(nudge);
        setTimeout(function () { if (nudge) { nudge.remove(); nudge = null; } }, 14000);
      }, 8000);
    }
  }

  /* --------------------------------------------------- lazy data + engine */
  function loadAssets() {
    if (K && IN && engine) return Promise.resolve();
    var jobs = [];
    if (!window.VTChatEngine) {
      jobs.push(new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = 'assets/js/chatbot-engine.js'; s.onload = res; s.onerror = rej;
        document.body.appendChild(s);
      }));
    }
    if (!K) jobs.push(fetch('assets/data/chatbot-knowledge.json').then(function (r) { return r.json(); }).then(function (j) { K = j; }));
    if (!IN) jobs.push(fetch('assets/data/chatbot-intents.json').then(function (r) { return r.json(); }).then(function (j) { IN = j; }));
    return Promise.all(jobs).then(function () {
      engine = window.VTChatEngine;
      engine.init(IN, K);
    });
  }

  /* --------------------------------------------------------------- panel */
  function buildPanel() {
    panel = el('div', 'vtc-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Vision Touch assistant chat');
    panel.innerHTML =
      '<div class="vtc-head">' +
        '<span class="vtc-owl-wrap">' + OWL_SVG + '</span>' +
        '<div class="vtc-head-txt"><strong>Vision Touch Assistant</strong>' +
        '<span>Ask about quotes, services, areas, timelines or project planning.</span></div>' +
        '<div class="vtc-head-btns">' +
          '<button type="button" class="vtc-reset" aria-label="Clear chat" title="Clear chat">' + ICONS.reset + '</button>' +
          '<button type="button" class="vtc-close" aria-label="Close assistant" title="Close">' + ICONS.close + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="vtc-body" aria-live="polite"></div>' +
      '<div class="vtc-chips" role="group" aria-label="Suggested replies"></div>' +
      '<div class="vtc-inputrow">' +
        '<input type="text" maxlength="' + MAX_LEN + '" placeholder="Type your question…" aria-label="Type your message">' +
        '<button type="button" class="vtc-send" aria-label="Send message">' + ICONS.send + '</button>' +
      '</div>' +
      '<div class="vtc-powered">Vivi · Vision Touch assistant — no personal data stored</div>';
    document.body.appendChild(panel);

    body = panel.querySelector('.vtc-body');
    chipsEl = panel.querySelector('.vtc-chips');
    inputEl = panel.querySelector('input');

    panel.querySelector('.vtc-close').addEventListener('click', closePanel);
    panel.querySelector('.vtc-reset').addEventListener('click', resetChat);
    panel.querySelector('.vtc-send').addEventListener('click', submitInput);
    inputEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') submitInput(); });

    // Esc closes; simple focus trap
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closePanel(); return; }
      if (e.key !== 'Tab') return;
      var f = panel.querySelectorAll('button, input, a[href]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    });
  }

  function openPanel() {
    if (nudge) { nudge.remove(); nudge = null; }
    openState = true;
    launcher.classList.add('vtc-hidden');
    if (!panel) buildPanel();
    requestAnimationFrame(function () { panel.classList.add('vtc-open'); });

    loadAssets().then(function () {
      if (!messages.length) {
        var prev = restore();
        if (prev.length) {
          messages = prev;
          messages.forEach(function (m) { paint(m, true); });
          showChips(defaultChips());
        } else {
          greet();
        }
      }
      inputEl.focus();
      scrollDown();
    }).catch(function () {
      addBot('Sorry — I couldn’t load just now. Please use **[the quote form](request-a-quote.html)** or WhatsApp us and the team will help right away.');
      showChips(['WhatsApp us']);
    });
  }

  function closePanel() {
    openState = false;
    panel.classList.remove('vtc-open');
    launcher.classList.remove('vtc-hidden');
    launcher.focus();
  }

  function resetChat() {
    messages = []; lead = null;
    try { sessionStorage.removeItem('vtc-log'); } catch (e) {}
    body.innerHTML = '';
    greet();
  }

  function greet() {
    addBot('Hi, I’m **Vivi** 🦉 — the Vision Touch assistant. I can help with our **services**, the **areas we cover**, planning questions, or getting you a **free, no-obligation quote**. What are you planning?');
    showChips(defaultChips());
  }

  function defaultChips() {
    return ['Get a quote', 'Loft conversion', 'House extension', 'Renovation', 'Areas covered', 'Planning & permissions', 'Speak to a human'];
  }

  /* ------------------------------------------------------------ messages */
  function paint(m, instant) {
    var n;
    if (m.role === 'user') n = el('div', 'vtc-msg vtc-msg--user', esc(m.text));
    else if (m.role === 'note') n = el('div', 'vtc-msg vtc-msg--note', m.html);
    else if (m.role === 'draft') n = el('div', 'vtc-draft', esc(m.text));
    else n = el('div', 'vtc-msg vtc-msg--bot', m.html);
    body.appendChild(n);
    if (!instant) scrollDown();
  }
  function addBot(text) { var m = { role: 'bot', html: md(text) }; messages.push(m); paint(m); save(); }
  function addNote(text) { var m = { role: 'note', html: esc(text) }; messages.push(m); paint(m); save(); }
  function addDraft(text) { var m = { role: 'draft', text: text }; messages.push(m); paint(m); save(); }
  function addUser(text) { var m = { role: 'user', text: text }; messages.push(m); paint(m); save(); }
  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function typing(on) {
    var t = body.querySelector('.vtc-typing-wrap');
    if (on && !t) {
      t = el('div', 'vtc-msg vtc-msg--bot vtc-typing-wrap', '<span class="vtc-typing"><i></i><i></i><i></i></span>');
      body.appendChild(t); scrollDown();
    } else if (!on && t) t.remove();
  }

  function showChips(list) {
    chipsEl.innerHTML = '';
    (list || []).forEach(function (label) {
      var c = el('button', 'vtc-chip', esc(label));
      c.type = 'button';
      c.addEventListener('click', function () { onChip(label); });
      chipsEl.appendChild(c);
    });
  }

  /* --------------------------------------------------------- chip router */
  function onChip(label) {
    var special = {
      'Get a quote': function () { addUser(label); startLead('quote'); },
      'Start my quote': function () { addUser(label); startLead('quote'); },
      'Request a callback': function () { addUser(label); startLead('quote', { preferred_contact: 'Phone' }); },
      'Write an email': function () { addUser(label); startLead('email'); },
      'Email instead': function () { emailFromLead(); },
      'WhatsApp us': function () { window.open(WA, '_blank', 'noopener'); },
      'WhatsApp instead': function () { window.open(WA, '_blank', 'noopener'); },
      'Call us': function () { window.location.href = TEL; },
      'Open quote page': function () { window.location.href = 'request-a-quote.html'; },
      'Send enquiry ✓': function () { submitLead(); },
      'Start again': function () { addUser(label); startLead(lead ? lead.mode : 'quote'); },
      'Copy email': function () { copyDraft(); },
      'Cancel': function () { addUser(label); lead = null; addBot('No problem — cancelled. Anything else I can help with?'); showChips(defaultChips()); },
      'Not yet': function () { addUser(label); addBot('No rush at all. Browse **[our services](services.html)** or the **[before & after gallery](before-after.html)**, and I’m here when you’re ready.'); showChips(defaultChips()); }
    };
    if (special[label]) { special[label](); return; }
    handleText(label);
  }

  /* --------------------------------------------------------- input flow */
  function submitInput() {
    var v = (inputEl.value || '').trim();
    if (!v) return;
    inputEl.value = '';
    handleText(v);
  }

  function handleText(text) {
    if (text.length > MAX_LEN) text = text.slice(0, MAX_LEN);
    addUser(text);
    // mid-flow answers go to the lead machine; once the summary is showing
    // (all steps answered), free text routes back to normal Q&A
    if (lead && lead.step < LEAD_STEPS.length) { leadAnswer(text); return; }
    typing(true);
    setTimeout(function () { respond(text); }, 350 + Math.random() * 350);
  }

  /* ------------------------------------------------------- response core */
  function respond(text) {
    var det = engine.detect(text);
    var conf = det.confidence;

    if (det.intent === 'fallback' || conf < 0.35) { lowConfidence(text); return; }
    typing(false);

    switch (det.intent) {
      case 'service': replyService(det.service); break;
      case 'areas': replyAreas(det.area); break;
      case 'quote': replyQuote(det.service); break;
      case 'timeline': replyTimeline(det.service); break;
      case 'process': replyProcess(); break;
      case 'contact': replyContact(); break;
      case 'human': replyHuman(); break;
      case 'services-general': replyAllServices(); break;
      default:
        if (det.def && det.def.reply) {
          addBot(det.def.reply);
          showChips(det.def.suggest || defaultChips());
        } else lowConfidence(text);
    }
  }

  function replyService(slug) {
    var s = K.services[slug];
    if (!s) { lowConfidence(''); return; }
    addBot('**Yes — ' + s.label.toLowerCase() + ' is one of our core services.** ' + s.short + '\n\n' + s.detail +
      '\n\nYou can read more on the **[' + s.label + ' page](' + s.url + ')**, or I can get you a free quote right now.');
    showChips(['Get a quote', 'How long does it take?', 'Areas covered', 'Speak to a human']);
  }

  function replyAreas(area) {
    var named = K.areas.named;
    if (area && area !== 'London' && area !== 'Greater London') {
      addBot('**Yes — we cover ' + area + '.** ' + K.areas.summary + ' That includes ' + named.slice(0, 6).join(', ') + ' and the surrounding boroughs.\n\nWould you like a free quote for a project in ' + area + '?');
    } else {
      addBot('**We cover the whole of Greater London** — including ' + named.slice(0, 8).join(', ') + ' and all surrounding boroughs.\n\n' + K.areas.outside);
    }
    showChips(['Get a quote', 'Our services', 'Speak to a human']);
  }

  function replyQuote(slug) {
    var lead_in = slug && K.services[slug] ? 'For **' + K.services[slug].label.toLowerCase() + '**, costs' : 'Costs';
    addBot(lead_in + ' depend on the property, access, specification, structural work and finish level — so we confirm pricing after understanding the project. Quotes are **free and no-obligation**.\n\nI can take a few quick details now and send them straight to the team. Ready?');
    showChips(['Start my quote', 'WhatsApp instead', 'Not yet']);
  }

  function replyTimeline(slug) {
    if (slug && K.services[slug] && K.services[slug].timeline) {
      var s = K.services[slug];
      addBot('**' + s.label + ':** ' + s.timeline + '\n\nEvery project gets a clear programme before work begins — we confirm timings properly after a site review. Exact start dates depend on the current schedule, which the team can confirm.');
    } else {
      addBot('Timescales depend on the project — as a guide from our site: bathrooms **1–2 weeks**, kitchens **1–3 weeks**, garage conversions **2–4 weeks**, loft conversions **6–10 weeks**, single-storey extensions **10–16 weeks**.\n\nWe agree a clear programme before any work begins. Want the team to confirm for your project?');
    }
    showChips(['Get a quote', 'Our process', 'Speak to a human']);
  }

  function replyProcess() {
    var steps = K.process.map(function (p, i) { return '- **' + (i + 1) + '. ' + p.step + '** — ' + p.detail; }).join('\n');
    addBot('Here’s how every Vision Touch project runs:\n' + steps + '\n\nAnd yes — we visit and review the property before confirming a quote where needed.');
    showChips(['Get a quote', 'Areas covered', 'Speak to a human']);
  }

  function replyContact() {
    addBot('Here’s how to reach the team:\n- **WhatsApp** — fastest reply (tap the green button, or the chip below)\n- **Call** — use the Call Us buttons on the site (Mon–Sat)\n- **Email** — ' + EMAIL + '\n- **[Quote form](request-a-quote.html)** — free, no-obligation\n\n**Hours:** ' + K.company.hours + '.');
    showChips(['WhatsApp us', 'Call us', 'Get a quote']);
  }

  function replyHuman() {
    addBot(K.handover.human);
    showChips(['WhatsApp us', 'Call us', 'Request a callback', 'Write an email']);
  }

  function replyAllServices() {
    var list = Object.keys(K.services).map(function (k) {
      var s = K.services[k];
      return '- **[' + s.label + '](' + s.url + ')** — ' + s.short;
    }).join('\n');
    addBot('Here’s everything we do across Greater London:\n' + list);
    showChips(['Get a quote', 'Areas covered', 'Speak to a human']);
  }

  /* -------------------------------------------- low confidence → AI → fb */
  function lowConfidence(text) {
    tryAI(text).then(function (res) {
      typing(false);
      if (res && res.reply) {
        addBot(res.reply);
        showChips((res.suggestedReplies && res.suggestedReplies.length ? res.suggestedReplies : null) ||
          (res.handoverRecommended ? ['Write an email', 'WhatsApp us', 'Speak to a human'] : defaultChips()));
      } else {
        addBot(K.handover.unknown);
        showChips(['Write an email', 'WhatsApp us', 'Get a quote']);
      }
    });
  }

  function tryAI(text) {
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, 6500);
    var history = messages.filter(function (m) { return m.role === 'user' || m.role === 'bot'; })
      .slice(-6).map(function (m) { return { role: m.role === 'bot' ? 'assistant' : 'user', content: m.text || m.html.replace(/<[^>]+>/g, '') }; });
    return fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: text, history: history }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; })
      .then(function (j) { if (timer) clearTimeout(timer); return j; });
  }

  /* ---------------------------------------------------- lead capture flow */
  var LEAD_STEPS = [
    { key: 'project_type', q: 'Great — let’s get you a quote. **What type of project is it?**',
      chips: ['Loft conversion', 'House extension', 'Renovation', 'Kitchen', 'Bathroom', 'Roofing', 'Flooring', 'Garage conversion', 'General building work', 'Other'] },
    { key: 'location', q: 'Where is the property? A **borough, town or postcode area** is perfect (e.g. Harrow, HA1).' },
    { key: 'property_type', q: 'What kind of property is it?',
      chips: ['House', 'Flat', 'Terraced house', 'Semi-detached', 'Detached', 'Commercial / development', 'Other'] },
    { key: 'description', q: 'Briefly, what would you like done? One or two sentences is plenty.' },
    { key: 'timeframe', q: 'When would you like the work to start?',
      chips: ['As soon as possible', 'Within 1 month', '1–3 months', '3+ months', 'Just planning / researching'] },
    { key: 'plans', q: 'Do you already have drawings or plans?',
      chips: ['Yes', 'No', 'In progress', 'Not sure'] },
    { key: 'preferred_contact', q: 'How would you prefer the team to contact you?',
      chips: ['Phone', 'WhatsApp', 'Email'] },
    { key: 'name', q: 'Nearly done! **What’s your name?**', privacy: true },
    { key: 'contact', q: 'And the best **phone number or email** to reach you on?' }
  ];

  function startLead(mode, preset) {
    lead = { mode: mode || 'quote', step: 0, data: preset ? Object.assign({}, preset) : {} };
    if (lead.mode === 'email') {
      addBot('Happy to help you write an enquiry email — I’ll ask a few quick questions, then draft it for you to copy or send.');
    }
    askLeadStep();
  }

  function askLeadStep() {
    // skip pre-filled steps
    while (lead.step < LEAD_STEPS.length && lead.data[LEAD_STEPS[lead.step].key]) lead.step++;
    if (lead.step >= LEAD_STEPS.length) { leadSummary(); return; }
    var st = LEAD_STEPS[lead.step];
    if (st.privacy) addNote(K ? K.privacyNote : 'We’ll only use these details to respond to your enquiry.');
    addBot(st.q);
    showChips((st.chips || []).concat(['Cancel']));
  }

  function leadAnswer(text) {
    if (/^cancel$/i.test(text.trim())) { lead = null; addBot('No problem — cancelled. Anything else I can help with?'); showChips(defaultChips()); return; }
    var st = LEAD_STEPS[lead.step];
    var v = text.trim();
    if (st.key === 'contact' && !phoneOk(v) && !emailOk(v)) {
      addBot('That doesn’t look like a valid phone number or email — could you double-check it?');
      showChips(['Cancel']);
      return;
    }
    if (st.key === 'name' && v.length < 2) {
      addBot('Could I take a name for the enquiry?');
      showChips(['Cancel']);
      return;
    }
    lead.data[st.key] = v;
    lead.step++;
    askLeadStep();
  }

  function leadSummary() {
    var d = lead.data;
    addBot('Here’s your enquiry — does this look right?\n' +
      '- **Project:** ' + (d.project_type || '—') + '\n' +
      '- **Location:** ' + (d.location || '—') + '\n' +
      '- **Property:** ' + (d.property_type || '—') + '\n' +
      '- **Details:** ' + (d.description || '—') + '\n' +
      '- **Start:** ' + (d.timeframe || '—') + '\n' +
      '- **Drawings/plans:** ' + (d.plans || '—') + '\n' +
      '- **Contact via:** ' + (d.preferred_contact || '—') + '\n' +
      '- **Name:** ' + (d.name || '—') + '\n' +
      '- **Contact:** ' + (d.contact || '—'));
    if (lead.mode === 'email') showChips(['Copy email', 'Send enquiry ✓', 'Start again', 'Cancel']);
    else showChips(['Send enquiry ✓', 'Email instead', 'Start again', 'Cancel']);
    if (lead.mode === 'email') emailFromLead(true);
  }

  /* ------------------------------------------------------- lead submission */
  function submitLead() {
    if (!lead || !lead.data.contact) { addBot('Let’s grab your details first.'); startLead('quote'); return; }
    var d = lead.data;
    typing(true);
    var payload = {
      name: d.name, contact: d.contact, project_type: d.project_type, location: d.location,
      property_type: d.property_type, description: d.description, timeframe: d.timeframe,
      plans: d.plans, preferred_contact: d.preferred_contact, source: 'Vivi chatbot'
    };
    fetch('/api/chat/lead', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
    }).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (j) { if (!j.success) return Promise.reject(); leadDone(); })
      .catch(function () {
        // Fallback: post directly to Web3Forms (works on plain static hosting too)
        if (!CFG.formKey) { leadFail(); return; }
        var fd = new FormData();
        fd.append('access_key', CFG.formKey);
        fd.append('subject', 'Chatbot Enquiry — ' + (d.project_type || 'Project') + (d.location ? ' in ' + d.location : ''));
        fd.append('from_name', 'Vision Touch Website Chatbot');
        Object.keys(payload).forEach(function (k) { if (payload[k]) fd.append(k, payload[k]); });
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
          .then(function (r) { return r.json(); })
          .then(function (j) { j && j.success ? leadDone() : leadFail(); })
          .catch(leadFail);
      });
  }

  function leadDone() {
    typing(false);
    lead = null;
    addBot('✅ **Sent!** Your enquiry is with the Vision Touch team — they’ll be in touch soon (Mon–Sat).\n\nFor the **fastest response**, you can also WhatsApp us now and mention your enquiry.');
    showChips(['WhatsApp us', 'Call us', 'Our services']);
  }

  function leadFail() {
    typing(false);
    addBot('Sorry — I couldn’t send that just now. Your details aren’t lost: you can copy the email below, or use the **[quote form](request-a-quote.html)** / WhatsApp instead.');
    emailFromLead(true);
    showChips(['Copy email', 'WhatsApp us', 'Open quote page']);
  }

  /* ----------------------------------------------------------- email draft */
  var lastDraft = '';
  function buildDraft(d) {
    return 'Subject: Project Enquiry - ' + (d.project_type || 'Building work') + (d.location ? ' in ' + d.location : '') + '\n\n' +
      'Hello Vision Touch Ltd,\n\n' +
      'I would like to enquire about ' + (d.project_type || 'a building project').toLowerCase() + ' for my property' + (d.location ? ' in ' + d.location : '') + '.\n\n' +
      'Project details:\n' +
      '- Project type: ' + (d.project_type || '-') + '\n' +
      '- Property type: ' + (d.property_type || '-') + '\n' +
      '- Location: ' + (d.location || '-') + '\n' +
      '- Brief description: ' + (d.description || '-') + '\n' +
      '- Desired start timeframe: ' + (d.timeframe || '-') + '\n' +
      '- Drawings/plans: ' + (d.plans || '-') + '\n' +
      '- Preferred contact method: ' + (d.preferred_contact || '-') + '\n' +
      '- My contact details: ' + [d.name, d.contact].filter(Boolean).join(', ') + '\n\n' +
      'Please let me know the next steps for arranging a quote or site visit.\n\n' +
      'Kind regards,\n' + (d.name || '');
  }

  function emailFromLead(silent) {
    if (!lead || !Object.keys(lead.data).length) { startLead('email'); return; }
    lastDraft = buildDraft(lead.data);
    if (!silent) addBot('Here’s a ready-to-send email — copy it, or open it straight in your email app:');
    addDraft(lastDraft);
    showChips(['Copy email', 'Open in email app', 'Send enquiry ✓', 'WhatsApp us']);
    // one-off chip: open mail client with the draft
    Array.prototype.forEach.call(chipsEl.children, function (c) {
      if (c.textContent === 'Open in email app') {
        c.addEventListener('click', function () {
          var subj = lastDraft.split('\n')[0].replace(/^Subject: /, '');
          var bodyTxt = lastDraft.split('\n').slice(2).join('\n');
          window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(bodyTxt);
        });
      }
    });
  }

  function copyDraft() {
    if (!lastDraft && lead) lastDraft = buildDraft(lead.data);
    if (!lastDraft) return;
    var done = function () { addNote('Copied to clipboard ✓ — paste it into an email to ' + EMAIL); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(lastDraft).then(done, done);
    else done();
  }

  /* ------------------------------------------------------------------ go */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildLauncher);
  else buildLauncher();
})();
