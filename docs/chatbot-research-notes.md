# Chatbot research notes — Vision Touch assistant ("Vivi")

**Date:** 2026-07-11 · Internal document, not deployed to the live site.

## 1. Sources reviewed

### Our own site (primary knowledge source — full crawl of build source + live pages)
- https://www.visiontouchltd.co.uk/ (home: hero, trust strip, process, FAQs, reviews)
- All 11 service pages (loft-conversions, house-extensions, property-renovations, carpentry-joinery, kitchen-installation, bathroom-installation, structural-work, general-building-services, roofing, flooring, garage-conversions) — each has intro, "why", benefits, process and 4 FAQs
- about.html (areas-served borough list + map), why-choose-us.html, projects.html, before-after.html, reviews.html
- request-a-quote.html / contact.html — form fields: Full Name, Phone, Email, Project Location/Postcode, Service Required (12 options), Project Budget (6 bands), Project Details, consent checkbox → Web3Forms

### External research (structure/UX only — no content copied)
- https://www.planningportal.co.uk/permission/common-projects/loft-conversion/planning-permission/ — authoritative UK planning-permission framing
- https://www.which.co.uk/reviews/loft-conversions/article/loft-conversion-building-regulations-and-planning-permission-aYaeU0I5DW7O
- https://www.fmb.org.uk/find-a-builder/ultimate-guides-to-home-renovation/loft-conversions-the-ultimate-guide.html
- https://www.mybuilder.com/loft-conversion/price-guides/loft-conversion-cost
- https://resi.co.uk/advice/planning-permission/costs-planning-permission-application
- https://www.greenmatch.co.uk/loft-conversion
- https://www.spurnow.com/en/blogs/how-do-chatbots-qualify-leads
- https://www.stellabots.com/blog/how-to-use-ai-chatbots-to-qualify-leads-on-your-contractor-website-after-business-hours
- https://noform.ai/blog/how-do-chatbots-qualify-leads/
- https://chatspark.io/blog/ai-chatbots-turn-website-visitors-into-qualified-leads

## 2. Common customer questions found (UK construction/renovation)

1. **Cost** — "How much does a loft conversion / extension / new kitchen cost?" (by far the most common; answers vary hugely by type: e.g. Velux vs dormer vs mansard lofts span roughly £25k–£95k in public 2026 guides). *Bot rule: never quote figures — costs depend on property/spec; route to quote.*
2. **Planning permission** — "Do I need planning permission?" Public guidance: many rear dormers fall under Permitted Development but front dormers, conservation areas, Article 4 zones, listed buildings and flats usually need full permission, and building-control sign-off is always required. *Bot rule: never give certainty; varies by property + borough; VT guides through drawings/approvals.*
3. **Timeline** — "How long will it take?" (public guides: lofts ~6–14 weeks depending on type). *Bot: our own site says lofts ~6–10 weeks, extensions ~10–16, bathrooms 1–2, kitchens 1–3, garages 2–4 — use only our published ranges.*
4. **Process** — "What happens first? Do you visit the site?" → our 5-step process answers this directly.
5. **Area coverage** — "Do you work in X?" (postcode/borough checks are a top chatbot use on trade sites).
6. **Trust** — "Are you insured/guaranteed? Can I see past work?" → reviews, before/after, aftercare wording only (no invented certifications).
7. **Party wall / building regs / structural calcs** — homeowners often conflate these; keep answers general, offer consultation.
8. **Living in the house during works**, **drawings needed?**, **do you supply materials/kitchens?** — all covered by existing site FAQs.

## 3. Chatbot UX findings worth adopting

- Conversational capture converts far better than static forms (industry claims of 3× lead conversion; forms ~2–3% vs conversational 10%+). Progressive profiling — easy questions first, contact details last — is the consistent recommendation.
- Ask **one question at a time**; chips/buttons for finite options dramatically reduce drop-off on mobile.
- Speed-to-lead matters (leads contacted in <1 min are far likelier to qualify) → end every captured lead with "fastest response: WhatsApp/call" nudge.
- After-hours coverage is a top value driver for trade businesses (most homeowners research evenings/weekends).
- Bots on trade sites fail when they bluff on price/planning — best ones give honest "it depends" + route to a human fast.

## 4. Recommended intents (implemented)

`greeting, services (per-service ×11), quote, areas, planning, timeline, process, trust, investor, contact/human-handover, hours, thanks, smalltalk-guard, fallback`

## 5. Recommended lead-qualification questions (implemented, one at a time)

1. Project type (chips: 10 options) → 2. Location (borough/postcode, free text) → 3. Property type (chips) → 4. Brief description → 5. Start timeframe (chips) → 6. Drawings/plans status (chips) → 7. Preferred contact method (chips) → 8. Name → 9. Phone/email (validated) → summary → confirm → submit (Web3Forms) → WhatsApp/call nudge. Privacy note shown before contact details.

## 6. Safety/legal disclaimers adopted

- Planning/building-control: "requirements depend on the property, borough and scope — Vision Touch can guide you, but final requirements should be confirmed for your property."
- Pricing: never state figures; explain cost drivers; route to quote.
- No guarantees of availability, approval, insurance or certification beyond what the site states.
- Not an emergency service: urgent/structural-danger messages → advise calling a professional/emergency services immediately.

## 7. Implementation notes

- Static site (no framework) → vanilla-JS widget, lazy-loaded after `load` + idle; CSS injected on demand; knowledge + intents as JSON assets fetched on first open.
- 3 intelligence layers: (1) local keyword/scoring intent engine — instant, free, offline-capable; (2) optional server-side AI via Cloudflare Pages Function `/api/chat` (env-gated, OpenAI-compatible or Workers AI); (3) rule-based fallback + human handover + email-draft when unknown.
- Lead submission: `/api/chat/lead` Pages Function → Web3Forms; client falls back to posting Web3Forms directly if the function is unavailable (e.g. plain local static server) — the bot must never lose a lead.
- Coexists with the existing floating WhatsApp button (chatbot sits above it, both bottom-right).
