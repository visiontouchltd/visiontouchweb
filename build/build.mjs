/* ============================================================================
   Vision Touch Ltd — static site generator.
   Run:  node build/build.mjs   (from the vision-touch-website folder root)
   Outputs all .html pages into the project root.
   ========================================================================== */
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  SITE, ICON, SERVICES, esc, head, header, footer, trustStrip, badges,
  ctaBanner, faqSection, picture, localBusinessSchema, breadcrumbSchema,
  faqSchema, serviceSchema,
} from './site.mjs';
import {
  PROCESS, WHY_POINTS, SERVICE_CONTENT, PROJECTS, REVIEWS, FAQ_HOME,
} from './content.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const write = (file, html) => { writeFileSync(path.join(ROOT, file), html); console.log('  ✓', file); };

/* ---------- small render helpers ---------- */
const stars = (n = 5) => `<span class="stars" aria-label="${n} out of 5 stars">${ICON.star.repeat(n)}</span>`;
const cardPic = (base, alt) => `<picture><source srcset="${base}-card.webp" type="image/webp"><img src="${base}.jpg" alt="${esc(alt)}" loading="lazy" decoding="async"></picture>`;
const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');

function serviceCards(list = SERVICES, limit) {
  const items = (limit ? list.slice(0, limit) : list).map((s, n) => {
    const c = SERVICE_CONTENT[s.slug];
    return `<a class="card-service reveal" data-d="${(n % 4) + 1}" href="${s.slug}.html" aria-label="${s.label}">
      ${cardPic(c.hero, s.label + ' — ' + SITE.area)}
      <span class="card-service__tag">${s.label}</span>
      <div class="card-service__body">
        <h3>${s.label}</h3>
        <p>${esc(c.short)}</p>
        <span class="link-arrow">Explore ${ICON.arrow}</span>
      </div>
    </a>`;
  }).join('');
  return items;
}

function processSteps(steps = PROCESS, dark = false) {
  return `<div class="steps steps--row">${steps.map((s) =>
    `<div class="step reveal"><h4>${s.t}</h4><p>${s.d}</p></div>`).join('')}</div>`;
}

function reviewCard(r) {
  return `<article class="review">
    ${stars(r.stars)}
    <p>“${esc(r.text)}”</p>
    <div class="review__by">
      <span class="review__avatar" aria-hidden="true">${initials(r.name)}</span>
      <span><span class="review__name">${esc(r.name)}</span><br><span class="review__meta">${esc(r.loc)} · ${esc(r.service)}</span></span>
    </div>
  </article>`;
}

function reviewsCarousel(list = REVIEWS) {
  return `<div class="reviews-carousel" data-carousel>
    <div class="reviews-track-wrap">
      <div class="reviews-track">${list.map(reviewCard).join('')}</div>
    </div>
    <div class="carousel-dots" data-dots role="tablist" aria-label="Choose review"></div>
  </div>`;
}

function projectCard(p) {
  return `<button type="button" class="project reveal" data-cat="${p.cat}" data-full="${p.img}.jpg" data-title="${esc(p.name)}" data-caption="${esc(p.catLabel + ' · ' + p.loc + ', ' + SITE.area)}" aria-label="View project photo: ${esc(p.name)}">
    ${cardPic(p.img, p.name)}
    <span class="project__zoom" aria-hidden="true">${ICON.plus}</span>
    <div class="project__body">
      <span class="project__cat">${p.catLabel}</span>
      <h3>${p.name}</h3>
      <span class="project__loc">${ICON.pin}${p.loc}, ${SITE.area}</span>
    </div>
  </button>`;
}

/* before/after pairs — real Vision Touch Ltd projects */
const BA_ROOT = 'assets/images/before-after';
const BA_PAIRS = [
  { base: 'kitchen-renovation-1', label: 'Galley Kitchen Renovation', ratio: '4 / 5' },
  { base: 'kitchen-renovation-2', label: 'Fitted Kitchen Transformation', ratio: '4 / 5' },
  { base: 'media-wall', label: 'Bespoke Media Wall', ratio: '4 / 5' },
  { base: 'staircase-renovation', label: 'Staircase Renovation', ratio: '4 / 5' },
  { base: 'facade-renovation', label: 'Exterior Rendering & Facade Renovation', ratio: '16 / 10', wide: true },
].map((p) => ({ ...p, before: `${BA_ROOT}/${p.base}-before`, after: `${BA_ROOT}/${p.base}-after` }));

function baImg(base, side, alt) {
  return `<picture><source srcset="${base}.webp" type="image/webp"><img class="ba__${side}" src="${base}.jpg" alt="${esc(alt)}" draggable="false"></picture>`;
}
function baCard(p) {
  return `<div class="ba-item reveal${p.wide ? ' ba-item--wide' : ''}">
    <figure class="ba" style="aspect-ratio:${p.ratio || '4 / 5'}" role="group" aria-label="Before and after: ${esc(p.label)}">
      ${baImg(p.before, 'before', 'Before — ' + p.label + ' by Vision Touch Ltd, Greater London')}
      ${baImg(p.after, 'after', 'After — ' + p.label + ' by Vision Touch Ltd, Greater London')}
      <span class="ba__divider"></span>
      <span class="ba__handle">${ICON.chevRight}</span>
      <span class="ba__label ba__label--b">Before</span>
      <span class="ba__label ba__label--a">After</span>
    </figure>
    <p class="ba-caption"><strong>${esc(p.label)}</strong><span>Before &amp; After · Greater London</span></p>
  </div>`;
}

/* "See us at work" — ongoing project photos */
const WORK = [
  ['work-04', 'Full house renovation in progress in Greater London', 825, 1100],
  ['work-06', 'Courtyard renovation and groundworks in progress', 1114, 1100],
  ['work-07', 'House renovation and strip-out in progress', 825, 1100],
  ['work-09', 'Entrance and hallway renovation in progress', 825, 1100],
  ['work-10', 'Courtyard and external works in progress', 1098, 1100],
  ['work-11', 'Staircase renovation taking shape', 825, 1100],
  ['work-13', 'Full property renovation mid-build', 619, 1100],
  ['work-14', 'Staircase construction and joinery in progress', 825, 1100],
  ['work-15', 'Entrance renovation and finishing works', 825, 1100],
  ['work-16', 'Exterior facade before rendering and renovation', 825, 1100],
  ['work-17', 'Kitchen renovation in progress', 825, 1100],
  ['work-18', 'Bespoke media wall installation', 825, 1100],
];
function workGallery() {
  const card = (base, alt) => `<figure class="cf__card"><picture><source srcset="assets/images/work/${base}.webp" type="image/webp"><img src="assets/images/work/${base}.jpg" alt="${esc(alt)}" loading="lazy" decoding="async" draggable="false"></picture></figure>`;
  const cards = WORK.map(([b, a]) => card(b, a)).join('');
  const dots = WORK.map((_, i) => `<button type="button" class="cf__dot" data-cf-dot="${i}" aria-label="Go to photo ${i + 1}"></button>`).join('');
  return `<div class="cf reveal" data-coverflow tabindex="0" aria-roledescription="carousel" aria-label="Vision Touch Ltd projects in progress">
    <div class="cf__viewport"><div class="cf__stage">${cards}</div></div>
    <div class="cf__controls">
      <button type="button" class="cf__arrow" data-cf-prev aria-label="Previous photo">${ICON.chevRight}</button>
      <div class="cf__dots" data-cf-dots>${dots}</div>
      <button type="button" class="cf__arrow cf__arrow--next" data-cf-next aria-label="Next photo">${ICON.chevRight}</button>
    </div>
  </div>`;
}

/* ===========================================================================
   HOME
   ======================================================================== */
function buildHome() {
  const schema = [
    localBusinessSchema(),
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.domain },
    faqSchema(FAQ_HOME),
  ];
  const body = `
${header('home')}
<main id="main">
  <section class="hero">
    <div class="hero__media">
      <video autoplay muted loop playsinline preload="metadata" poster="assets/images/home/hero-poster.jpg">
        <source src="assets/videos/hero.mp4" type="video/mp4">
      </video>
    </div>
    <div class="container hero__inner">
      <span class="eyebrow">${SITE.area} · Construction & Property Improvement</span>
      <h1>Premium Construction, Renovation &amp; Conversion Services Across Greater London</h1>
      <p class="lead">Loft conversions, extensions, renovations, roofing, flooring, carpentry and complete building services — designed to improve your home and increase its value.</p>
      <div class="btn-row hero__cta">
        <a class="btn btn--primary" href="request-a-quote.html">Request a Quote ${ICON.arrow}</a>
        <a class="btn btn--wa" href="${SITE.waLink}" target="_blank" rel="noopener">${ICON.whatsapp} WhatsApp Us</a>
        <a class="btn btn--ghost" href="${SITE.telLink}">${ICON.phone} Call Us</a>
      </div>
      ${badges(['UK-based company', 'Greater London coverage', 'Certified carpentry', 'Free no-obligation quotes'])}
    </div>
  </section>

  ${trustStrip()}

  <section class="section bg-stone">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">What we do</span>
        <h2>Complete building services, one trusted team</h2>
        <p class="lead">From a single fitted bathroom to a full property transformation, we deliver craftsmanship and reliability across every trade.</p>
      </div>
      <div class="grid grid-4">${serviceCards(SERVICES, 8)}</div>
      <div class="center" style="margin-top:2.4rem"><a class="btn btn--ghost-dark" href="services.html">View all services ${ICON.arrow}</a></div>
    </div>
  </section>

  <section class="section bg-stone-2">
    <div class="container">
      <div class="feature-row">
        <div class="feature-row__media reveal">${picture('assets/images/home/interior', 'Premium interior finished by Vision Touch Ltd', '', true)}</div>
        <div class="reveal">
          <span class="eyebrow">About Vision Touch Ltd</span>
          <h2>Craftsmanship, reliability and practical building solutions</h2>
          <p>Vision Touch Ltd is a UK-based construction and property improvement company delivering high-quality residential and development projects across Greater London. We specialise in loft conversions, renovations, carpentry, extensions and complete building services designed to increase property value and improve living spaces.</p>
          <ul class="feature-list">
            <li>${ICON.check}<span>Trusted by homeowners, investors, developers &amp; contractors</span></li>
            <li>${ICON.check}<span>One accountable team managing every trade</span></li>
            <li>${ICON.check}<span>Honest pricing, clear timelines and tidy sites</span></li>
          </ul>
          <div class="btn-row" style="margin-top:1.8rem">
            <a class="btn btn--primary" href="about.html">More about us ${ICON.arrow}</a>
            <a class="btn btn--ghost-dark" href="why-choose-us.html">Why choose us</a>
          </div>
        </div>
      </div>
      <div class="stats reveal" style="margin-top:clamp(3rem,5vw,5rem)">
        <div class="stat"><div class="stat__num"><span data-count="11" data-suffix="">0</span></div><div class="stat__label">Specialist services</div></div>
        <div class="stat"><div class="stat__num"><span data-count="100" data-suffix="%">0</span></div><div class="stat__label">Greater London focus</div></div>
        <div class="stat"><div class="stat__num"><span data-count="5" data-suffix="★">0</span></div><div class="stat__label">Workmanship standard</div></div>
        <div class="stat"><div class="stat__num"><span data-count="1" data-suffix="">0</span></div><div class="stat__label">Reliable team, end to end</div></div>
      </div>
    </div>
  </section>

  <section class="section bg-dark">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">How we work</span>
        <h2>A clear, premium process from first call to handover</h2>
      </div>
      ${processSteps(PROCESS, true)}
    </div>
  </section>

  <section class="section--tight bg-stone">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Before &amp; after</span>
        <h2>See the transformation</h2>
        <p class="lead">Drag the slider to reveal the difference quality building work makes.</p>
      </div>
      <div class="ba-grid ba-grid--home">${BA_PAIRS.slice(0, 2).map(baCard).join('')}</div>
      <div class="center" style="margin-top:2rem"><a class="btn btn--ghost-dark" href="before-after.html">View the full gallery ${ICON.arrow}</a></div>
    </div>
  </section>

  <section class="section--tight bg-stone-2 work-section">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">On site</span>
        <h2>See us at work</h2>
        <p class="lead">Live Vision Touch Ltd projects in progress across Greater London — structural work, renovations and fit-outs.</p>
      </div>
      ${workGallery()}
    </div>
  </section>

  <section class="section bg-stone-2">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Recent projects</span>
        <h2>Quality work across Greater London</h2>
        <p class="lead">A selection of the kinds of projects we deliver for homeowners and investors.</p>
      </div>
      <div class="portfolio-grid">${PROJECTS.slice(0, 6).map(projectCard).join('')}</div>
      <div class="center" style="margin-top:2.4rem"><a class="btn btn--ghost-dark" href="projects.html">See all projects ${ICON.arrow}</a></div>
    </div>
  </section>

  <section class="section bg-dark">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Customer reviews</span>
        <h2>What our clients say</h2>
      </div>
      ${reviewsCarousel(REVIEWS)}
      <div class="center" style="margin-top:2rem"><a class="btn btn--ghost" href="reviews.html">Read more reviews ${ICON.arrow}</a></div>
    </div>
  </section>

  <section class="section bg-stone">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Why Vision Touch Ltd</span>
        <h2>Built on trust, finished with care</h2>
      </div>
      <div class="grid grid-3">
        ${WHY_POINTS.map((w, n) => `<div class="card reveal" data-d="${(n % 3) + 1}"><div class="icon-badge">${ICON[w.icon]}</div><h3>${w.t}</h3><p>${w.d}</p></div>`).join('')}
      </div>
    </div>
  </section>

  ${ctaBanner()}
  ${faqSection(FAQ_HOME)}
</main>
${footer(['assets/js/carousel.js', 'assets/js/gallery.js'])}`;

  write('index.html', head({
    title: 'Vision Touch Ltd | Construction, Loft Conversions & Renovations in Greater London',
    desc: 'Premium construction, loft conversions, extensions, renovations, roofing and building services across Greater London. Vision Touch Ltd — craftsmanship, reliability and free quotes.',
    path: 'index.html',
    schema,
  }) + body);
}

/* ===========================================================================
   SERVICE PAGE (generic)
   ======================================================================== */
function buildService(slug) {
  const s = SERVICES.find((x) => x.slug === slug);
  const c = SERVICE_CONTENT[slug];
  const crumb = [{ name: 'Home', path: 'index.html' }, { name: 'Services', path: 'services.html' }, { name: s.label, path: `${slug}.html` }];
  const schema = [
    serviceSchema({ ...s, slug, desc: c.metaDesc }),
    breadcrumbSchema(crumb),
    faqSchema(c.faqs),
  ];

  const featureRows = c.features.map((fr, n) => {
    const media = fr.video
      ? `<div class="feature-row__media reveal"><video autoplay muted loop playsinline preload="none" poster="${fr.poster}.jpg"><source src="${fr.video}" type="video/mp4"></video></div>`
      : `<div class="feature-row__media reveal">${picture(fr.img, `${c.label} — ${fr.t}`)}</div>`;
    const text = `<div class="reveal">
      <span class="eyebrow">${n === 0 ? 'Our approach' : 'The detail'}</span>
      <h2>${fr.t}</h2>
      <p>${fr.d}</p>
      <ul class="feature-list">${fr.list.map((l) => `<li>${ICON.check}<span>${l}</span></li>`).join('')}</ul>
      <div class="btn-row" style="margin-top:1.8rem"><a class="btn btn--primary" href="request-a-quote.html">Request a Quote ${ICON.arrow}</a></div>
    </div>`;
    return `<div class="feature-row ${fr.rev ? 'feature-row--rev' : ''}">${media}${text}</div>`;
  }).join('');

  const otherServices = SERVICES.filter((x) => x.slug !== slug).slice(0, 6)
    .map((x) => `<a class="chip" href="${x.slug}.html">${x.label}</a>`).join('');

  const placeholder = c.placeholderNote
    ? `<!-- NOTE: imagery on this page is a tasteful placeholder reused from related services. Replace with real ${c.label} photos before launch. -->`
    : '';

  const body = `
${placeholder}
${header(slug)}
<main id="main">
  <section class="hero hero--page">
    <div class="hero__media hero__media--page">${picture(c.hero, `${c.label} in ${SITE.area}`, '', false)}</div>
    <div class="container hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="services.html">Services</a><span>/</span>${c.label}</nav>
      <span class="eyebrow">${SITE.area}</span>
      <h1>${c.label} in Greater London</h1>
      <p class="lead">${esc(c.short)}</p>
      <div class="btn-row hero__cta">
        <a class="btn btn--primary" href="request-a-quote.html">Request a Quote ${ICON.arrow}</a>
        <a class="btn btn--wa" href="${SITE.waLink}" target="_blank" rel="noopener">${ICON.whatsapp} WhatsApp Us</a>
        <a class="btn btn--ghost" href="${SITE.telLink}">${ICON.phone} Call Us</a>
      </div>
    </div>
  </section>

  <section class="section bg-stone">
    <div class="container narrow center">
      <div class="icon-badge reveal" style="margin:0 auto 1.4rem">${ICON[c.icon]}</div>
      <p class="lead reveal" style="font-size:clamp(1.15rem,1rem+.6vw,1.45rem);color:var(--ink)">${c.intro}</p>
      <p class="reveal" style="margin-top:1.2rem">${c.why}</p>
    </div>
  </section>

  <section class="section bg-stone-2">
    <div class="container">${featureRows}</div>
  </section>

  <section class="section bg-stone">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">The benefits</span>
        <h2>Why homeowners &amp; investors choose us for ${c.label.toLowerCase()}</h2>
      </div>
      <div class="grid grid-4">
        ${c.benefits.map((b, n) => `<div class="card reveal" data-d="${(n % 4) + 1}"><div class="icon-badge">${ICON.check}</div><h4>${b.t}</h4><p>${b.d}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section bg-dark">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Our process</span>
        <h2>How your ${c.label.toLowerCase()} project runs</h2>
      </div>
      ${processSteps(PROCESS, true)}
    </div>
  </section>

  ${faqSection(c.faqs)}

  <section class="section--tight bg-stone">
    <div class="container center">
      <p class="eyebrow" style="justify-content:center">Explore more</p>
      <div class="chips reveal" style="justify-content:center;max-width:760px;margin-inline:auto">${otherServices}<a class="chip" href="services.html">All services</a></div>
    </div>
  </section>

  ${ctaBanner({ heading: `Ready to start your ${c.label.toLowerCase()} project?`, img: `${c.hero}-card.webp` })}
</main>
${footer()}`;

  write(`${slug}.html`, head({
    title: c.metaTitle, desc: c.metaDesc, path: `${slug}.html`,
    ogImage: `${c.hero}.jpg`, keywords: c.keywords, schema,
  }) + body);
}

/* ===========================================================================
   SERVICES OVERVIEW
   ======================================================================== */
function buildServices() {
  const crumb = [{ name: 'Home', path: 'index.html' }, { name: 'Services', path: 'services.html' }];
  const body = `
${header('services')}
<main id="main">
  <section class="hero hero--page">
    <div class="hero__media hero__media--page">${picture('assets/images/services/general-building-services/general-building-services', 'Vision Touch Ltd building services', '', false)}</div>
    <div class="container hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>Services</nav>
      <span class="eyebrow">${SITE.area}</span>
      <h1>Our Construction &amp; Property Improvement Services</h1>
      <p class="lead">Everything you need to improve, extend and add value to your property — delivered by one reliable team across Greater London.</p>
      <div class="btn-row hero__cta">
        <a class="btn btn--primary" href="request-a-quote.html">Request a Quote ${ICON.arrow}</a>
        <a class="btn btn--ghost" href="${SITE.telLink}">${ICON.phone} Call Us</a>
      </div>
    </div>
  </section>
  ${trustStrip()}
  <section class="section bg-stone">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">11 specialist services</span>
        <h2>Choose the service you need</h2>
        <p class="lead">Each service has its own dedicated page with details, benefits and FAQs. Not sure where to start? Just ask — we’ll point you the right way.</p>
      </div>
      <div class="grid grid-3">${serviceCards(SERVICES)}</div>
    </div>
  </section>
  ${ctaBanner()}
</main>
${footer()}`;
  write('services.html', head({
    title: 'Construction & Building Services in Greater London | Vision Touch Ltd',
    desc: 'Explore Vision Touch Ltd’s construction services across Greater London — loft conversions, extensions, renovations, roofing, flooring, carpentry, kitchens, bathrooms and more.',
    path: 'services.html', schema: [localBusinessSchema(), breadcrumbSchema(crumb)],
  }) + body);
}

/* ===========================================================================
   ABOUT
   ======================================================================== */
function buildAbout() {
  const body = `
${header('about')}
<main id="main">
  <section class="hero hero--page">
    <div class="hero__media hero__media--page">${picture('assets/images/services/property-renovations/property-renovations-2', 'About Vision Touch Ltd', '', false)}</div>
    <div class="container hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>About</nav>
      <span class="eyebrow">About us</span>
      <h1>Building Better Spaces Across Greater London</h1>
      <p class="lead">Quality construction and property improvement, built on craftsmanship, reliability and practical solutions.</p>
    </div>
  </section>

  <section class="section bg-stone">
    <div class="container narrow center">
      <p class="lead reveal" style="color:var(--ink);font-size:clamp(1.2rem,1rem+.7vw,1.5rem)">Vision Touch Ltd is a UK-based construction and property improvement company focused on delivering high-quality residential and development projects.</p>
      <p class="reveal" style="margin-top:1.2rem">We specialise in loft conversions, renovations, carpentry, extensions and building services designed to increase property value and improve living spaces. Our approach combines craftsmanship, reliability and practical solutions for homeowners, investors, property developers and contractors across Greater London.</p>
    </div>
  </section>

  <section class="section bg-stone-2">
    <div class="container">
      <div class="feature-row">
        <div class="feature-row__media reveal">${picture('assets/images/services/carpentry-joinery/carpentry-joinery', 'Skilled carpentry by Vision Touch Ltd')}</div>
        <div class="reveal">
          <span class="eyebrow">Our approach</span>
          <h2>Practical solutions, premium finishes</h2>
          <p>We believe great building work is about more than bricks and timber — it’s about understanding what you actually need, advising you honestly, and delivering it to a standard we’re proud to put our name to.</p>
          <ul class="feature-list">
            <li>${ICON.check}<span>Honest advice focused on value, not upselling</span></li>
            <li>${ICON.check}<span>Skilled, certified tradespeople</span></li>
            <li>${ICON.check}<span>Tidy, well-managed and safe sites</span></li>
            <li>${ICON.check}<span>Clear communication from first call to handover</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section bg-stone">
    <div class="container">
      <div class="section-head center reveal"><span class="eyebrow">Who we help</span><h2>Trusted by homeowners and investors alike</h2></div>
      <div class="grid grid-4">
        <div class="card reveal"><div class="icon-badge">${ICON.users}</div><h4>Homeowners</h4><p>Improving and extending the homes families love to live in.</p></div>
        <div class="card reveal" data-d="1"><div class="icon-badge">${ICON.pound}</div><h4>Property Investors</h4><p>Refurbishments and upgrades that maximise rental and resale returns.</p></div>
        <div class="card reveal" data-d="2"><div class="icon-badge">${ICON.layers}</div><h4>Developers</h4><p>Reliable delivery on residential and development projects.</p></div>
        <div class="card reveal" data-d="3"><div class="icon-badge">${ICON.hardhat}</div><h4>Contractors</h4><p>A dependable building partner for trades and main contractors.</p></div>
      </div>
    </div>
  </section>

  <section class="section bg-stone-2">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">Where we work</span>
        <h2>Proudly serving Greater London</h2>
        <p class="lead">From the suburbs to the city, we deliver construction and property improvement projects right across the capital’s boroughs.</p>
      </div>
      <div class="map-layout">
        <div class="reveal">
          <h3 style="margin-bottom:1rem">Boroughs &amp; areas we cover</h3>
          <div class="chips areas-chips">
            ${['Wembley', 'Croydon', 'Ealing', 'Harrow', 'Stratford', 'Enfield', 'Richmond', 'Hounslow', 'Camden', 'Islington', 'Greenwich', 'Bromley', 'Barnet', 'Hammersmith', 'Wandsworth', 'Hackney'].map((b) => `<span class="chip">${ICON.pin}${b}</span>`).join('')}
          </div>
          <p style="margin-top:1.4rem">…plus all surrounding Greater London areas. Not sure if we cover your postcode? Just ask — we’re happy to help.</p>
          <div class="btn-row" style="margin-top:1.6rem">
            <a class="btn btn--primary" href="request-a-quote.html">Check your area ${ICON.arrow}</a>
            <a class="btn btn--wa" href="${SITE.waLink}" target="_blank" rel="noopener">${ICON.whatsapp} WhatsApp Us</a>
          </div>
        </div>
        <div class="map-embed reveal">
          <iframe
            title="Map of Greater London — Vision Touch Ltd service area"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317715!2d-0.24168!3d51.52877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon!5e0!3m2!1sen!2suk!4v1700000000000"
            loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen></iframe>
        </div>
      </div>
    </div>
  </section>

  <section class="section bg-dark">
    <div class="container">
      <div class="section-head center reveal"><span class="eyebrow">How we work</span><h2>A clear process, every project</h2></div>
      ${processSteps(PROCESS, true)}
    </div>
  </section>

  ${ctaBanner()}
</main>
${footer()}`;
  write('about.html', head({
    title: 'About Vision Touch Ltd | Construction Company in Greater London',
    desc: 'Vision Touch Ltd is a UK-based construction and property improvement company serving Greater London, delivering loft conversions, renovations, extensions and building services.',
    path: 'about.html', schema: [localBusinessSchema()],
  }) + body);
}

/* ===========================================================================
   PROJECTS
   ======================================================================== */
function buildProjects() {
  const cats = [...new Set(PROJECTS.map((p) => p.cat))];
  const chips = `<button class="chip active" data-filter="all">All projects</button>` +
    cats.map((cat) => `<button class="chip" data-filter="${cat}">${SERVICE_CONTENT[cat].label}</button>`).join('');
  const body = `
<!-- NOTE: projects below are realistic PLACEHOLDER demo entries. Replace with real client projects & photos before launch. -->
${header('projects')}
<main id="main">
  <section class="hero hero--page">
    <div class="hero__media hero__media--page">${picture('assets/images/services/house-extensions/house-extensions', 'Vision Touch Ltd projects', '', false)}</div>
    <div class="container hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>Projects</nav>
      <span class="eyebrow">Portfolio</span>
      <h1>Our Projects Across Greater London</h1>
      <p class="lead">A look at the kinds of transformations we deliver — from loft conversions to full renovations.</p>
    </div>
  </section>
  <section class="section bg-stone">
    <div class="container">
      <div class="chips reveal" style="justify-content:center;margin-bottom:2.4rem">${chips}</div>
      <div class="portfolio-grid">${PROJECTS.map(projectCard).join('')}</div>
      <p class="center" style="margin-top:2rem;color:var(--ink-faint);font-size:.9rem"><em>A selection of Vision Touch Ltd projects — click any photo to view it larger.</em></p>
    </div>
  </section>
  ${ctaBanner({ heading: 'Want a result like these for your property?' })}
</main>
${footer()}`;
  write('projects.html', head({
    title: 'Projects & Portfolio | Vision Touch Ltd | Greater London',
    desc: 'Browse Vision Touch Ltd construction and renovation projects across Greater London — loft conversions, extensions, kitchens, bathrooms, renovations and more.',
    path: 'projects.html', schema: [localBusinessSchema()],
  }) + body);
}

/* ===========================================================================
   BEFORE & AFTER
   ======================================================================== */
function buildBeforeAfter() {
  const body = `
${header('before-after')}
<main id="main">
  <section class="hero hero--page">
    <div class="hero__media hero__media--page">${picture(`${BA_ROOT}/facade-renovation-after`, 'Before and after transformations by Vision Touch Ltd', '', false)}</div>
    <div class="container hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>Before &amp; After</nav>
      <span class="eyebrow">The transformation</span>
      <h1>Before &amp; After Gallery</h1>
      <p class="lead">Drag each slider to reveal the difference quality building work makes — real Vision Touch Ltd projects across Greater London.</p>
    </div>
  </section>
  <section class="section bg-stone">
    <div class="container">
      <div class="ba-grid">${BA_PAIRS.map(baCard).join('')}</div>
    </div>
  </section>

  <section class="section--tight bg-stone-2 work-section">
    <div class="container">
      <div class="section-head center reveal">
        <span class="eyebrow">On site</span>
        <h2>See us at work</h2>
        <p class="lead">A behind-the-scenes look at live Vision Touch Ltd projects — structural work, renovations and fit-outs in progress across Greater London.</p>
      </div>
      ${workGallery()}
    </div>
  </section>

  ${ctaBanner()}
</main>
${footer(['assets/js/gallery.js'])}`;
  write('before-after.html', head({
    title: 'Before & After Gallery | Vision Touch Ltd | Greater London',
    desc: 'See the transformation — real before and after photos and on-site project images from Vision Touch Ltd construction and renovation work across Greater London.',
    path: 'before-after.html', schema: [localBusinessSchema()],
  }) + body);
}

/* ===========================================================================
   REVIEWS
   ======================================================================== */
function buildReviews() {
  const agg = {
    '@context': 'https://schema.org', '@type': 'HomeAndConstructionBusiness', name: SITE.name,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: String(REVIEWS.length) },
    review: REVIEWS.map((r) => ({ '@type': 'Review', author: { '@type': 'Person', name: r.name }, reviewRating: { '@type': 'Rating', ratingValue: r.stars, bestRating: 5 }, reviewBody: r.text })),
  };
  const body = `
<!-- NOTE: reviews are realistic PLACEHOLDER testimonials. Replace with genuine customer reviews before launch. -->
${header('reviews')}
<main id="main">
  <section class="hero hero--page">
    <div class="hero__media hero__media--page">${picture('assets/images/services/kitchen-installation/kitchen-installation', 'Customer reviews', '', false)}</div>
    <div class="container hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>Reviews</nav>
      <span class="eyebrow">Customer reviews</span>
      <h1>What Our Clients Say</h1>
      <p class="lead">Real results, reliable service — here’s the experience our clients describe.</p>
    </div>
  </section>
  <section class="section bg-stone">
    <div class="container">
      <div class="center reveal" style="margin-bottom:2.6rem">${stars(5)}<p style="font-weight:700;color:var(--ink);margin-top:.5rem">Rated 5.0 from our clients across Greater London</p></div>
      <div class="grid grid-3">${REVIEWS.map((r) => `<div class="card reveal">${reviewCard(r)}</div>`).join('')}</div>
    </div>
  </section>
  ${ctaBanner({ heading: 'Join our happy clients across Greater London' })}
</main>
${footer()}`;
  write('reviews.html', head({
    title: 'Customer Reviews | Vision Touch Ltd | Greater London',
    desc: 'Read customer reviews for Vision Touch Ltd — loft conversions, renovations, extensions and building services across Greater London.',
    path: 'reviews.html', schema: [agg],
  }) + body);
}

/* ===========================================================================
   WHY CHOOSE US
   ======================================================================== */
function buildWhy() {
  const body = `
${header('why-choose-us')}
<main id="main">
  <section class="hero hero--page">
    <div class="hero__media hero__media--page">${picture('assets/images/services/structural-work/structural-work', 'Why choose Vision Touch Ltd', '', false)}</div>
    <div class="container hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>Why Choose Us</nav>
      <span class="eyebrow">Why Vision Touch Ltd</span>
      <h1>Why Choose Vision Touch Ltd</h1>
      <p class="lead">Practical solutions, reliable workmanship and premium finishes — with your property’s value always in mind.</p>
    </div>
  </section>
  <section class="section bg-stone">
    <div class="container">
      <div class="grid grid-3">
        ${WHY_POINTS.map((w, n) => `<div class="card reveal" data-d="${(n % 3) + 1}"><div class="icon-badge">${ICON[w.icon]}</div><h3>${w.t}</h3><p>${w.d}</p></div>`).join('')}
      </div>
    </div>
  </section>
  <section class="section bg-dark">
    <div class="container">
      <div class="feature-row">
        <div class="feature-row__media reveal">${picture('assets/images/services/loft-conversions/loft-conversions-2', 'Quality building work')}</div>
        <div class="reveal">
          <span class="eyebrow">Our promise</span>
          <h2>Reliable from the first call to the final handover</h2>
          <p>We know inviting a builder into your home or trusting one with your investment is a big decision. That’s why we focus on the things that matter: turning up, communicating clearly, working cleanly and finishing properly.</p>
          <ul class="feature-list">
            <li>${ICON.check}<span>One accountable team for every trade</span></li>
            <li>${ICON.check}<span>Transparent, itemised quotes</span></li>
            <li>${ICON.check}<span>Residential and investor-friendly delivery</span></li>
            <li>${ICON.check}<span>Aftercare you can rely on</span></li>
          </ul>
          <div class="btn-row" style="margin-top:1.8rem"><a class="btn btn--primary" href="request-a-quote.html">Request a Quote ${ICON.arrow}</a></div>
        </div>
      </div>
    </div>
  </section>
  ${ctaBanner()}
</main>
${footer()}`;
  write('why-choose-us.html', head({
    title: 'Why Choose Us | Vision Touch Ltd | Greater London Builders',
    desc: 'Why choose Vision Touch Ltd — reliable workmanship, premium finishes, clear communication and a property-value focus on every project across Greater London.',
    path: 'why-choose-us.html', schema: [localBusinessSchema()],
  }) + body);
}

/* ===========================================================================
   QUOTE FORM (shared with contact)
   ======================================================================== */
function quoteFormHtml(id = 'quoteForm') {
  const serviceOpts = [...SERVICES.map((s) => s.label), 'Other'].map((o) => `<option>${o}</option>`).join('');
  return `<form class="form-card" id="${id}" data-enquiry method="POST" action="https://api.web3forms.com/submit" novalidate>
    <!-- Web3Forms: emails submissions to ${SITE.email}. Set the access key in build/site.mjs. -->
    <input type="hidden" name="access_key" value="${SITE.web3formsKey}">
    <input type="hidden" name="subject" value="New Website Enquiry — ${SITE.name}">
    <input type="hidden" name="from_name" value="${SITE.name} Website">
    <div class="form-status" role="status" aria-live="polite"></div>
    <div class="form-grid">
      <div class="field"><label for="${id}-name">Full Name <span class="req">*</span></label><input id="${id}-name" name="name" type="text" autocomplete="name" required><span class="field__err">Please enter your name.</span></div>
      <div class="field"><label for="${id}-phone">Phone Number <span class="req">*</span></label><input id="${id}-phone" name="phone" type="tel" data-type="phone" autocomplete="tel" required><span class="field__err">Please enter a valid phone number.</span></div>
    </div>
    <div class="form-grid">
      <div class="field"><label for="${id}-email">Email Address <span class="req">*</span></label><input id="${id}-email" name="email" type="email" autocomplete="email" required><span class="field__err">Please enter a valid email.</span></div>
      <div class="field"><label for="${id}-loc">Project Location / Postcode</label><input id="${id}-loc" name="location" type="text" autocomplete="postal-code"></div>
    </div>
    <div class="form-grid">
      <div class="field"><label for="${id}-service">Service Required <span class="req">*</span></label><select id="${id}-service" name="service" required><option value="">Please choose…</option>${serviceOpts}</select><span class="field__err">Please choose a service.</span></div>
      <div class="field"><label for="${id}-budget">Project Budget</label><select id="${id}-budget" name="budget"><option value="">Select…</option><option>Under £5,000</option><option>£5,000–£10,000</option><option>£10,000–£25,000</option><option>£25,000–£50,000</option><option>£50,000+</option><option>Not Sure Yet</option></select></div>
    </div>
    <div class="field"><label for="${id}-details">Project Details</label><textarea id="${id}-details" name="details" placeholder="Tell us a little about your project, timescales and anything else that helps us quote accurately."></textarea></div>
    <!-- honeypots (hidden from users; trap bots). company_website = our check, botcheck = Web3Forms' native check -->
    <div class="hp" aria-hidden="true"><label>Company Website<input type="text" name="company_website" tabindex="-1" autocomplete="off"></label></div>
    <label class="hp" aria-hidden="true"><input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></label>
    <input type="hidden" name="page" value="${id === 'contactForm' ? 'Contact page' : 'Request a Quote page'}">
    <div class="field"><label class="checkbox"><input type="checkbox" name="consent" required> <span>I consent to ${SITE.name} contacting me about my enquiry. <span class="req">*</span></span></label><span class="field__err">Please tick the consent box.</span></div>
    <button class="btn btn--primary btn--block" type="submit">Send Quote Request ${ICON.arrow}</button>
    <p style="font-size:.82rem;color:var(--ink-faint);margin-top:1rem;text-align:center">Prefer to talk? <a href="${SITE.telLink}" style="color:var(--copper);font-weight:700">Call us</a> or <a href="${SITE.waLink}" target="_blank" rel="noopener" style="color:var(--copper);font-weight:700">message us on WhatsApp</a>.</p>
  </form>`;
}

function buildQuote() {
  const body = `
${header('quote')}
<main id="main">
  <section class="hero hero--page">
    <div class="hero__media hero__media--page">${picture('assets/images/services/loft-conversions/loft-conversions', 'Request a quote', '', false)}</div>
    <div class="container hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>Request a Quote</nav>
      <span class="eyebrow">Free &amp; no obligation</span>
      <h1>Request a Quote</h1>
      <p class="lead">Tell us about your project and we’ll get back to you with friendly advice and a clear quote.</p>
    </div>
  </section>
  <section class="section bg-stone">
    <div class="container" style="display:grid;grid-template-columns:1.2fr 1fr;gap:clamp(1.5rem,4vw,3.5rem);align-items:start">
      <div class="reveal">${quoteFormHtml('quoteForm')}</div>
      <aside class="reveal">
        <span class="eyebrow">Why request a quote?</span>
        <h2 style="margin:.6rem 0 1.2rem">Clear pricing, no pressure</h2>
        <ul class="feature-list" style="margin-bottom:2rem">
          <li>${ICON.check}<span>Free, no-obligation quotes</span></li>
          <li>${ICON.check}<span>Honest, itemised pricing</span></li>
          <li>${ICON.check}<span>Friendly advice on what adds value</span></li>
          <li>${ICON.check}<span>Coverage across Greater London</span></li>
        </ul>
        <div class="contact-tile" style="margin-bottom:1rem"><div class="icon-badge">${ICON.phone}</div><div><h4>Call us</h4><a href="${SITE.telLink}">Tap to call</a></div></div>
        <div class="contact-tile" style="margin-bottom:1rem"><div class="icon-badge">${ICON.whatsapp}</div><div><h4>WhatsApp</h4><a href="${SITE.waLink}" target="_blank" rel="noopener">Message us instantly</a></div></div>
        <div class="contact-tile"><div class="icon-badge">${ICON.mail}</div><div><h4>Email</h4><a href="${SITE.mailLink}">${SITE.email}</a></div></div>
      </aside>
    </div>
  </section>
</main>
${footer(['assets/js/form-validation.js'])}`;
  write('request-a-quote.html', head({
    title: 'Request a Quote | Vision Touch Ltd | Greater London',
    desc: 'Request a free, no-obligation quote from Vision Touch Ltd for loft conversions, extensions, renovations, roofing and building services across Greater London.',
    path: 'request-a-quote.html', schema: [localBusinessSchema()],
  }) + body);
}

/* ===========================================================================
   CONTACT
   ======================================================================== */
function buildContact() {
  const body = `
${header('contact')}
<main id="main">
  <section class="hero hero--page">
    <div class="hero__media hero__media--page">${picture('assets/images/services/general-building-services/general-building-services', 'Contact Vision Touch Ltd', '', false)}</div>
    <div class="container hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>Contact</nav>
      <span class="eyebrow">Get in touch</span>
      <h1>Contact Vision Touch Ltd</h1>
      <p class="lead">We’d love to hear about your project. Call, WhatsApp, email or send us a message below.</p>
    </div>
  </section>
  <section class="section bg-stone">
    <div class="container">
      <div class="grid grid-4" style="margin-bottom:clamp(2.5rem,5vw,4rem)">
        <a class="contact-tile reveal" href="${SITE.telLink}"><div class="icon-badge">${ICON.phone}</div><div><h4>Call us</h4><p>Tap to call</p></div></a>
        <a class="contact-tile reveal" data-d="1" href="${SITE.waLink}" target="_blank" rel="noopener"><div class="icon-badge">${ICON.whatsapp}</div><div><h4>WhatsApp</h4><p>Message us</p></div></a>
        <a class="contact-tile reveal" data-d="2" href="${SITE.mailLink}"><div class="icon-badge">${ICON.mail}</div><div><h4>Email</h4><p>${SITE.email}</p></div></a>
        <div class="contact-tile reveal" data-d="3"><div class="icon-badge">${ICON.pin}</div><div><h4>Visit / write to us</h4><p>${SITE.address.full}</p></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:clamp(1.5rem,4vw,3.5rem);align-items:start">
        <div class="reveal">
          <span class="eyebrow">Send a message</span>
          <h2 style="margin:.6rem 0 1.4rem">Tell us about your project</h2>
          ${quoteFormHtml('contactForm')}
        </div>
        <aside class="reveal">
          <div class="card" style="background:var(--charcoal);color:var(--on-dark)">
            <h3 style="color:#fff">Our address</h3>
            <ul class="footer-contact" style="margin-top:1rem">
              <li>${ICON.pin}<span>${SITE.address.line1},<br>${SITE.address.line2}, ${SITE.address.city},<br>${SITE.address.postcode}</span></li>
            </ul>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,.12);margin:1.4rem 0">
            <h3 style="color:#fff">Opening hours</h3>
            <ul class="footer-contact" style="margin-top:1rem">
              <li>${ICON.clock}<span>Monday – Friday: 8:00am – 6:00pm</span></li>
              <li>${ICON.clock}<span>Saturday: 9:00am – 4:00pm</span></li>
              <li>${ICON.clock}<span>Sunday: Closed</span></li>
            </ul>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,.12);margin:1.4rem 0">
            <h3 style="color:#fff">Follow us</h3>
            <div class="socials" style="margin-top:1rem">
              <a href="${SITE.facebook}" aria-label="Facebook" target="_blank" rel="noopener">${ICON.facebook}</a>
              <a href="${SITE.instagram}" aria-label="Instagram" target="_blank" rel="noopener">${ICON.instagram}</a>
              <a href="${SITE.waLink}" aria-label="WhatsApp" target="_blank" rel="noopener">${ICON.whatsapp}</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</main>
${footer(['assets/js/form-validation.js'])}`;
  write('contact.html', head({
    title: 'Contact Us | Vision Touch Ltd | Greater London',
    desc: `Contact Vision Touch Ltd — call, WhatsApp or email ${SITE.email} for construction, renovation and building services across Greater London.`,
    path: 'contact.html', schema: [localBusinessSchema()],
  }) + body);
}

/* ===========================================================================
   LEGAL PAGES
   ======================================================================== */
function legalPage(file, title, desc, h1, sectionsHtml) {
  const body = `
${header('')}
<main id="main">
  <section class="hero hero--page" style="min-height:340px">
    <div class="hero__media hero__media--page" style="background:var(--charcoal)"></div>
    <div class="container hero__inner">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>${h1}</nav>
      <h1>${h1}</h1>
    </div>
  </section>
  <section class="section bg-stone">
    <div class="container">
      <div class="prose">${sectionsHtml}</div>
    </div>
  </section>
</main>
${footer()}`;
  write(file, head({ title, desc, path: file, schema: [localBusinessSchema()] }) + body);
}

function buildPrivacy() {
  legalPage('privacy-policy.html',
    'Privacy Policy | Vision Touch Ltd',
    'Privacy Policy for Vision Touch Ltd — how we collect, use and protect your personal information.',
    'Privacy Policy',
    `<h2>1. Who we are</h2><p>${SITE.name} (“we”, “us”, “our”) provides construction and property improvement services across ${SITE.area}. You can contact us at <a href="${SITE.mailLink}">${SITE.email}</a> or via our <a href="contact.html">contact page</a>.</p>
     <h2>2. Information we collect</h2><p>When you contact us or submit an enquiry form, we may collect your name, phone number, email address, project location and any details you provide about your project.</p>
     <h2>3. How we use your information</h2><ul><li>To respond to your enquiry and provide a quote</li><li>To arrange site visits and deliver our services</li><li>To communicate with you about your project</li><li>To meet our legal and regulatory obligations</li></ul>
     <h2>4. Lawful basis</h2><p>We process your data on the basis of your consent and our legitimate interest in responding to enquiries and providing the services you request.</p>
     <h2>5. Sharing your information</h2><p>We do not sell your data. We may share it with trusted suppliers or subcontractors only where necessary to deliver your project, and with authorities where legally required.</p>
     <h2>6. Data retention</h2><p>We keep enquiry and project data only for as long as necessary for the purposes above and to comply with our legal obligations.</p>
     <h2>7. Your rights</h2><p>Under UK GDPR you have the right to access, correct, delete or restrict the use of your personal data, and to withdraw consent at any time. Contact us at <a href="${SITE.mailLink}">${SITE.email}</a>.</p>
     <h2>8. Cookies</h2><p>This website uses minimal cookies. Any analytics or third-party scripts added in future will be disclosed here.</p>
     <h2>9. Contact</h2><p>For any privacy questions, email <a href="${SITE.mailLink}">${SITE.email}</a> or use our <a href="contact.html">contact page</a>.</p>`);
}

function buildTerms() {
  legalPage('terms.html',
    'Terms of Use | Vision Touch Ltd',
    'Terms of Use for the Vision Touch Ltd website.',
    'Terms of Use',
    `<h2>1. About these terms</h2><p>These terms govern your use of the ${SITE.name} website. By using this site you accept these terms.</p>
     <h2>2. Use of the website</h2><p>You may use this website for lawful purposes only. You must not misuse the site, attempt to gain unauthorised access, or use it in any way that could damage or impair it.</p>
     <h2>3. Information accuracy</h2><p>We aim to keep information accurate and up to date, but the content is provided for general information only and does not constitute a contractual offer. Project examples, reviews and imagery may include illustrative or placeholder content.</p>
     <h2>4. Quotes &amp; services</h2><p>Quotes provided are subject to a site visit and final written agreement. Nothing on this website forms a binding contract for works.</p>
     <h2>5. Intellectual property</h2><p>All content, branding and design on this website are owned by or licensed to ${SITE.name} and may not be reproduced without permission.</p>
     <h2>6. Third-party links</h2><p>This website may link to third-party sites (such as social media). We are not responsible for the content or practices of those sites.</p>
     <h2>7. Limitation of liability</h2><p>To the fullest extent permitted by law, we are not liable for any loss arising from use of this website.</p>
     <h2>8. Governing law</h2><p>These terms are governed by the laws of England and Wales.</p>
     <h2>9. Contact</h2><p>Questions about these terms? Email <a href="${SITE.mailLink}">${SITE.email}</a> or use our <a href="contact.html">contact page</a>.</p>`);
}

/* ===========================================================================
   RUN
   ======================================================================== */
console.log('Building Vision Touch Ltd website…');
buildHome();
buildAbout();
buildServices();
SERVICES.forEach((s) => buildService(s.slug));
buildProjects();
buildBeforeAfter();
buildReviews();
buildWhy();
buildQuote();
buildContact();
buildPrivacy();
buildTerms();
console.log('Done.');
