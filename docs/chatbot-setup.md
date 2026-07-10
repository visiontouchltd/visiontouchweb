# Vivi chatbot — setup, configuration & upgrade guide

The Vision Touch assistant ("Vivi") is a floating chat widget on every page. It works in
three layers, and **layers 1 and 3 need zero configuration** — the bot is fully functional
with no AI key, no database and no extra services.

| Layer | What | Needs setup? |
|---|---|---|
| 1 | Local intent engine (keyword scoring over `assets/data/chatbot-intents.json` + `chatbot-knowledge.json`) — answers services/areas/quotes/planning/process/trust/contact instantly, offline-capable | No |
| 2 | Optional server-side AI via Pages Function `POST /api/chat` (only consulted when layer 1 confidence is low) | Env vars (below) |
| 3 | Rule-based fallback → human handover → lead capture → email draft | No |

## Files

| File | Purpose |
|---|---|
| `assets/js/chatbot.js` | Widget UI, conversation logic, lead flow, email draft (lazy-loaded) |
| `assets/js/chatbot-engine.js` | Layer-1 intent engine (shared with the Node test) |
| `assets/css/chatbot.css` | Widget styles (injected on demand) |
| `assets/data/chatbot-knowledge.json` | **Single source of truth** for everything the bot may say — edit this to change answers |
| `assets/data/chatbot-intents.json` | Intent keywords + canned replies + quick-reply chips |
| `functions/api/chat.js` | Pages Function: optional AI answer generation |
| `functions/api/chat/lead.js` | Pages Function: lead validation + forward to Web3Forms (+ optional Turnstile) |
| `build/test-chatbot-intents.mjs` | Intent tests — `node build/test-chatbot-intents.mjs` |

The loader lives in `build/site.mjs` (footer): it injects the widget **after `load` + idle**,
so there is no impact on first paint / Lighthouse. Page config passed via `window.VT_CHAT`.

## Environment variables (Cloudflare Pages → Settings → Environment variables)

All optional. With none set, `/api/chat` returns rule-based responses and `/api/chat/lead`
forwards to Web3Forms with the same public access key the site forms use.

| Variable | Default | Notes |
|---|---|---|
| `CHATBOT_ENABLE_AI` | `false` | Set `true` to enable AI answers for low-confidence questions |
| `CHATBOT_AI_PROVIDER` | `workers-ai` | `workers-ai` (needs the **AI binding**, no key) or `openai-compatible` |
| `CHATBOT_AI_MODEL` | `@cf/meta/llama-3.1-8b-instruct` / `gpt-4o-mini` | Model id for the chosen provider |
| `CHATBOT_AI_API_KEY` | — | Secret. Only for `openai-compatible` (OpenAI, Groq, Mistral, OpenRouter…) |
| `CHATBOT_AI_BASE_URL` | `https://api.openai.com/v1` | Override for OpenAI-compatible hosts |
| `CHATBOT_MAX_MESSAGE_LENGTH` | `500` | Server-side input cap |
| `CHATBOT_RATE_LIMIT_ENABLED` | `true` | Best-effort 12 msg/min/IP (in-isolate) |
| `CHATBOT_LOGGING_ENABLED` | `false` | When `true`, logs messages to function logs — leave off for privacy |
| `CHATBOT_FORM_ENDPOINT` | Web3Forms submit URL | Lead pipeline endpoint |
| `CHATBOT_FORM_KEY` | site's public Web3Forms key | Override if you rotate the key |
| `CHATBOT_CONTACT_EMAIL` | — | Informational |
| `TURNSTILE_SECRET_KEY` | — | Secret. If set, `/api/chat/lead` requires a `turnstileToken` (client widget not yet wired for Turnstile — see upgrades) |

### Enabling free AI with Cloudflare Workers AI (recommended first step)
1. Pages project → **Settings → Functions → Workers AI bindings** → add binding named `AI`.
2. Env vars: `CHATBOT_ENABLE_AI=true` (provider defaults to `workers-ai`).
3. Redeploy. Low-confidence questions now get grounded AI answers (system prompt is built
   from `chatbot-knowledge.json` with hard guardrails: no prices, no planning certainty,
   no availability promises, no invented facts).

## Test locally
```bash
node build/build.mjs                 # regenerate pages
node build/test-chatbot-intents.mjs  # 37 intent checks
npx --yes http-server . -p 8123 -c-1 # static only — widget works fully (functions unreachable → graceful fallback)
# OR, to test the Pages Functions too:
node build/publish.mjs
npx wrangler pages dev publish       # serves static + /api/chat + /api/chat/lead
```

## Deploy
Nothing special — `git push` as usual. Cloudflare Pages picks up the `functions/` directory
from the **repo root** automatically (it is intentionally excluded from `publish/`).

## Privacy & safety (implemented)
- No conversation storage server-side; client history lives in `sessionStorage` only (cleared on tab close / Clear chat).
- Privacy note shown before contact details are collected.
- Input length caps client + server, crude abuse blocklist, best-effort rate limiting.
- Guardrails in both the rules layer and the AI system prompt: no prices, no planning/legal certainty, no availability promises, emergency messages get a "contact emergency services" response.

## Known limitations
- Rate limiting is per-isolate (resets on cold start) — fine for a brochure site; use KV/Durable Objects for hard limits.
- Layer-1 context is per-message (a follow-up like "how long does it take?" after discussing lofts gives the general timeline answer, not loft-specific — the AI layer handles this when enabled).
- Turnstile verification is supported server-side but the widget doesn't render the Turnstile challenge yet.

## Upgrade path
1. **Workers AI** (free tier) — flip the two env settings above. Biggest win, zero cost.
2. **AI Gateway** — point `CHATBOT_AI_BASE_URL` at an AI Gateway endpoint for caching/analytics/rate limits.
3. **Vectorize RAG** — embed knowledge entries (Workers AI `@cf/baai/bge-*`), store in Vectorize, retrieve top-k in `/api/chat` instead of sending the full knowledge block.
4. **KV** — durable rate limiting + optional lead-conversation summaries.
5. **Turnstile** — render the widget in the lead confirm step, pass `turnstileToken` to `/api/chat/lead`, set `TURNSTILE_SECRET_KEY`.
6. **Multilingual** — add a language field to `VT_CHAT` and translated intents files (English remains primary).
