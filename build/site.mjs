/* ============================================================================
   Vision Touch Ltd — site config, icon set, and shared layout partials.
   Consumed by build.mjs to generate static HTML.
   ========================================================================== */

export const SITE = {
  name: 'Vision Touch Ltd',
  legalName: 'Vision Touch Ltd',
  tagline: 'Premium Construction, Renovation & Conversion Specialists',
  domain: 'https://www.visiontouchltd.co.uk',        // official domain
  phone: '07572 222245',
  phoneRaw: '07572222245',
  phoneIntl: '447572222245',
  email: 'inquiries@visiontouchltd.co.uk',
  area: 'Greater London',
  address: {
    line1: '82 Chatsworth Road',
    line2: 'Lower Clapton',
    city: 'London',
    postcode: 'E5 0LS',
    country: 'GB',
    full: '82 Chatsworth Road, Lower Clapton, London, E5 0LS',
  },
  // Web3Forms access key — paste the key emailed to inquiries@visiontouchltd.co.uk (see README §7).
  // Until this is set, the form shows a friendly "email us directly" message instead of sending.
  web3formsKey: 'bfc71cc9-2ef2-4d65-a6f3-56e8bd231e6b',
  // Animated 3D logo (entrance + gentle float/tilt + hover barrel-roll). Set to false to revert
  // to a completely static logo, then re-run `node build/build.mjs`.
  logoMotion: true,
  // Replace with the real pages before launch (see README)
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  waMessage: 'Hi Vision Touch Ltd, I would like to discuss a construction or renovation project and request a quote.',
};
SITE.waLink = `https://wa.me/${SITE.phoneIntl}?text=${encodeURIComponent(SITE.waMessage)}`;
SITE.telLink = `tel:+${SITE.phoneIntl}`;
SITE.mailLink = `mailto:${SITE.email}`;

/* ----------------------------------------------------------------- Icons */
const i = (b) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${b}</svg>`;
const f = (b) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${b}</svg>`;
export const ICON = {
  phone: i('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  mail: i('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  whatsapp: f('<path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.16c-.25.69-1.45 1.32-1.99 1.4-.53.08-1.18.11-1.9-.12-.44-.14-1-.32-1.72-.64-3.03-1.31-5-4.36-5.16-4.57-.15-.2-1.23-1.64-1.23-3.13s.78-2.22 1.06-2.53c.28-.31.61-.38.81-.38.2 0 .41 0 .59.01.19.01.44-.07.69.53.25.6.86 2.08.94 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.31.39-.45.53-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.64-.08.18-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.71.81 2 .96.3.15.5.22.57.35.07.13.07.74-.18 1.43z"/>'),
  arrow: i('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  chevDown: i('<path d="m6 9 6 6 6-6"/>'),
  chevRight: i('<path d="m9 6 6 6-6 6"/>'),
  check: i('<path d="M20 6 9 17l-5-5"/>'),
  pin: i('<path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  star: f('<path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.2l1.2-6.6L2.5 9l6.6-.9z"/>'),
  plus: i('<path d="M12 5v14M5 12h14"/>'),
  clock: i('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  shield: i('<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="m9 12 2 2 4-4"/>'),
  award: i('<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/>'),
  thumb: i('<path d="M7 10v11H4V10zM7 10l4-7a2 2 0 0 1 2 1.5L12 9h6a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 16.8 20H7"/>'),
  users: i('<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.8M22 20a6 6 0 0 0-4.5-5.8"/>'),
  pound: i('<path d="M16 6.5A4 4 0 0 0 9 9v4H7m0 0h5m-5 0v3.5A2.5 2.5 0 0 0 9.5 19H17M8 19h9"/>'),
  ruler: i('<rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(-45 12 12)"/><path d="M8 8.5 9.5 10M11 5.5 12.5 7M14 8.5 15.5 10"/>'),
  layers: i('<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>'),
  sparkle: i('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>'),
  leaf: i('<path d="M5 20s1-9 8-13c4-2 6-2 6-2s0 2-2 6c-4 7-12 9-12 9z"/><path d="M5 20c4-4 7-6 10-7"/>'),
  hardhat: i('<path d="M3 17h18v2H3z"/><path d="M5 17v-2a7 7 0 0 1 14 0v2"/><path d="M12 5V4M9 7l1.5 1M15 7l-1.5 1"/>'),
  quote: f('<path d="M9 7H5a3 3 0 0 0-3 3v7h7v-7H5a2 2 0 0 1 2-2h2zM20 7h-4a3 3 0 0 0-3 3v7h7v-7h-4a2 2 0 0 1 2-2h2z" opacity=".25"/>'),
  calendar: i('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>'),
  hammer: i('<path d="M14 4l6 6-2 2-3-3-7 7a2 2 0 0 1-3-3l7-7-3-3z"/>'),
  facebook: f('<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/>'),
  instagram: i('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/>'),
  // service marks
  loft: i('<path d="M3 11 12 4l9 7"/><path d="M5 10v9h14v-9"/><path d="M10 19v-5h4v5"/>'),
  extension: i('<path d="M3 21V10l6-5 6 5v11"/><path d="M15 21v-7h6v7"/><path d="M18 14v-2"/>'),
  reno: i('<path d="M3 21h18"/><path d="m6 21 .8-4h4.4l.8 4"/><path d="M14 3l7 7-3 3-7-7z"/><path d="m11 6 3 3"/>'),
  carpentry: i('<path d="M3 7l8 2 10-3-1 4-9 2.5L3 11z"/><path d="m11 9-1 11"/>'),
  kitchen: i('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M9 5v2M9 13v5"/>'),
  bathroom: i('<path d="M4 12h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M6 12V6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2"/><path d="M7 18l-1 3M18 18l1 3"/>'),
  structural: i('<path d="M3 5h18M3 5v14M21 5v14M3 19h18"/><path d="m6 19 6-10 6 10M9 14h6"/>'),
  roofing: i('<path d="m2 12 10-7 10 7"/><path d="M5 10.5V19h14v-8.5"/><path d="M9 19v-4h6v4"/>'),
  flooring: i('<path d="M3 6h18v12H3z"/><path d="M3 10h18M3 14h18M7 6v4M11 10v4M15 14v4M15 6v4M7 14v4"/>'),
  garage: i('<path d="M3 21V8l9-4 9 4v13"/><path d="M6 21v-8h12v8"/><path d="M6 16h12M6 13h12"/>'),
};

/* ----------------------------------------------------------- Service nav list */
export const SERVICES = [
  { slug: 'loft-conversions',          label: 'Loft Conversions' },
  { slug: 'house-extensions',          label: 'House Extensions' },
  { slug: 'property-renovations',      label: 'Property Renovations' },
  { slug: 'carpentry-joinery',         label: 'Carpentry & Joinery' },
  { slug: 'kitchen-installation',      label: 'Kitchen Installation' },
  { slug: 'bathroom-installation',     label: 'Bathroom Installation' },
  { slug: 'structural-work',           label: 'Structural Work' },
  { slug: 'general-building-services', label: 'General Building Services' },
  { slug: 'roofing',                   label: 'Roofing' },
  { slug: 'flooring',                  label: 'Flooring' },
  { slug: 'garage-conversions',        label: 'Garage Conversions' },
];

/* ----------------------------------------------------------- HTML helpers */
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* <head> */
export function head(p) {
  const url = `${SITE.domain}/${p.path}`;
  const ogImg = `${SITE.domain}/${p.ogImage || 'assets/images/home/interior.jpg'}`;
  const schema = (p.schema || []).map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n');
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#16130F">
<meta name="robots" content="index, follow">
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImg}">
<meta property="og:locale" content="en_GB">
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.desc)}">
<meta name="twitter:image" content="${ogImg}">
<!-- Icons -->
<link rel="icon" href="assets/logo/favicon-32.png" sizes="32x32">
<link rel="icon" href="assets/logo/favicon-16.png" sizes="16x16">
<link rel="apple-touch-icon" href="assets/logo/apple-touch-icon.png">
<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css">
${schema}
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>`;
}

/* Header */
export function header(active) {
  const isAct = (s) => active === s ? ' aria-current="page"' : '';
  const servicesMenu = SERVICES.map((s) =>
    `<a href="${s.slug}.html"${active === s.slug ? ' aria-current="page"' : ''}><span class="dot"></span>${s.label}</a>`).join('');
  return `
<header class="site-header">
  <div class="container">
    <a class="brand${SITE.logoMotion ? ' logo-motion' : ''}" href="index.html" aria-label="${SITE.name} — home">
      <img class="brand__mark" src="assets/logo/vision-touch-mark.webp" alt="" width="46" height="46">
      <img class="brand__word" src="assets/logo/vision-touch-word-light-noltd.webp" alt="${SITE.name}" width="196" height="22">
    </a>
    <nav class="nav" aria-label="Primary">
      <a href="about.html"${isAct('about')}>About</a>
      <div class="has-sub">
        <button type="button" aria-haspopup="true" aria-expanded="false">Services ${ICON.chevDown}</button>
        <div class="submenu" role="menu">
          <a href="services.html"${isAct('services')}><span class="dot"></span>All Services</a>
          ${servicesMenu}
        </div>
      </div>
      <a href="projects.html"${isAct('projects')}>Projects</a>
      <a href="before-after.html"${isAct('before-after')}>Gallery</a>
      <a href="why-choose-us.html"${isAct('why-choose-us')}>Why Us</a>
      <a href="contact.html"${isAct('contact')}>Contact</a>
      <a class="btn btn--primary btn--sm" href="request-a-quote.html">Request a Quote</a>
    </nav>
    <div class="header-cta">
      <a class="btn btn--primary btn--sm" href="request-a-quote.html">Get a Quote</a>
      <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;
}

/* Footer + floating WhatsApp + scripts */
export function footer(scripts = []) {
  const svc = SERVICES.slice(0, 8).map((s) => `<a href="${s.slug}.html">${s.label}</a>`).join('');
  const scriptTags = ['assets/js/main.js', ...scripts].map((s) => `<script src="${s}" defer></script>`).join('\n');
  return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand brand--footer${SITE.logoMotion ? ' logo-motion' : ''}" href="index.html" aria-label="${SITE.name} — home">
          <img class="brand__mark" src="assets/logo/vision-touch-mark.webp" alt="" width="52" height="52">
          <img class="brand__word brand__word--full" src="assets/logo/vision-touch-word-light.webp" alt="${SITE.name}" width="300" height="28">
        </a>
        <p style="max-width:34ch;margin-top:1.1rem">Premium construction and property improvement across ${SITE.area}. Loft conversions, extensions, renovations, roofing and complete building services built to increase property value.</p>
        <div class="socials">
          <a href="${SITE.facebook}" aria-label="${SITE.name} on Facebook" target="_blank" rel="noopener">${ICON.facebook}</a>
          <a href="${SITE.instagram}" aria-label="${SITE.name} on Instagram" target="_blank" rel="noopener">${ICON.instagram}</a>
          <a href="${SITE.waLink}" aria-label="Message ${SITE.name} on WhatsApp" target="_blank" rel="noopener">${ICON.whatsapp}</a>
        </div>
      </div>
      <div>
        <h4>Services</h4>
        <div class="footer-links">${svc}<a href="services.html">View all services</a></div>
      </div>
      <div>
        <h4>Company</h4>
        <div class="footer-links">
          <a href="about.html">About Us</a>
          <a href="why-choose-us.html">Why Choose Us</a>
          <a href="projects.html">Projects</a>
          <a href="before-after.html">Before &amp; After</a>
          <a href="reviews.html">Reviews</a>
          <a href="request-a-quote.html">Request a Quote</a>
        </div>
      </div>
      <div>
        <h4>Get in touch</h4>
        <ul class="footer-contact">
          <li>${ICON.phone}<a href="${SITE.telLink}">Call us</a></li>
          <li>${ICON.whatsapp}<a href="${SITE.waLink}" target="_blank" rel="noopener">WhatsApp us</a></li>
          <li>${ICON.mail}<a href="${SITE.mailLink}">${SITE.email}</a></li>
          <li>${ICON.pin}<span>${SITE.address.line1}, ${SITE.address.line2},<br>${SITE.address.city}, ${SITE.address.postcode}</span></li>
          <li>${ICON.clock}<span>Mon–Sat, 8:00am–6:00pm</span></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> ${SITE.legalName}. All rights reserved.</span>
      <span style="display:flex;gap:1.2rem;flex-wrap:wrap">
        <a href="privacy-policy.html">Privacy Policy</a>
        <a href="terms.html">Terms of Use</a>
        <a href="contact.html">Contact</a>
      </span>
    </div>
    <div class="footer-credit">
      <a class="footer-auztec" href="https://www.auztecinnovations.com" target="_blank" rel="noopener" aria-label="Auztec Innovations — visit website">
        <img src="assets/logo/auztec-logo.webp" alt="Auztec Innovations" width="120" height="69" loading="lazy">
      </a>
      <p>Website custom-designed and developed for ${SITE.name} by Auztec Innovations.</p>
    </div>
  </div>
</footer>

<!-- Floating WhatsApp -->
<div class="wa-float">
  <span class="wa-bubble">Need a quote?</span>
  <a class="wa-float__btn" href="${SITE.waLink}" target="_blank" rel="noopener" aria-label="Chat with ${SITE.name} on WhatsApp">${ICON.whatsapp}</a>
</div>

${scriptTags}
<script src="assets/js/hammer-cursor.js" defer></script>
<!-- Vivi assistant: config + lazy loader (widget JS/CSS load after page load, on idle) -->
<script>
window.VT_CHAT={formKey:'${SITE.web3formsKey}',email:'${SITE.email}',wa:'${SITE.waLink}',tel:'${SITE.telLink}'};
(function(){var go=function(){var l=document.createElement('link');l.rel='stylesheet';l.href='assets/css/chatbot.css';document.head.appendChild(l);var s=document.createElement('script');s.src='assets/js/chatbot.js';s.defer=true;document.body.appendChild(s)};window.addEventListener('load',function(){('requestIdleCallback'in window)?requestIdleCallback(go,{timeout:4000}):setTimeout(go,1800)})})();
</script>
</body>
</html>`;
}

/* ----------------------------------------------------------- Section components */
export function badges(items) {
  return `<div class="hero__badges">${items.map((b) => `<span class="hero__badge">${ICON.check}${b}</span>`).join('')}</div>`;
}

export function trustStrip() {
  const items = [
    [ICON.shield, 'UK-Based Company', 'Registered &amp; reliable'],
    [ICON.pin, 'Greater London', 'Full area coverage'],
    [ICON.award, 'Certified Carpentry', 'Skilled UK tradespeople'],
    [ICON.users, 'Residential &amp; Development', 'Homes &amp; investors'],
    [ICON.thumb, 'Free Quotes', 'Enquiries welcomed'],
  ];
  return `<section class="trust-strip"><div class="container">
    ${items.map(([ic, t, s]) => `<div class="trust-item">${ic}<span>${t}<small>${s}</small></span></div>`).join('')}
  </div></section>`;
}

export function ctaBanner(opts = {}) {
  const heading = opts.heading || 'Planning a loft conversion, renovation, extension, roofing or flooring project?';
  const text = opts.text || 'Tell us about your project and we’ll provide a clear, no-obligation quote. Friendly advice, honest pricing and quality workmanship across Greater London.';
  const img = opts.img || 'assets/images/services/property-renovations/property-renovations-card.webp';
  return `<section class="section"><div class="container"><div class="cta-banner reveal">
    <img src="${img}" alt="" loading="lazy" aria-hidden="true">
    <span class="eyebrow">Let’s build something great</span>
    <h2>${heading}</h2>
    <p class="lead">${text}</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="request-a-quote.html">Request a Quote ${ICON.arrow}</a>
      <a class="btn btn--wa" href="${SITE.waLink}" target="_blank" rel="noopener">${ICON.whatsapp} WhatsApp Us</a>
      <a class="btn btn--ghost" href="${SITE.telLink}">${ICON.phone} Call Us</a>
    </div>
  </div></div></section>`;
}

export function faqSection(faqs, dark = false) {
  return `<section class="section ${dark ? 'bg-dark' : 'bg-stone-2'}"><div class="container">
    <div class="section-head center reveal">
      <span class="eyebrow">Good to know</span>
      <h2>Frequently asked questions</h2>
    </div>
    <div class="faq reveal">
      ${faqs.map((q) => `<details class="faq__item"><summary class="faq__q">${q.q}<span class="plus">${ICON.plus}</span></summary><div class="faq__a">${q.a}</div></details>`).join('')}
    </div>
  </div></section>`;
}

/* picture element helper (webp + jpg fallback) */
export function picture(base, alt, cls = '', lazy = true, sizes = '') {
  const load = lazy ? 'loading="lazy" decoding="async"' : 'fetchpriority="high"';
  return `<picture><source srcset="${base}.webp" type="image/webp">` +
    `<img src="${base}.jpg" alt="${esc(alt)}" ${load} ${cls ? `class="${cls}"` : ''}></picture>`;
}

/* schema builders */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE.domain}/#business`,
    name: SITE.name,
    image: `${SITE.domain}/assets/images/home/interior.jpg`,
    url: SITE.domain,
    telephone: `+${SITE.phoneIntl}`,
    email: SITE.email,
    priceRange: '££–£££',
    areaServed: { '@type': 'AdministrativeArea', name: 'Greater London' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${SITE.address.line1}, ${SITE.address.line2}`,
      addressLocality: SITE.address.city,
      addressRegion: 'Greater London',
      postalCode: SITE.address.postcode,
      addressCountry: SITE.address.country,
    },
    sameAs: [SITE.facebook, SITE.instagram],
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      opens: '08:00', closes: '18:00',
    }],
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, n) => ({
      '@type': 'ListItem', position: n + 1, name: it.name, item: `${SITE.domain}/${it.path}`,
    })),
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((q) => ({
      '@type': 'Question', name: q.q.replace(/<[^>]+>/g, ''),
      acceptedAnswer: { '@type': 'Answer', text: q.a.replace(/<[^>]+>/g, '') },
    })),
  };
}

export function serviceSchema(s) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.label,
    serviceType: s.label,
    provider: { '@type': 'HomeAndConstructionBusiness', name: SITE.name, telephone: `+${SITE.phoneIntl}` },
    areaServed: { '@type': 'AdministrativeArea', name: 'Greater London' },
    description: s.desc,
    url: `${SITE.domain}/${s.slug}.html`,
  };
}
