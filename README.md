# Vision Touch Ltd — Website

A premium, fast, SEO-ready static website for **Vision Touch Ltd**, a construction & property
improvement company serving **Greater London**. Built as plain HTML/CSS/JS (generated from a small
Node build script) so it deploys to any shared host — Hostinger, Namecheap, cPanel, or any static host.

---

## 1. Quick start (run locally)

The site is **static** — the `.html` files in the project root are the finished website. To preview:

```bash
# from the project root
npx --yes http-server . -p 8123 -c-1
# then open http://localhost:8123
```

Any static server works (VS Code Live Server, `python -m http.server`, etc.).
> Note: the quote form's PHP handler only runs on a PHP-capable host. Locally the form falls back
> to opening your email client (see §7).

---

## 2. How the site is built

The pages are **generated** from a tiny Node script so the header, footer, SEO tags and shared
sections stay consistent. You normally don't need this — the generated `.html` files are ready to
upload. Only re-run it if you edit content in `build/`.

```bash
node build/build.mjs        # regenerates all .html pages into the project root
```

| File | Purpose |
|------|---------|
| `build/site.mjs` | Site config (phone, email, social links, domain), icon set, header/footer, schema helpers |
| `build/content.mjs` | All written content — service copy, reviews, projects, FAQs |
| `build/build.mjs` | Assembles every page and writes the `.html` files |
| `build/optimize-images.mjs` | Source images → WebP + JPG fallback (run once; needs `sharp`) |
| `build/optimize-videos.sh` | Source videos → compressed MP4 + posters (run once; needs `ffmpeg`) |

There is **no framework and no build step required to deploy** — generation is a convenience only.

---

## 3. Deploy to shared hosting (Hostinger / Namecheap / cPanel)

1. Upload **everything in this folder** to your hosting `public_html` (or the site root) via
   File Manager or FTP. Include the hidden `.htaccess` file.
2. You can **exclude** these developer-only items from the upload (optional): `build/`, `.claude/`,
   `README.md`, `package*.json`. They don't affect the live site.
3. Make sure `index.html` is in the site root.
4. Point your domain at the host and you're live. Submit `sitemap.xml` to Google Search Console.

`.htaccess` already enables GZIP compression, long-life caching, security headers and tidy URLs.

---

## 4. Where to put client assets (replace placeholders)

All media lives under `assets/`. Replace the files below with the client's real, high-res versions
and **keep the same filename** — no code changes needed. (If you add new images, run
`node build/optimize-images.mjs` to regenerate WebP versions, or just drop in pre-optimised files.)

| What | Where |
|------|-------|
| **Logo** (header/footer) | `assets/logo/vision-touch-logo.webp` (+ `.png`) |
| Logo mark / favicon source | `assets/logo/vision-touch-mark.png`, `favicon-*.png`, `apple-touch-icon.png` |
| **Hero video** (homepage background) | `assets/videos/hero.mp4` (poster: `assets/images/home/hero-poster.jpg`) |
| **Service images** | `assets/images/services/<service-slug>/` |
| **Service videos** | `assets/videos/<service-slug>.mp4` |
| **Portfolio / project images** | `assets/images/services/<slug>/…-card.webp` (mapped in `build/content.mjs` → `PROJECTS`) |
| **Before / after images** | mapped in `build/build.mjs` → `BA_PAIRS` |
| **Auztec logo** (for presentation) | `assets/presentation/auztec-logo.png` *(not supplied — add this file)* |

> **Roofing, Flooring and Garage Conversions** currently reuse tasteful images from related
> services as placeholders (the brief's asset folder had no dedicated photos for them). Replace the
> files in `assets/images/services/roofing/`, `…/flooring/` and `…/garage-conversions/` with real
> photos before launch.

---

## 5. Replace placeholder content before launch

These are realistic **demo** items, clearly marked with code comments. Edit, then re-run
`node build/build.mjs`.

| Content | Edit in | Notes |
|---------|---------|-------|
| **Customer reviews** | `build/content.mjs` → `REVIEWS` | Fictional names/areas — swap for genuine reviews |
| **Projects / portfolio** | `build/content.mjs` → `PROJECTS` | Fictional London projects — swap for real ones |
| **Before/after pairs** | `build/build.mjs` → `BA_PAIRS` | Real project pairs wired (`assets/images/before-after/`); add more by dropping `<name>-before`/`<name>-after` webp+jpg and extending the array |
| **"See us at work" gallery** | `build/build.mjs` → `WORK` | Real on-site photos (`assets/images/work/`). Auto-scrolling, draggable, hover-magnify strip on the Before & After page |
| **Service copy / FAQs** | `build/content.mjs` → `SERVICE_CONTENT` | Tailor wording if desired |
| **Legal pages** | `build/build.mjs` → `buildPrivacy` / `buildTerms` | Starter templates — have a legal adviser review |

---

## 6. Update phone, email & social links

Edit **`build/site.mjs`** (the `SITE` object) and re-run `node build/build.mjs`:

```js
phone: '07572 222245',
email: 'inquiries@visiontouchltd.co.uk',       // official enquiry inbox (mailto links, footer, contact)
web3formsKey: 'YOUR_WEB3FORMS_ACCESS_KEY',  // ← paste your Web3Forms key (see §7)
facebook:  'https://www.facebook.com/…',    // ← replace with the real Vision Touch Ltd page
instagram: 'https://www.instagram.com/…',   // ← replace with the real Vision Touch Ltd page
domain: 'https://www.visiontouchltd.co.uk', // ← used for canonical URLs, OG tags & sitemap
```

The WhatsApp link is built automatically from the phone number in UK international format
(`https://wa.me/447572222245`). The floating WhatsApp button appears on every page.

---

## 7. How the quote / contact form works (Web3Forms)

Both **Request a Quote** and **Contact** use the same form, which submits directly to
[**Web3Forms**](https://web3forms.com) — a free service that emails each submission to
`inquiries@visiontouchltd.co.uk`. No backend, database or PHP required, so it works on any static host.

### One-time setup (get the access key)
1. Go to **https://web3forms.com** and, in the "Create your Access Key" box, enter
   **`inquiries@visiontouchltd.co.uk`**.
2. Web3Forms emails an **Access Key** (a UUID) to that inbox. Copy it.
3. Open `build/site.mjs` and paste it into the `SITE` config:
   ```js
   web3formsKey: 'paste-your-access-key-here',
   ```
4. Re-run `node build/build.mjs`. Done — the form now emails every enquiry to the inbox.

> Until a real key is set, the form validates as normal but shows a friendly
> "please email us directly" message instead of sending (it never silently fails).

### How it behaves
- **With JavaScript:** submits in the background (AJAX) and shows an inline success/error message —
  the visitor never leaves the page.
- **Without JavaScript:** the form still posts natively to Web3Forms (its `action`), so enquiries
  are never lost.
- **Spam protection:** two honeypots (`company_website` + Web3Forms' `botcheck`), full client-side
  validation, and a required consent checkbox. Web3Forms adds its own server-side spam filtering.
- **Free tier:** 250 submissions/month at no cost, no card required.

### Delivery / deliverability
Enquiries arrive from Web3Forms; the visitor's email is set as reply-to, so you can reply directly.
Add `inquiries@visiontouchltd.co.uk` to your mailbox and check spam on the first test.

### Optional PHP alternative
`quote-handler.php` is included as a self-hosted alternative if you ever prefer server-side mail
(its recipient is already set to `inquiries@visiontouchltd.co.uk`). It is **not used** by default —
the form points at Web3Forms. To use PHP instead, change the form `action` back to
`quote-handler.php` in `build/build.mjs` and rebuild.

Test after deploy: submit a real enquiry and confirm it arrives.

---

## 8. SEO files included

- Unique `<title>` + meta description, canonical URL, Open Graph & Twitter cards on every page
- Structured data (JSON-LD): `HomeAndConstructionBusiness`, `Service`, `FAQPage`, `BreadcrumbList`,
  `AggregateRating`/`Review`
- Clean H1/H2/H3 structure, descriptive `alt` text, internal linking
- `sitemap.xml` (22 URLs) and `robots.txt`
- Local keyword targeting for Greater London across all service pages

After launch: verify the domain in **Google Search Console** and submit `sitemap.xml`.

---

## 9. Performance notes

- Source videos were compressed from **~480 MB → ~15 MB** total (720p, muted, faststart) with poster images
- All photos served as **WebP** with JPG fallback via `<picture>`
- Lazy loading on below-the-fold media, deferred JS, CSS transitions (minimal JS, ~20 KB total)
- Total site weight ≈ **29 MB** including all videos — comfortable for shared hosting
- `prefers-reduced-motion` respected; the hammer cursor disables on touch/reduced-motion

Optional pre-launch: minify `assets/css/styles.css` and the JS files (e.g. with `npx esbuild`),
and consider a CDN for the videos if traffic is high.

---

## 10. Accessibility

Keyboard-navigable menu, visible focus states, ARIA labels, accessible form labels & error
messages, sufficient colour contrast, mobile-friendly tap targets, skip-to-content link, and
reduced-motion support.

---

## 11. Customising / disabling features

- **Chatbot ("Vivi"):** works out of the box with no AI key (local intent engine + lead capture + email draft). Answers/wording live in `assets/data/chatbot-knowledge.json`. Optional AI, env vars, tests and upgrade path: see `docs/chatbot-setup.md`.
- **Hammer cursor:** set `ENABLE_HAMMER = false` at the top of `assets/js/hammer-cursor.js`.
- **Animated 3D logo:** set `logoMotion: false` in `build/site.mjs` and re-run `node build/build.mjs` to revert to a completely static logo. (The animation — a 3D entrance, a gentle idle float/tilt, and a hover barrel-roll — is pure CSS; it auto-disables for visitors who prefer reduced motion.)
- **WhatsApp default message:** edit `waMessage` in `build/site.mjs`.
- **Colours / fonts:** all design tokens are CSS variables at the top of `assets/css/styles.css`.
- **Service-area map (About page):** a keyless Google Maps embed (no API key, free, shared-hosting friendly) lives in `build/build.mjs` → `buildAbout()`. To recenter it, open Google Maps → *Share → Embed a map*, copy the `src` from the generated `<iframe>`, paste it over the existing `.../maps/embed?pb=...` URL, then re-run `node build/build.mjs`. The borough chips next to it are also edited there.

---

## 12. Still required from the client before final launch

- Final approved logo files (if different from supplied)
- Real project photos, before/after images and customer reviews
- Certification proof/details and any warranty/guarantee wording
- Final **Facebook** and **Instagram** page URLs
- Company registration / VAT details (if to be displayed)
- Full service-area list (if beyond Greater London)
- Final privacy policy / terms wording (legal review)
- Hosting (cPanel/FTP) and domain/DNS access
- Preferred enquiry-handling process & destination inbox
- **Auztec Innovations logo** for the presentation (`assets/presentation/auztec-logo.png`)

---

## 13. Page list

Home · About · Services (overview) · 11 service pages (Loft Conversions, House Extensions, Property
Renovations, Carpentry & Joinery, Kitchen Installation, Bathroom Installation, Structural Work,
General Building Services, Roofing, Flooring, Garage Conversions) · Projects · Before & After ·
Reviews · Why Choose Us · Request a Quote · Contact · Privacy Policy · Terms of Use.

---

## 14. Client presentation

A premium 20-slide deck is in `assets/presentation/`:

- `Vision-Touch-Website-Presentation.pptx` — editable PowerPoint
- `Vision-Touch-Website-Presentation.pdf` — shareable PDF export

It uses the Vision Touch brand palette and an Auztec Innovations master layout that can be reused for
future client decks. The source generator is `build/build-presentation.mjs` (run from a folder with
`pptxgenjs react react-dom react-icons sharp` installed; it reads images from `assets/`).

> The deck currently renders the Auztec name as a typographic wordmark. Drop a real
> `assets/presentation/auztec-logo.png` in and re-run the generator to use the logo image.

---

*Design inspiration adapted from a Canva template. Final website custom-designed and developed for
Vision Touch Ltd by Auztec Innovations.*
