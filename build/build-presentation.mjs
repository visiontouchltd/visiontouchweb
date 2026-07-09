import pptxgen from 'pptxgenjs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import sharp from 'sharp';
import * as Fa from 'react-icons/fa';

const ASSET = 'Z:/claude/vision-touch-website/assets';
const OUT = `${ASSET}/presentation/Vision-Touch-Website-Presentation.pptx`;

/* palette */
const DARK='16130F', DARK2='241F18', STONE='F6F2EB', STONE2='EFE9DF', WHITE='FFFFFF';
const AMBER='F7931E', AMBER_LT='FBB040', COPPER='E2620E', INK='1E1A15', MUTED='6B635A';
const ONDARK='F4EFE7', ONDARKSOFT='B8AE9F', LINE='E4DCCF';
const HEAD='Cambria', BODY='Calibri';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'Auztec Innovations';
pres.company = 'Auztec Innovations';
pres.title = 'Vision Touch Ltd — Website Build & Digital Presence Overview';
const W = 13.333, H = 7.5;

/* icon cache */
const iconCache = {};
async function icon(name, color = '#16130F', size = 256) {
  const key = name + color;
  if (iconCache[key]) return iconCache[key];
  const Comp = Fa[name];
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color, size: String(size) }));
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  const d = 'image/png;base64,' + png.toString('base64');
  iconCache[key] = d; return d;
}
const sh = () => ({ type: 'outer', color: '000000', blur: 9, offset: 3, angle: 90, opacity: 0.16 });
const shCard = () => ({ type: 'outer', color: '6B635A', blur: 10, offset: 3, angle: 90, opacity: 0.22 });

/* footer for content slides */
let pageNo = 0;
async function footer(slide) {
  pageNo++;
  slide.addImage({ path: `${ASSET}/logo/vision-touch-mark.png`, x: 0.5, y: H - 0.62, w: 0.26, h: 0.26 });
  slide.addText('Vision Touch Ltd', { x: 0.8, y: H - 0.66, w: 3, h: 0.33, fontFace: BODY, fontSize: 9, color: MUTED, valign: 'middle' });
  slide.addText([
    { text: 'Prepared by ', options: { color: MUTED } },
    { text: 'Auztec Innovations', options: { color: COPPER, bold: true } },
    { text: `   ·   ${String(pageNo).padStart(2, '0')}`, options: { color: MUTED } },
  ], { x: W - 4.5, y: H - 0.66, w: 4, h: 0.33, fontFace: BODY, fontSize: 9, align: 'right', valign: 'middle' });
}

/* eyebrow + title block for content slides */
function heading(slide, eyebrow, title, opts = {}) {
  const c = opts.dark ? WHITE : INK;
  slide.addText(eyebrow.toUpperCase(), { x: 0.5, y: 0.45, w: 12, h: 0.3, fontFace: BODY, fontSize: 12, bold: true, color: COPPER, charSpacing: 3 });
  slide.addText(title, { x: 0.5, y: 0.74, w: opts.w || 12.3, h: opts.h || 0.9, fontFace: HEAD, fontSize: opts.size || 32, bold: true, color: c });
}

/* card with icon, title, body */
async function iconCard(slide, x, y, w, h, iconName, title, body, opts = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: opts.fill || WHITE }, line: { color: opts.line || LINE, width: 1 }, shadow: shCard() });
  const pad = 0.28, cs = 0.62;
  const iconData = await icon(iconName, '#' + (opts.iconColor || COPPER), 256);
  if (h >= 1.85) {
    // vertical layout: icon on top, title + body stacked below
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + pad, y: y + pad, w: cs, h: cs, rectRadius: 0.1, fill: { color: opts.iconBg || 'FCEBD6' } });
    slide.addImage({ data: iconData, x: x + pad + 0.15, y: y + pad + 0.15, w: cs - 0.3, h: cs - 0.3 });
    slide.addText(title, { x: x + pad, y: y + 1.02, w: w - pad * 2, h: 0.4, fontFace: HEAD, fontSize: opts.titleSize || 15, bold: true, color: opts.titleColor || INK, valign: 'top', margin: 0 });
    slide.addText(body, { x: x + pad, y: y + 1.42, w: w - pad * 2, h: Math.max(0.3, h - 1.6), fontFace: BODY, fontSize: opts.bodySize || 11, color: opts.bodyColor || MUTED, valign: 'top', lineSpacingMultiple: 1.02, margin: 0 });
  } else {
    // horizontal compact layout: icon on the left, text to the right
    const iy = y + (h - cs) / 2;
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + pad, y: iy, w: cs, h: cs, rectRadius: 0.1, fill: { color: opts.iconBg || 'FCEBD6' } });
    slide.addImage({ data: iconData, x: x + pad + 0.15, y: iy + 0.15, w: cs - 0.3, h: cs - 0.3 });
    const tx = x + pad + cs + 0.22, tw = w - pad * 2 - cs - 0.22;
    slide.addText(title, { x: tx, y: y + 0.2, w: tw, h: 0.36, fontFace: HEAD, fontSize: opts.titleSize || 14, bold: true, color: opts.titleColor || INK, valign: 'top', margin: 0 });
    slide.addText(body, { x: tx, y: y + 0.56, w: tw, h: Math.max(0.3, h - 0.74), fontFace: BODY, fontSize: opts.bodySize || 10, color: opts.bodyColor || MUTED, valign: 'top', lineSpacingMultiple: 1.0, margin: 0 });
  }
}

/* ===================== SLIDE 1 — COVER ===================== */
async function cover() {
  const s = pres.addSlide();
  s.background = { color: DARK };
  s.addImage({ path: `${ASSET}/images/services/house-extensions/house-extensions.jpg`, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: DARK, transparency: 22 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 7.4, h: H, fill: { color: DARK, transparency: 12 } });
  // brand lockup
  s.addImage({ path: `${ASSET}/logo/vision-touch-mark.png`, x: 0.85, y: 0.7, w: 0.85, h: 0.85 });
  s.addText('VISION TOUCH LTD', { x: 1.85, y: 0.78, w: 7, h: 0.7, fontFace: HEAD, fontSize: 22, bold: true, color: WHITE, charSpacing: 1, valign: 'middle' });

  s.addText('WEBSITE BUILD & DIGITAL PRESENCE OVERVIEW', { x: 0.9, y: 2.55, w: 9, h: 0.4, fontFace: BODY, fontSize: 13, bold: true, color: AMBER_LT, charSpacing: 3 });
  s.addText('Premium Construction &\nProperty Improvement Website', { x: 0.85, y: 3.0, w: 9.5, h: 1.9, fontFace: HEAD, fontSize: 42, bold: true, color: WHITE, lineSpacingMultiple: 1.0 });
  s.addText('A high-converting, SEO-ready website built to win enquiries across Greater London.', { x: 0.9, y: 4.95, w: 8.6, h: 0.6, fontFace: BODY, fontSize: 15, color: ONDARKSOFT });

  s.addText('PREPARED BY', { x: 0.9, y: 6.18, w: 4, h: 0.3, fontFace: BODY, fontSize: 10, bold: true, color: ONDARKSOFT, charSpacing: 3 });
  s.addImage({ path: `${ASSET}/presentation/auztec-logo.png`, x: 0.88, y: 6.42, w: 1.49, h: 0.86 }); // 1208x696 aspect
}

/* ===================== SLIDE 2 — OBJECTIVE ===================== */
async function objective() {
  const s = pres.addSlide(); s.background = { color: STONE };
  heading(s, 'Project Objective', 'Why Vision Touch Ltd needs this website');
  s.addText('The goal is a premium online presence that turns visitors into enquiries — and positions Vision Touch Ltd to compete with the strongest construction and renovation brands in the capital.',
    { x: 0.5, y: 1.7, w: 7.0, h: 1.4, fontFace: BODY, fontSize: 14.5, color: INK, lineSpacingMultiple: 1.15 });
  const goals = [
    ['FaTrophy', 'Build credibility', 'Look established, trustworthy and premium from the first second.'],
    ['FaBullhorn', 'Generate enquiries', 'Drive calls, WhatsApp messages, emails and quote requests.'],
    ['FaThLarge', 'Showcase services', 'Give every service its own persuasive, SEO-friendly page.'],
    ['FaChartLine', 'Support growth', 'A scalable foundation for long-term business expansion.'],
  ];
  let y = 1.7;
  if (!process.env.NOCARDS) for (let i = 0; i < goals.length; i++) {
    const x = 7.7, cw = 5.1, ch = 1.18;
    await iconCard(s, x, y, cw, ch, goals[i][0], goals[i][1], goals[i][2], { titleSize: 14, bodySize: 10.5 });
    y += ch + 0.18;
  }
  if (!process.env.NOFOOTER) await footer(s);
}

/* ===================== SLIDE 3 — BUSINESS UNDERSTANDING ===================== */
async function business() {
  const s = pres.addSlide(); s.background = { color: WHITE };
  heading(s, 'Business Understanding', 'Who Vision Touch Ltd is — and who we’re reaching');
  s.addImage({ path: `${ASSET}/images/services/carpentry-joinery/carpentry-joinery.jpg`, x: 0.5, y: 1.7, w: 4.7, h: 5.0, sizing: { type: 'cover', w: 4.7, h: 5.0 }, rounding: false });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.7, w: 4.7, h: 5.0, rectRadius: 0.1, fill: { color: 'FFFFFF', transparency: 100 }, line: { color: LINE, width: 1 } });

  s.addText('A UK-based construction and property improvement company delivering high-quality residential and development projects across Greater London.',
    { x: 5.55, y: 1.7, w: 7.3, h: 1.0, fontFace: BODY, fontSize: 14, color: INK, lineSpacingMultiple: 1.12 });

  s.addText('CORE SERVICES', { x: 5.55, y: 2.85, w: 7, h: 0.3, fontFace: BODY, fontSize: 11, bold: true, color: COPPER, charSpacing: 2 });
  const colA = ['Loft Conversions', 'House Extensions', 'Property Renovations', 'Carpentry & Joinery'];
  const colB = ['Kitchens & Bathrooms', 'Structural Work', 'Roofing & Flooring', 'Garage Conversions'];
  const listOpts = (arr) => arr.map((t, i) => ({ text: t, options: { bullet: { code: '2022', indent: 14 }, color: INK, breakLine: true } }));
  s.addText(listOpts(colA), { x: 5.55, y: 3.2, w: 3.6, h: 1.5, fontFace: BODY, fontSize: 12.5, color: INK, paraSpaceAfter: 6, valign: 'top' });
  s.addText(listOpts(colB), { x: 9.25, y: 3.2, w: 3.6, h: 1.5, fontFace: BODY, fontSize: 12.5, color: INK, paraSpaceAfter: 6, valign: 'top' });

  // who we serve
  const who = [['FaHome', 'Homeowners'], ['FaPoundSign', 'Investors'], ['FaLayerGroup', 'Developers'], ['FaHardHat', 'Contractors']];
  let x = 5.55;
  for (const [ic, label] of who) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.85, w: 1.72, h: 1.55, rectRadius: 0.08, fill: { color: STONE }, line: { color: LINE, width: 1 } });
    s.addShape(pres.shapes.OVAL, { x: x + 0.58, y: 5.1, w: 0.56, h: 0.56, fill: { color: 'FCEBD6' } });
    s.addImage({ data: await icon(ic, '#' + COPPER, 256), x: x + 0.7, y: 5.22, w: 0.32, h: 0.32 });
    s.addText(label, { x, y: 5.78, w: 1.72, h: 0.4, align: 'center', fontFace: BODY, fontSize: 11.5, bold: true, color: INK });
    x += 1.86;
  }
  await footer(s);
}

/* ===================== SLIDE 4 — WEBSITE STRUCTURE ===================== */
async function structure() {
  const s = pres.addSlide(); s.background = { color: STONE };
  heading(s, 'Website Structure', 'A complete, conversion-focused site map');
  const groups = [
    ['Core Pages', 'FaRegFileAlt', ['Home', 'About Us', 'Why Choose Us', 'Contact', 'Request a Quote']],
    ['Service Pages', 'FaTools', ['Services Overview', 'Loft Conversions', 'Extensions', 'Renovations', 'Roofing · Flooring', '+ 6 more services']],
    ['Proof & Trust', 'FaStar', ['Projects / Portfolio', 'Before & After', 'Customer Reviews']],
    ['Legal', 'FaShieldAlt', ['Privacy Policy', 'Terms of Use']],
  ];
  const cw = 2.95, gap = 0.18, startX = 0.5, y = 1.75, ch = 4.8;
  for (let i = 0; i < groups.length; i++) {
    const x = startX + i * (cw + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, rectRadius: 0.08, fill: { color: WHITE }, line: { color: LINE, width: 1 }, shadow: shCard() });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.3, y: y + 0.3, w: 0.6, h: 0.6, rectRadius: 0.1, fill: { color: DARK } });
    s.addImage({ data: await icon(groups[i][1], '#' + AMBER, 256), x: x + 0.42, y: y + 0.42, w: 0.36, h: 0.36 });
    s.addText(groups[i][0], { x: x + 0.3, y: y + 1.0, w: cw - 0.6, h: 0.4, fontFace: HEAD, fontSize: 15, bold: true, color: INK });
    s.addText(groups[i][2].map((t, j) => ({ text: t, options: { bullet: { code: '2022', indent: 12 }, breakLine: true, color: MUTED } })),
      { x: x + 0.3, y: y + 1.45, w: cw - 0.55, h: ch - 1.7, fontFace: BODY, fontSize: 11.5, color: MUTED, paraSpaceAfter: 6 });
  }
  s.addText('21 pages in total — including a dedicated, SEO-optimised page for all 11 services.', { x: 0.5, y: 6.7, w: 12, h: 0.3, fontFace: BODY, fontSize: 11.5, italic: true, color: MUTED });
  await footer(s);
}

/* ===================== SLIDE 5 — DESIGN DIRECTION ===================== */
async function design() {
  const s = pres.addSlide(); s.background = { color: WHITE };
  heading(s, 'Premium Design Direction', 'A luxury construction aesthetic');
  const items = [
    ['FaGem', 'Premium & spacious', 'Generous whitespace, large imagery and a confident, high-end feel.'],
    ['FaFont', 'Elegant typography', 'A refined serif for headings paired with a clean modern sans.'],
    ['FaMobileAlt', 'Mobile-first', 'Designed for phones first, where most enquiries come from.'],
    ['FaImage', 'High-quality media', 'Real project photos and video used intelligently, never cluttered.'],
    ['FaMagic', 'Smooth experience', 'Subtle reveals, hover polish and a thoughtful hammer cursor accent.'],
    ['FaPalette', 'Logo-led colour', 'A palette drawn directly from the Vision Touch Ltd brand.'],
  ];
  const cw = 3.95, ch = 1.95, gx = 0.5, gy = 1.75, gapx = 0.2, gapy = 0.2;
  for (let i = 0; i < items.length; i++) {
    const x = gx + (i % 3) * (cw + gapx);
    const y = gy + Math.floor(i / 3) * (ch + gapy);
    await iconCard(s, x, y, cw, ch, items[i][0], items[i][1], items[i][2]);
  }
  s.addText('Built to look high-end enough to compete with the strongest UK renovation, loft and home-improvement competitors.', { x: 0.5, y: 6.05, w: 12.3, h: 0.4, fontFace: BODY, fontSize: 12.5, italic: true, color: COPPER, align: 'center' });
  await footer(s);
}

/* ===================== SLIDE 6 — COLOUR PALETTE ===================== */
async function palette() {
  const s = pres.addSlide(); s.background = { color: STONE };
  heading(s, 'Colour Palette & Branding', 'Colours that signal trust, luxury & craft');
  const swatches = [
    ['16130F', 'Charcoal', 'Luxury base', WHITE],
    ['F6F2EB', 'Warm Stone', 'Background', INK],
    ['F7931E', 'Amber', 'Brand accent', INK],
    ['E2620E', 'Copper', 'Accent / CTA', WHITE],
    ['FFFFFF', 'White', 'Clean cards', INK],
    ['1E1A15', 'Ink', 'Body text', WHITE],
  ];
  const cw = 1.95, gap = 0.16, startX = 0.5, y = 1.8, ch = 2.7;
  for (let i = 0; i < swatches.length; i++) {
    const x = startX + i * (cw + gap);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, rectRadius: 0.08, fill: { color: swatches[i][0] }, line: { color: LINE, width: 1 }, shadow: shCard() });
    s.addText('#' + swatches[i][0], { x: x + 0.15, y: y + ch - 1.15, w: cw - 0.3, h: 0.3, fontFace: BODY, fontSize: 10, bold: true, color: swatches[i][3] });
    s.addText(swatches[i][1], { x: x + 0.15, y: y + ch - 0.85, w: cw - 0.3, h: 0.35, fontFace: HEAD, fontSize: 13, bold: true, color: swatches[i][3] });
    s.addText(swatches[i][2], { x: x + 0.15, y: y + ch - 0.5, w: cw - 0.3, h: 0.3, fontFace: BODY, fontSize: 9.5, color: swatches[i][3] });
  }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 4.85, w: 12.33, h: 1.55, rectRadius: 0.08, fill: { color: WHITE }, line: { color: LINE, width: 1 } });
  s.addText('Why this palette?', { x: 0.8, y: 5.05, w: 11.7, h: 0.35, fontFace: HEAD, fontSize: 14, bold: true, color: INK });
  s.addText('Deep charcoal communicates premium quality and stability; the warm amber-to-copper accent — taken straight from the Vision Touch logo — adds energy, craftsmanship and warmth. The stone background keeps everything calm, spacious and easy to read.',
    { x: 0.8, y: 5.4, w: 11.7, h: 0.9, fontFace: BODY, fontSize: 12.5, color: MUTED, lineSpacingMultiple: 1.1 });
  await footer(s);
}

/* ===================== SLIDE 7 — HOMEPAGE FEATURES ===================== */
async function homepage() {
  const s = pres.addSlide(); s.background = { color: WHITE };
  heading(s, 'Homepage Features', 'Engineered to convert visitors into enquiries');
  s.addImage({ path: `${ASSET}/images/home/interior.jpg`, x: 0.5, y: 1.75, w: 5.5, h: 4.9, sizing: { type: 'cover', w: 5.5, h: 4.9 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.55, w: 5.5, h: 1.1, fill: { color: DARK, transparency: 15 } });
  s.addText('Full-width video hero with strong headline & triple CTA', { x: 0.7, y: 5.62, w: 5.1, h: 0.95, fontFace: BODY, fontSize: 12.5, bold: true, color: WHITE, valign: 'middle' });

  const feats = [
    ['FaPlayCircle', 'Video hero', 'Premium background video with animated headline.'],
    ['FaThLarge', 'Service cards', 'Eight services, each linking to its own page.'],
    ['FaProjectDiagram', 'Process & trust', 'Clear 5-step process and trust indicators.'],
    ['FaImages', 'Before / after', 'Interactive sliders and a project preview.'],
    ['FaQuoteRight', 'Reviews carousel', 'Social proof that builds confidence.'],
    ['FaWhatsapp', 'Always-on contact', 'Floating WhatsApp, click-to-call & quote CTA.'],
  ];
  const cw = 3.35, ch = 1.5, gx = 6.2, gy = 1.75, gapx = 0.18, gapy = 0.18;
  for (let i = 0; i < feats.length; i++) {
    const x = gx + (i % 2) * (cw + gapx);
    const y = gy + Math.floor(i / 2) * (ch + gapy);
    await iconCard(s, x, y, cw, ch, feats[i][0], feats[i][1], feats[i][2], { titleSize: 13, bodySize: 10 });
  }
  await footer(s);
}

/* ===================== SLIDE 8 — SERVICES SYSTEM ===================== */
async function servicesSystem() {
  const s = pres.addSlide(); s.background = { color: STONE };
  heading(s, 'Services System', 'Every service gets its own selling page');
  s.addText('Instead of one cramped list, each of the 11 services has a dedicated page — better for customers and far better for Google.',
    { x: 0.5, y: 1.65, w: 12.3, h: 0.7, fontFace: BODY, fontSize: 14, color: INK });
  const items = [
    ['FaImage', 'Premium hero', 'A strong, image-led introduction to the service.'],
    ['FaAlignLeft', 'Persuasive copy', 'Benefits for homeowners and investors, zig-zag layout.'],
    ['FaListOl', 'Clear process', 'A consistent, reassuring step-by-step delivery process.'],
    ['FaQuestionCircle', 'FAQs', 'Answers common questions — and feeds FAQ rich results.'],
    ['FaLink', 'Internal linking', 'Cross-links keep visitors exploring and help SEO.'],
    ['FaPaperPlane', 'Targeted CTA', 'Service-specific quote prompts at every scroll depth.'],
  ];
  const cw = 3.95, ch = 1.78, gx = 0.5, gy = 2.5, gapx = 0.2, gapy = 0.18;
  for (let i = 0; i < items.length; i++) {
    const x = gx + (i % 3) * (cw + gapx);
    const y = gy + Math.floor(i / 3) * (ch + gapy);
    await iconCard(s, x, y, cw, ch, items[i][0], items[i][1], items[i][2], { bodySize: 10.5 });
  }
  await footer(s);
}

/* ===================== SLIDE 9 — ENQUIRY & QUOTE SYSTEM ===================== */
async function enquiry() {
  const s = pres.addSlide(); s.background = { color: WHITE };
  heading(s, 'Enquiry & Quote System', 'Make it effortless to get in touch');
  const left = [
    ['FaWpforms', 'Smart quote form', 'Name, contact, location, service, budget & details — with validation.'],
    ['FaEnvelopeOpenText', 'Routed to inbox', 'Enquiries delivered to inquiries@visiontouchltd.co.uk.'],
    ['FaServer', 'Shared-host ready', 'PHP mail handler, with an automatic mailto fallback.'],
    ['FaShieldAlt', 'Spam protected', 'Hidden honeypot field plus full client & server validation.'],
  ];
  let y = 1.8;
  for (const [ic, t, b] of left) { await iconCard(s, 0.5, y, 6.0, 1.15, ic, t, b, { titleSize: 14, bodySize: 11 }); y += 1.32; }

  // right: contact channels panel
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.85, y: 1.8, w: 5.98, h: 4.75, rectRadius: 0.1, fill: { color: DARK }, shadow: shCard() });
  s.addText('Four ways to get a quote', { x: 7.15, y: 2.05, w: 5.4, h: 0.5, fontFace: HEAD, fontSize: 18, bold: true, color: WHITE });
  const ch = [
    ['FaPhoneAlt', 'Click-to-call', '07572 222245'],
    ['FaWhatsapp', 'WhatsApp', 'Pre-filled message via wa.me link'],
    ['FaEnvelope', 'Email', 'inquiries@visiontouchltd.co.uk'],
    ['FaWpforms', 'Quote form', 'On every page via clear CTAs'],
  ];
  let cy = 2.75;
  for (const [ic, t, v] of ch) {
    s.addShape(pres.shapes.OVAL, { x: 7.15, y: cy, w: 0.66, h: 0.66, fill: { color: AMBER } });
    s.addImage({ data: await icon(ic, '#' + DARK, 256), x: 7.29, y: cy + 0.14, w: 0.38, h: 0.38 });
    s.addText(t, { x: 7.95, y: cy - 0.02, w: 4.7, h: 0.38, fontFace: BODY, fontSize: 13.5, bold: true, color: WHITE, valign: 'middle' });
    s.addText(v, { x: 7.95, y: cy + 0.33, w: 4.7, h: 0.34, fontFace: BODY, fontSize: 11, color: ONDARKSOFT, valign: 'middle' });
    cy += 0.95;
  }
  await footer(s);
}

/* ===================== SLIDE 10 — CONVERSION STRATEGY ===================== */
async function conversion() {
  const s = pres.addSlide(); s.background = { color: STONE };
  heading(s, 'Conversion Strategy', 'Reducing friction at every step');
  const items = [
    ['FaBullseye', 'CTAs everywhere', 'Quote prompts repeated down every page, never pushy.'],
    ['FaRoute', 'Clear journeys', 'Obvious paths from problem → service → enquiry.'],
    ['FaMobileAlt', 'Mobile actions', 'Tap-to-call and WhatsApp built for thumbs.'],
    ['FaStar', 'Trust signals', 'Reviews, process and credentials reduce hesitation.'],
    ['FaImages', 'Visual proof', 'Portfolio and before/after make quality tangible.'],
    ['FaFeatherAlt', 'Low friction', 'Short forms and instant contact options.'],
  ];
  const cw = 3.95, ch = 1.95, gx = 0.5, gy = 1.8, gapx = 0.2, gapy = 0.2;
  for (let i = 0; i < items.length; i++) {
    const x = gx + (i % 3) * (cw + gapx);
    const y = gy + Math.floor(i / 3) * (ch + gapy);
    await iconCard(s, x, y, cw, ch, items[i][0], items[i][1], items[i][2]);
  }
  await footer(s);
}

/* ===================== SLIDE 11 — SEO FOUNDATION ===================== */
async function seo() {
  const s = pres.addSlide(); s.background = { color: WHITE };
  heading(s, 'SEO Foundation', 'Built to be found across Greater London');
  const items = [
    ['FaHeading', 'On-page SEO', 'Unique titles, meta descriptions & clean heading structure.'],
    ['FaMapMarkedAlt', 'Local targeting', 'Greater London & borough-level keyword themes, written naturally.'],
    ['FaCode', 'Schema markup', 'LocalBusiness, Service, FAQ, Breadcrumb & Review structured data.'],
    ['FaSitemap', 'Sitemap & robots', 'sitemap.xml and robots.txt included and ready to submit.'],
    ['FaLink', 'Internal linking', 'Services, projects and pages interlinked for discovery.'],
    ['FaImage', 'Image alt text', 'Descriptive alt attributes on imagery throughout.'],
  ];
  const cw = 3.95, ch = 1.95, gx = 0.5, gy = 1.75, gapx = 0.2, gapy = 0.2;
  for (let i = 0; i < items.length; i++) {
    const x = gx + (i % 3) * (cw + gapx);
    const y = gy + Math.floor(i / 3) * (ch + gapy);
    await iconCard(s, x, y, cw, ch, items[i][0], items[i][1], items[i][2]);
  }
  s.addText('Keyword themes are woven in naturally — no stuffing — so the site reads well for people and search engines alike.', { x: 0.5, y: 6.05, w: 12.3, h: 0.4, fontFace: BODY, fontSize: 12.5, italic: true, color: COPPER, align: 'center' });
  await footer(s);
}

/* ===================== SLIDE 12 — PERFORMANCE ===================== */
async function performance() {
  const s = pres.addSlide(); s.background = { color: DARK };
  heading(s, 'Performance Optimisation', 'Fast, light and shared-hosting friendly', { dark: true });
  // big stat callouts
  const stats = [
    ['480MB', '→ 15MB', 'Video payload, compressed'],
    ['WebP', '+ JPG', 'Modern images, full fallback'],
    ['~29MB', 'total', 'Whole site, all media in'],
    ['0', 'frameworks', 'Pure HTML / CSS / JS'],
  ];
  let x = 0.5;
  for (const [big, small, label] of stats) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: 2.96, h: 2.0, rectRadius: 0.1, fill: { color: DARK2 }, line: { color: '3A332A', width: 1 } });
    s.addText(big, { x: x + 0.2, y: 2.1, w: 2.56, h: 0.85, fontFace: HEAD, fontSize: 38, bold: true, color: AMBER, align: 'center' });
    s.addText(small, { x: x + 0.2, y: 2.95, w: 2.56, h: 0.4, fontFace: BODY, fontSize: 14, bold: true, color: WHITE, align: 'center' });
    s.addText(label, { x: x + 0.2, y: 3.35, w: 2.56, h: 0.4, fontFace: BODY, fontSize: 10.5, color: ONDARKSOFT, align: 'center' });
    x += 3.13;
  }
  const opts = ['Compressed images & WebP', 'Lazy loading below the fold', 'Deferred, non-blocking JavaScript', 'Optimised video with poster frames', 'CSS-based transitions, minimal JS', 'GZIP, caching & security via .htaccess'];
  s.addText(opts.map((t) => ({ text: t, options: { bullet: { code: '2022', indent: 14 }, breakLine: true, color: ONDARK } })),
    { x: 0.6, y: 4.2, w: 12, h: 2.0, fontFace: BODY, fontSize: 13.5, color: ONDARK, paraSpaceAfter: 7 });
  // two columns of bullets
  await footer(s);
}

/* ===================== SLIDE 13 — MOBILE EXPERIENCE ===================== */
async function mobile() {
  const s = pres.addSlide(); s.background = { color: STONE };
  heading(s, 'Mobile Experience', 'Most enquiries happen on a phone');
  s.addImage({ path: `${ASSET}/images/services/kitchen-installation/kitchen-installation.jpg`, x: 0.5, y: 1.8, w: 4.6, h: 4.7, sizing: { type: 'cover', w: 4.6, h: 4.7 } });
  const items = [
    ['FaMobileAlt', 'Responsive layouts', 'Every page reflows cleanly to any screen size.'],
    ['FaBars', 'Mobile navigation', 'A full-screen menu with large, easy tap targets.'],
    ['FaHandPointer', 'Touch-friendly', 'Generous buttons sized for thumbs.'],
    ['FaWhatsapp', 'Floating WhatsApp', 'One-tap chat always within reach.'],
    ['FaPhoneAlt', 'Click-to-call', 'Instant calling from anywhere on the site.'],
    ['FaBolt', 'Fast loading', 'Lightweight assets for quick mobile loads.'],
  ];
  let y = 1.8;
  for (let i = 0; i < items.length; i++) {
    if (i === 3) y = 1.8;
    const x = i < 3 ? 5.4 : 9.15;
    if (i < 3) y = 1.8 + i * 1.62; else y = 1.8 + (i - 3) * 1.62;
    await iconCard(s, x, y, 3.6, 1.45, items[i][0], items[i][1], items[i][2], { titleSize: 13, bodySize: 10 });
  }
  await footer(s);
}

/* ===================== SLIDE 14 — TRUST & CREDIBILITY ===================== */
async function trust() {
  const s = pres.addSlide(); s.background = { color: WHITE };
  heading(s, 'Trust & Credibility', 'Earning confidence before the first call');
  const items = [
    ['FaQuoteRight', 'Customer reviews', 'A 5-star carousel and a dedicated reviews page.'],
    ['FaCertificate', 'Credentials', 'Certified carpentry and UK-based, reliable workmanship.'],
    ['FaListOl', 'Clear process', 'A transparent 5-step journey from quote to handover.'],
    ['FaImages', 'Project portfolio', 'Realistic London project examples by service & area.'],
    ['FaExchangeAlt', 'Before & after', 'Interactive sliders that prove the transformation.'],
    ['FaAddressCard', 'Visible contact', 'Phone, WhatsApp and email never more than a tap away.'],
  ];
  const cw = 3.95, ch = 1.95, gx = 0.5, gy = 1.75, gapx = 0.2, gapy = 0.2;
  for (let i = 0; i < items.length; i++) {
    const x = gx + (i % 3) * (cw + gapx);
    const y = gy + Math.floor(i / 3) * (ch + gapy);
    await iconCard(s, x, y, cw, ch, items[i][0], items[i][1], items[i][2]);
  }
  await footer(s);
}

/* ===================== SLIDE 15 — WHAT WAS BUILT ===================== */
async function whatBuilt() {
  const s = pres.addSlide(); s.background = { color: STONE };
  heading(s, 'What Was Built', 'A complete, launch-ready package');
  const col1 = ['21 fully designed pages', '11 dedicated service pages', 'Quote & contact system', 'WhatsApp integration', 'Reviews carousel', 'Projects / portfolio'];
  const col2 = ['Before & after gallery', 'Full SEO setup & schema', 'Performance optimisation', 'Sitemap & robots.txt', 'README documentation', 'This client presentation'];
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.8, w: 6.05, h: 4.5, rectRadius: 0.1, fill: { color: WHITE }, line: { color: LINE, width: 1 }, shadow: shCard() });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.78, y: 1.8, w: 6.05, h: 4.5, rectRadius: 0.1, fill: { color: WHITE }, line: { color: LINE, width: 1 }, shadow: shCard() });
  const check = await icon('FaCheckCircle', '#' + COPPER, 256);
  async function fill(list, bx) {
    let y = 2.15;
    for (const t of list) {
      s.addImage({ data: check, x: bx, y: y + 0.04, w: 0.32, h: 0.32 });
      s.addText(t, { x: bx + 0.45, y, w: 5.0, h: 0.45, fontFace: BODY, fontSize: 14, color: INK, valign: 'middle' });
      y += 0.68;
    }
  }
  await fill(col1, 0.85);
  await fill(col2, 7.13);
  await footer(s);
}

/* ===================== SLIDE 16 — WHY PREMIUM ===================== */
async function whyPremium() {
  const s = pres.addSlide(); s.background = { color: WHITE };
  heading(s, 'Why This Is a Premium Build', 'Not a template — a competitive asset');
  const items = [
    ['FaFingerprint', 'Custom, not template', 'Designed from scratch around the Vision Touch brand.'],
    ['FaSitemap', 'Service architecture', 'A scalable structure that grows with the business.'],
    ['FaBullseye', 'Conversion-focused', 'Every layout choice points toward an enquiry.'],
    ['FaSearch', 'SEO-ready pages', 'Structured to rank for Greater London searches.'],
    ['FaServer', 'Shared-host friendly', 'Fast and cheap to host; easy to maintain.'],
    ['FaArrowsAlt', 'Built to scale', 'Simple to add projects, reviews and services later.'],
  ];
  const cw = 3.95, ch = 1.95, gx = 0.5, gy = 1.75, gapx = 0.2, gapy = 0.2;
  for (let i = 0; i < items.length; i++) {
    const x = gx + (i % 3) * (cw + gapx);
    const y = gy + Math.floor(i / 3) * (ch + gapy);
    await iconCard(s, x, y, cw, ch, items[i][0], items[i][1], items[i][2]);
  }
  await footer(s);
}

/* ===================== SLIDE 17 — CONTENT REQUIRED ===================== */
async function contentReq() {
  const s = pres.addSlide(); s.background = { color: STONE };
  heading(s, 'Content Still Required', 'What we need from you to go live');
  const col1 = ['Final approved logo files (if different)', 'Real project photos & details', 'Real before/after images', 'Genuine customer reviews', 'Certification proof & details', 'Final Facebook & Instagram URLs'];
  const col2 = ['Company registration / VAT (if shown)', 'Full service-area list (if wider)', 'Any warranty / guarantee wording', 'Final privacy & legal wording', 'Hosting (cPanel) & domain access', 'Preferred enquiry-handling process'];
  s.addText('The website is complete and uses polished placeholder content. To launch, we’ll swap in the following:', { x: 0.5, y: 1.62, w: 12.3, h: 0.5, fontFace: BODY, fontSize: 13.5, color: INK });
  const dot = await icon('FaRegDotCircle', '#' + COPPER, 256);
  function fill(list, bx) {
    let y = 2.5;
    for (const t of list) {
      s.addImage({ data: dot, x: bx, y: y + 0.05, w: 0.28, h: 0.28 });
      s.addText(t, { x: bx + 0.42, y, w: 5.6, h: 0.42, fontFace: BODY, fontSize: 13, color: INK, valign: 'middle' });
      y += 0.62;
    }
  }
  fill(col1, 0.7);
  fill(col2, 6.95);
  await footer(s);
}

/* ===================== SLIDE 18 — NEXT STEPS ===================== */
async function nextSteps() {
  const s = pres.addSlide(); s.background = { color: WHITE };
  heading(s, 'Recommended Next Steps', 'A clear path to launch');
  const steps = [
    ['Review', 'Client reviews the website demo'],
    ['Replace', 'Swap in real images, projects & reviews'],
    ['Confirm', 'Provide final social media links'],
    ['Configure', 'Set up hosting & connect the domain'],
    ['Test', 'Verify quote-form email delivery'],
    ['Check', 'Final SEO & cross-device checks'],
    ['Launch', 'Go live with Vision Touch Ltd'],
    ['Submit', 'Submit sitemap to Search Console'],
  ];
  const cw = 2.95, ch = 1.95, gapx = 0.2, gapy = 0.25, gx = 0.5, gy = 1.85;
  for (let i = 0; i < steps.length; i++) {
    const x = gx + (i % 4) * (cw + gapx);
    const y = gy + Math.floor(i / 4) * (ch + gapy);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, rectRadius: 0.08, fill: { color: STONE }, line: { color: LINE, width: 1 }, shadow: shCard() });
    s.addShape(pres.shapes.OVAL, { x: x + 0.28, y: y + 0.28, w: 0.7, h: 0.7, fill: { color: DARK } });
    s.addText(String(i + 1), { x: x + 0.28, y: y + 0.28, w: 0.7, h: 0.7, align: 'center', valign: 'middle', fontFace: HEAD, fontSize: 22, bold: true, color: AMBER });
    s.addText(steps[i][0], { x: x + 0.28, y: y + 1.08, w: cw - 0.5, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: INK });
    s.addText(steps[i][1], { x: x + 0.28, y: y + 1.45, w: cw - 0.5, h: 0.45, fontFace: BODY, fontSize: 10.5, color: MUTED });
  }
  await footer(s);
}

/* ===================== SLIDE 19 — MAINTENANCE ===================== */
async function maintenance() {
  const s = pres.addSlide(); s.background = { color: STONE };
  heading(s, 'Maintenance Recommendation', 'Keeping the site healthy after launch');
  const items = [
    ['FaShieldAlt', 'Security checks', 'Regular updates and basic security monitoring.'],
    ['FaPenFancy', 'Content updates', 'Keep services and copy current as the business evolves.'],
    ['FaImages', 'Portfolio uploads', 'Add new projects and reviews to stay fresh & rank.'],
    ['FaWpforms', 'Form testing', 'Periodically confirm enquiries are being delivered.'],
    ['FaChartLine', 'SEO monitoring', 'Track rankings and traffic in Search Console.'],
    ['FaDatabase', 'Backups', 'Keep regular backups for peace of mind.'],
  ];
  const cw = 3.95, ch = 1.95, gx = 0.5, gy = 1.8, gapx = 0.2, gapy = 0.2;
  for (let i = 0; i < items.length; i++) {
    const x = gx + (i % 3) * (cw + gapx);
    const y = gy + Math.floor(i / 3) * (ch + gapy);
    await iconCard(s, x, y, cw, ch, items[i][0], items[i][1], items[i][2]);
  }
  await footer(s);
}

/* ===================== SLIDE 20 — CLOSING ===================== */
async function closing() {
  const s = pres.addSlide(); s.background = { color: DARK };
  s.addImage({ path: `${ASSET}/images/services/property-renovations/property-renovations.jpg`, x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: H, fill: { color: DARK, transparency: 22 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 2.3, w: W, h: 2.9, fill: { color: DARK, transparency: 25 } });
  s.addText('READY FOR REVIEW', { x: 0, y: 2.55, w: W, h: 0.45, align: 'center', fontFace: BODY, fontSize: 14, bold: true, color: AMBER_LT, charSpacing: 4 });
  s.addText('Let’s bring Vision Touch Ltd online.', { x: 0.5, y: 3.0, w: 12.3, h: 1.0, align: 'center', fontFace: HEAD, fontSize: 38, bold: true, color: WHITE });
  s.addText('Thank you for reviewing the build. We’re ready to finalise content and launch whenever you are.', { x: 1.5, y: 4.1, w: 10.3, h: 0.6, align: 'center', fontFace: BODY, fontSize: 15, color: ONDARK });

  s.addImage({ path: `${ASSET}/logo/vision-touch-mark.png`, x: 5.35, y: 5.15, w: 0.6, h: 0.6 });
  s.addText('Vision Touch Ltd', { x: 6.05, y: 5.18, w: 3, h: 0.55, fontFace: HEAD, fontSize: 19, bold: true, color: WHITE, valign: 'middle' });
  s.addText([
    { text: 'inquiries@visiontouchltd.co.uk', options: { color: ONDARK } },
    { text: '   ·   Greater London', options: { color: ONDARKSOFT } },
  ], { x: 0.5, y: 5.95, w: 12.3, h: 0.4, align: 'center', fontFace: BODY, fontSize: 13 });
  s.addText('PREPARED BY', { x: 0.5, y: 6.28, w: 12.3, h: 0.28, align: 'center', fontFace: BODY, fontSize: 10, bold: true, color: ONDARKSOFT, charSpacing: 3 });
  s.addImage({ path: `${ASSET}/presentation/auztec-logo.png`, x: (W - 1.35) / 2, y: 6.55, w: 1.35, h: 0.78 }); // 1208x696 aspect
}

/* speaker notes helper added inline */
async function run() {
  const all = [cover, objective, business, structure, design, palette, homepage, servicesSystem, enquiry, conversion, seo, performance, mobile, trust, whatBuilt, whyPremium, contentReq, nextSteps, maintenance, closing];
  const only = process.env.SLICE; // e.g. "0-9" or "10-19"
  let list = all, out = OUT;
  if (only) { const [a, b] = only.split('-').map(Number); list = all.slice(a, b + 1); out = OUT.replace('.pptx', `-${only}.pptx`); }
  for (const fn of list) await fn();
  await pres.writeFile({ fileName: out });
  console.log('WROTE', out);
}
run().catch((e) => { console.error(e); process.exit(1); });
