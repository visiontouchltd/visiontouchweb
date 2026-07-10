# Chatbot asset licence notes

## Owl mascot ("Vivi")
- **Source:** 100% original SVG, hand-authored for this project (inline in
  `assets/js/chatbot.js`, `OWL_SVG` constant). Geometric owl with a hard hat,
  drawn in the Vision Touch brand palette (charcoal `#241F18`, amber `#FBB040`
  / `#F7931E`, copper `#E2620E`).
- **Licence:** work-for-hire, owned by the client/Auztec Innovations. No
  third-party artwork, fonts, stock assets, Lottie files or icon-library
  components were used or adapted.
- **Animations:** pure CSS (blink, idle bob, click wiggle) — no animation
  libraries. Disabled automatically under `prefers-reduced-motion`.

## UI icons (send / close / reset arrows)
- Original inline SVG paths written for this widget (same style as the site's
  existing icon set in `build/site.mjs`). No external icon packs.

## Emoji
- The owl 🦉 / check ✅ / warning ⚠️ characters in message copy are standard
  Unicode emoji rendered by the visitor's own system font — no licensing
  implications.

**Summary: nothing in the chatbot requires attribution or third-party licence
compliance.** If a third-party animation (e.g. LottieFiles) is ever swapped in
later, record its source URL + licence here before shipping.
