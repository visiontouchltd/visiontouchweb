/* ============================================================================
   Vision Touch Ltd — site content (bespoke copy).
   NOTE: Reviews and projects below are realistic PLACEHOLDER demo content,
   to be replaced with the client's real customer reviews and project photos
   before launch (documented in README).
   ========================================================================== */

const IMG = 'assets/images/services';
const VID = 'assets/videos';

/* Default 5-step delivery process (used where a service doesn't override) */
export const PROCESS = [
  { t: 'Consultation', d: 'We listen to your goals, budget and timescales — by phone, WhatsApp or in person.' },
  { t: 'Site Visit & Review', d: 'We assess the property, take measurements and discuss what’s practical and what adds value.' },
  { t: 'Quote & Planning', d: 'A clear, itemised quote plus guidance on drawings, building control and approvals where needed.' },
  { t: 'Build & Delivery', d: 'Skilled trades, tidy sites and regular updates keep your project moving and on schedule.' },
  { t: 'Finish & Handover', d: 'Final inspection, snagging and a clean handover — with aftercare you can rely on.' },
];

export const WHY_POINTS = [
  { icon: 'ruler', t: 'Practical Building Solutions', d: 'We focus on what genuinely works for your property and your budget — not upselling.' },
  { icon: 'shield', t: 'Reliable Workmanship', d: 'Dependable trades who turn up, communicate and deliver to a standard we’re proud of.' },
  { icon: 'sparkle', t: 'Premium Finishes', d: 'A meticulous eye for detail on every joint, line and surface — finishes that last.' },
  { icon: 'users', t: 'Clear Communication', d: 'Honest timelines, transparent pricing and a single point of contact throughout.' },
  { icon: 'pound', t: 'Property Value Focus', d: 'Every project is planned to improve functionality and increase your property’s value.' },
  { icon: 'pin', t: 'Greater London Experience', d: 'Local knowledge of London properties, boroughs, terraces and period homes.' },
];

/* ---- Services: bespoke content ---- */
export const SERVICE_CONTENT = {
  'loft-conversions': {
    label: 'Loft Conversions', icon: 'loft',
    hero: `${IMG}/loft-conversions/loft-conversions`,
    short: 'Turn unused roof space into a beautiful bedroom, office or suite — adding space and value.',
    metaTitle: 'Loft Conversions Greater London | Vision Touch Ltd',
    metaDesc: 'Premium loft conversions across Greater London — dormer, hip-to-gable, Velux and L-shaped. Add a bedroom, office or suite and increase your property value. Free quotes.',
    keywords: 'loft conversions Greater London, dormer loft conversion London, loft conversion company',
    intro: 'A loft conversion is one of the smartest ways to add a room — and significant value — without losing a single inch of garden. Vision Touch Ltd designs and builds dormer, hip-to-gable, Velux and L-shaped conversions across Greater London, turning dusty roof space into light-filled bedrooms, home offices and en-suite retreats.',
    why: 'In London, space is the most valuable thing a home can have. A well-built loft conversion can add a double bedroom and bathroom while improving how the whole house flows — typically delivering one of the strongest returns on investment of any home improvement.',
    features: [
      { t: 'Designed around how you live', d: 'We plan the staircase, head-height, storage and light to make the new floor feel like it was always there.',
        list: ['Dormer, hip-to-gable, Velux & L-shaped', 'Optimised head-height & staircase placement', 'En-suite and built-in storage options'],
        img: `${IMG}/loft-conversions/loft-conversions-2`, video: `${VID}/loft-conversions.mp4`, poster: `${IMG}/loft-conversions/loft-conversions-video-poster` },
      { t: 'Built right, signed off properly', d: 'Structural calculations, insulation, fire safety and building control sign-off are all handled for you.',
        list: ['Structural steels & sound insulation', 'Building Regulations compliance', 'Party Wall guidance where required'],
        img: `${IMG}/loft-conversions/loft-conversions-3`, rev: true },
    ],
    benefits: [
      { t: 'Add a bedroom & bathroom', d: 'Gain genuine living space without extending the footprint.' },
      { t: 'Strong return on investment', d: 'One of the most value-adding improvements for London homes.' },
      { t: 'Natural light & head-height', d: 'Roof windows and dormers designed for brightness and space.' },
      { t: 'Minimal disruption', d: 'Much of the work happens above your living space.' },
    ],
    faqs: [
      { q: 'Do I need planning permission for a loft conversion?', a: 'Many loft conversions fall under Permitted Development, but dormers, conservation areas and flats often require planning permission. We advise on exactly what your project needs at the quote stage.' },
      { q: 'How long does a loft conversion take?', a: 'Most conversions take around 6–10 weeks on site depending on type and complexity. We give you a clear programme before work begins.' },
      { q: 'Will a loft conversion add value to my home?', a: 'Yes — adding a bedroom and bathroom in the loft is consistently one of the highest-return home improvements in Greater London.' },
      { q: 'Can you build an en-suite in the loft?', a: 'Absolutely. We regularly add en-suites and integrate the plumbing, ventilation and drainage as part of the build.' },
    ],
  },

  'house-extensions': {
    label: 'House Extensions', icon: 'extension',
    hero: `${IMG}/house-extensions/house-extensions`,
    short: 'Single, double-storey, side-return and wrap-around extensions that transform how you live.',
    metaTitle: 'House Extensions London | Single & Double Storey | Vision Touch Ltd',
    metaDesc: 'House extensions across Greater London — rear, side-return, wrap-around and double-storey. Create open-plan kitchens and extra bedrooms that add lasting value. Free quotes.',
    keywords: 'house extensions London, single storey extension London, side return extension, double storey extension',
    intro: 'A well-designed extension can completely change how your home works — opening up a bright kitchen-diner, adding a downstairs WC, or creating an extra bedroom above. Vision Touch Ltd builds rear, side-return, wrap-around and double-storey extensions across Greater London, from foundations to the final coat of paint.',
    why: 'Moving home in London is expensive and stressful. Extending lets you stay in the area you love while gaining exactly the space your family needs — and a thoughtfully built extension reliably increases the value and saleability of your property.',
    features: [
      { t: 'Open up the way you live', d: 'Knock-throughs, bi-fold doors and rooflights create the bright, sociable, open-plan space modern families want.',
        list: ['Rear, side-return & wrap-around', 'Open-plan kitchen-diners', 'Bi-fold & sliding doors, rooflights'],
        img: `${IMG}/house-extensions/house-extensions`, video: `${VID}/house-extensions.mp4`, poster: `${IMG}/house-extensions/house-extensions-video-poster` },
      { t: 'Engineered to last', d: 'Proper foundations, steelwork and weatherproofing mean your extension performs as well as it looks.',
        list: ['Foundations & structural steel', 'Insulation & energy efficiency', 'Building control & warranties'],
        img: `${IMG}/structural-work/structural-work`, rev: true },
    ],
    benefits: [
      { t: 'More usable living space', d: 'Tailored to your family, not a one-size template.' },
      { t: 'Avoid the cost of moving', d: 'Stay in your area and invest in your own home.' },
      { t: 'Increase property value', d: 'Quality extensions add saleable square footage.' },
      { t: 'Energy-efficient build', d: 'Modern insulation and glazing keep running costs down.' },
    ],
    faqs: [
      { q: 'How much does a house extension cost?', a: 'Cost depends on size, specification and ground conditions. We provide a clear, itemised quote after a site visit so you know exactly what’s included.' },
      { q: 'Do I need planning permission to extend?', a: 'Smaller single-storey extensions often fall under Permitted Development, while larger or double-storey projects usually need planning. We guide you through the right route.' },
      { q: 'Can we stay in the house during the build?', a: 'In most cases yes. We plan the works to keep disruption to a minimum and keep the site safe and tidy.' },
      { q: 'How long does an extension take?', a: 'A typical single-storey extension takes around 10–16 weeks. We agree a programme with you up front.' },
    ],
  },

  'property-renovations': {
    label: 'Property Renovations', icon: 'reno',
    hero: `${IMG}/property-renovations/property-renovations`,
    short: 'Full and partial refurbishments that modernise tired properties and maximise their value.',
    metaTitle: 'Property Renovations London | Full Refurbishment | Vision Touch Ltd',
    metaDesc: 'Property renovation and refurbishment across Greater London — full house refurbs, buy-to-let upgrades and modernisation for homeowners, investors and developers. Free quotes.',
    keywords: 'property renovations London, house refurbishment London, home renovation company London, buy to let refurbishment',
    intro: 'Whether it’s a tired family home, a buy-to-let in need of modernising, or a full developer refurbishment, Vision Touch Ltd renovates properties across Greater London end to end — managing every trade so you deal with one reliable team from start to finish.',
    why: 'A considered renovation transforms how a property feels and performs, and it’s a proven way for homeowners and investors to unlock value. We balance budget, finish and return so every pound spent works hard for you.',
    features: [
      { t: 'One team, every trade', d: 'Plastering, electrics, plumbing, joinery, tiling and decorating — coordinated under one roof so nothing falls through the gaps.',
        list: ['Full & partial refurbishments', 'Buy-to-let & HMO upgrades', 'Project-managed from start to finish'],
        img: `${IMG}/property-renovations/property-renovations-2`, video: `${VID}/property-renovations.mp4`, poster: `${IMG}/property-renovations/property-renovations-video-poster` },
      { t: 'Finishes that sell & let', d: 'We specify hard-wearing, attractive materials that look premium and stand up to real-world use.',
        list: ['Modern, durable specifications', 'Value-led design choices', 'Clean, tidy, well-managed sites'],
        img: `${IMG}/property-renovations/property-renovations-3`, rev: true },
    ],
    benefits: [
      { t: 'Maximise property value', d: 'Strategic upgrades that improve resale and rental returns.' },
      { t: 'Investor-friendly', d: 'Reliable timelines and budgets developers can plan around.' },
      { t: 'Single point of contact', d: 'No juggling trades — we manage the whole project.' },
      { t: 'Modern, lasting finish', d: 'Quality materials chosen for durability and appeal.' },
    ],
    faqs: [
      { q: 'Do you handle full house renovations?', a: 'Yes — from a single room to a complete property refurbishment, we manage all trades and the full programme of works.' },
      { q: 'Can you work to an investor’s budget and timeline?', a: 'Absolutely. We’re experienced with buy-to-let and developer projects and provide clear costs and realistic schedules.' },
      { q: 'Will you help with design and material choices?', a: 'Yes. We advise on layouts, specifications and finishes that balance cost, durability and value.' },
      { q: 'Do you offer a guarantee on renovation work?', a: 'Our workmanship is backed by aftercare and any manufacturer warranties on installed products. Details are confirmed in your quote.' },
    ],
  },

  'carpentry-joinery': {
    label: 'Carpentry & Joinery', icon: 'carpentry',
    hero: `${IMG}/carpentry-joinery/carpentry-joinery`,
    short: 'Skilled bespoke carpentry — from structural first-fix to flawless fitted joinery.',
    metaTitle: 'Carpentry & Joinery London | Bespoke Fitted | Vision Touch Ltd',
    metaDesc: 'Certified carpentry and joinery across Greater London — first & second fix, bespoke fitted wardrobes, staircases, doors and made-to-measure storage. Free quotes.',
    keywords: 'carpentry and joinery London, bespoke joinery London, fitted wardrobes London, carpenter London',
    intro: 'Great building work lives and dies on the carpentry. Our certified carpenters handle everything from structural first-fix to the fine, made-to-measure joinery that makes a home feel finished — fitted wardrobes, staircases, doors, shelving and bespoke storage built to last.',
    why: 'Carpentry is where craftsmanship shows. Precise, well-fitted joinery doesn’t just look beautiful — it uses space cleverly, adds storage and lifts the perceived quality (and value) of the whole property.',
    features: [
      { t: 'First & second fix done right', d: 'Floor joists, studwork, roofing timbers, then doors, skirting, architrave and the details that count.',
        list: ['Structural first-fix carpentry', 'Doors, skirting & architrave', 'Staircases & balustrades'],
        img: `${IMG}/carpentry-joinery/carpentry-joinery`, video: `${VID}/carpentry-joinery.mp4`, poster: `${IMG}/carpentry-joinery/carpentry-joinery-video-poster` },
      { t: 'Bespoke fitted joinery', d: 'Made-to-measure wardrobes, alcove units and storage designed around your rooms and your life.',
        list: ['Fitted wardrobes & alcove units', 'Bespoke shelving & media walls', 'Made-to-measure storage solutions'],
        img: `${IMG}/carpentry-joinery/carpentry-joinery-2`, rev: true },
    ],
    benefits: [
      { t: 'Certified, skilled trades', d: 'UK-trained carpenters with a genuine eye for detail.' },
      { t: 'Made to measure', d: 'Joinery built precisely for your space — no awkward gaps.' },
      { t: 'Clever use of space', d: 'Maximise storage in alcoves, lofts and tight corners.' },
      { t: 'Premium, lasting finish', d: 'Quality materials and craftsmanship that endure.' },
    ],
    faqs: [
      { q: 'Do you make bespoke fitted wardrobes?', a: 'Yes — we design, build and fit made-to-measure wardrobes, alcove units and storage tailored to your room and style.' },
      { q: 'Can you fit a new staircase?', a: 'We supply and install staircases and balustrades, including as part of loft conversions and renovations.' },
      { q: 'Do you do both first and second fix carpentry?', a: 'We cover the full scope — structural first-fix through to the fine second-fix detailing.' },
      { q: 'Is your carpentry guaranteed?', a: 'Our workmanship is backed by aftercare, and installed products carry their manufacturer warranties.' },
    ],
  },

  'kitchen-installation': {
    label: 'Kitchen Installation', icon: 'kitchen',
    hero: `${IMG}/kitchen-installation/kitchen-installation`,
    short: 'Beautiful, functional kitchens fitted to the highest standard — the heart of the home.',
    metaTitle: 'Kitchen Installation London | Fitted Kitchens | Vision Touch Ltd',
    metaDesc: 'Professional kitchen installation across Greater London — full fitting, plumbing, electrics, tiling and worktops. Modern fitted kitchens built to a premium standard. Free quotes.',
    keywords: 'kitchen installation London, fitted kitchens London, kitchen fitters London, kitchen renovation London',
    intro: 'The kitchen is the heart of the home and the room buyers judge first. Vision Touch Ltd installs fitted kitchens across Greater London to a premium standard — handling the units, worktops, plumbing, electrics, tiling and finishing so everything lines up perfectly.',
    why: 'A well-fitted kitchen transforms daily life and is one of the most influential rooms for property value. Precision matters here: level units, seamless worktops and clean tiling are the difference between a kitchen that looks fitted and one that looks finished.',
    features: [
      { t: 'A complete, coordinated fit', d: 'We manage every element so your kitchen comes together seamlessly — no gaps between trades.',
        list: ['Units, worktops & splashbacks', 'Plumbing, electrics & appliances', 'Tiling, flooring & finishing'],
        img: `${IMG}/kitchen-installation/kitchen-installation`, video: `${VID}/kitchen-installation.mp4`, poster: `${IMG}/kitchen-installation/kitchen-installation-video-poster` },
      { t: 'Designed for real life', d: 'Layouts that flow, storage that works and finishes that wipe clean and wear well.',
        list: ['Practical, functional layouts', 'Quality worktops & cabinetry', 'Premium, hard-wearing finishes'],
        img: `${IMG}/kitchen-installation/kitchen-installation-2`, rev: true },
    ],
    benefits: [
      { t: 'Full installation service', d: 'From strip-out to final finish, managed by one team.' },
      { t: 'Precision fitting', d: 'Level units and seamless worktops, every time.' },
      { t: 'Adds property value', d: 'A standout kitchen lifts the whole home.' },
      { t: 'Trades coordinated', d: 'Plumbing, electrics and tiling handled together.' },
    ],
    faqs: [
      { q: 'Do you supply the kitchen or just fit it?', a: 'Either. We can fit a kitchen you’ve purchased or advise on and supply units, worktops and appliances as part of the project.' },
      { q: 'Can you move plumbing and electrics?', a: 'Yes — we handle the plumbing, electrical and gas-safe coordination required to change your layout safely and to regulations.' },
      { q: 'How long does a kitchen installation take?', a: 'Most installations take 1–3 weeks depending on size and whether building or layout changes are involved.' },
      { q: 'Do you tile and fit flooring too?', a: 'We do — tiling, splashbacks and flooring are all part of our complete kitchen service.' },
    ],
  },

  'bathroom-installation': {
    label: 'Bathroom Installation', icon: 'bathroom',
    hero: `${IMG}/bathroom-installation/bathroom-installation`,
    short: 'Spa-quality bathrooms and en-suites — fully fitted, waterproofed and finished.',
    metaTitle: 'Bathroom Installation London | Fitted Bathrooms | Vision Touch Ltd',
    metaDesc: 'Bathroom installation across Greater London — full fitting, waterproofing, tiling, plumbing and en-suites. Modern, spa-quality bathrooms built to last. Free quotes.',
    keywords: 'bathroom installation London, fitted bathrooms London, bathroom fitters London, en-suite installation London',
    intro: 'A new bathroom should feel like a calm, spa-quality retreat — and be built to handle water properly for years. Vision Touch Ltd designs and installs bathrooms and en-suites across Greater London, handling the plumbing, waterproofing, tiling and finishing to a meticulous standard.',
    why: 'Bathrooms are high-value, high-wear rooms where hidden quality matters most. Correct waterproofing, falls and ventilation protect your home — while beautiful tiling and fixtures deliver the premium feel that buyers and guests notice.',
    features: [
      { t: 'Watertight, then beautiful', d: 'We get the unseen essentials right — tanking, falls and ventilation — then finish to a flawless standard.',
        list: ['Full waterproofing & tanking', 'Plumbing, drainage & ventilation', 'Precision tiling & finishing'],
        img: `${IMG}/bathroom-installation/bathroom-installation`, video: `${VID}/bathroom-installation.mp4`, poster: `${IMG}/bathroom-installation/bathroom-installation-video-poster` },
      { t: 'En-suites & family bathrooms', d: 'From compact en-suites to luxurious family bathrooms, designed to make the most of every centimetre.',
        list: ['En-suites & cloakrooms', 'Walk-in showers & wet rooms', 'Premium fixtures & fittings'],
        img: `${IMG}/bathroom-installation/bathroom-installation-2`, rev: true },
    ],
    benefits: [
      { t: 'Proper waterproofing', d: 'Tanking and falls done right to protect your home.' },
      { t: 'Spa-quality finish', d: 'Premium tiling and fixtures fitted with care.' },
      { t: 'Space-smart design', d: 'Layouts that maximise even compact rooms.' },
      { t: 'Adds real value', d: 'A standout bathroom lifts your whole property.' },
    ],
    faqs: [
      { q: 'Can you create an en-suite where there isn’t one?', a: 'Yes — we regularly add en-suites and cloakrooms, including the plumbing, drainage and ventilation needed to do it properly.' },
      { q: 'Do you build wet rooms?', a: 'We do. Wet rooms require careful tanking and falls, which we handle to ensure a fully watertight, long-lasting result.' },
      { q: 'How long does a bathroom take to fit?', a: 'A typical bathroom takes around 1–2 weeks depending on size, tiling and any layout changes.' },
      { q: 'Do you supply the suite and tiles?', a: 'We can fit your chosen products or advise on and supply suites, tiles and fixtures as part of the project.' },
    ],
  },

  'structural-work': {
    label: 'Structural Work', icon: 'structural',
    hero: `${IMG}/structural-work/structural-work`,
    short: 'Steel beams, load-bearing walls and underpinning — done safely and signed off.',
    metaTitle: 'Structural Work London | Steel Beams & RSJ | Vision Touch Ltd',
    metaDesc: 'Structural building work across Greater London — steel beam (RSJ) installation, load-bearing wall removal, underpinning and structural alterations, fully compliant. Free quotes.',
    keywords: 'structural work London, steel beam installation London, RSJ London, load bearing wall removal London',
    intro: 'Opening up a home or supporting a new extension takes proper structural work — and there’s no room for shortcuts. Vision Touch Ltd carries out steel beam (RSJ) installation, load-bearing wall removal, underpinning and structural alterations across Greater London, working to engineer’s calculations and building control sign-off.',
    why: 'Structural changes unlock open-plan living and larger spaces, but they carry real safety and compliance responsibilities. Done correctly — with the right steel, supports and approvals — they’re completely safe and transform how a property feels.',
    features: [
      { t: 'Engineered & compliant', d: 'We work to structural engineer’s calculations and coordinate building control so everything is safe and signed off.',
        list: ['Steel beam (RSJ) installation', 'Load-bearing wall removal', 'Underpinning & structural repairs'],
        img: `${IMG}/structural-work/structural-work`, video: `${VID}/structural-work.mp4`, poster: `${IMG}/structural-work/structural-work-video-poster` },
      { t: 'The backbone of bigger projects', d: 'Our structural work underpins extensions, knock-throughs and loft conversions — a safe base for everything else.',
        list: ['Temporary works & propping', 'Beam & lintel replacement', 'Foundations & ground works'],
        img: `${IMG}/structural-work/structural-work-2`, rev: true },
    ],
    benefits: [
      { t: 'Safety first', d: 'Built to engineer’s specs with proper temporary works.' },
      { t: 'Fully compliant', d: 'Building control sign-off coordinated for you.' },
      { t: 'Open-plan living', d: 'Remove walls safely for brighter, bigger spaces.' },
      { t: 'Solid foundations', d: 'Underpinning and groundworks done correctly.' },
    ],
    faqs: [
      { q: 'Do you remove load-bearing walls?', a: 'Yes — we remove load-bearing walls and install the appropriate steel beam, working to a structural engineer’s calculations and building control.' },
      { q: 'Do I need a structural engineer?', a: 'Structural changes require engineer’s calculations. We can coordinate this for you so the design, steel and sign-off all align.' },
      { q: 'What is underpinning and do I need it?', a: 'Underpinning strengthens and deepens existing foundations, sometimes needed for subsidence or new loads. We assess and advise after a site visit.' },
      { q: 'Is structural work disruptive?', a: 'There’s some unavoidable disruption, but we use proper propping and dust control and keep the site safe and tidy throughout.' },
    ],
  },

  'general-building-services': {
    label: 'General Building Services', icon: 'hardhat',
    hero: `${IMG}/general-building-services/general-building-services`,
    short: 'A single, reliable team for building works of every size — managed end to end.',
    metaTitle: 'General Builders Greater London | Building Services | Vision Touch Ltd',
    metaDesc: 'General building services across Greater London — brickwork, plastering, groundworks, repairs and full project management from a reliable local building team. Free quotes.',
    keywords: 'general builders Greater London, building services London, construction company Greater London, builders London',
    intro: 'Sometimes you just need a dependable builder who can handle the lot. Vision Touch Ltd provides general building services across Greater London — brickwork, plastering, groundworks, repairs and complete project management — with the same reliability and finish we bring to our largest projects.',
    why: 'A trustworthy general builder is hard to find. Having one team manage every trade saves you time, money and stress — and means accountability sits in one place from the first brick to the final clean.',
    features: [
      { t: 'Whatever the project needs', d: 'Brick and blockwork, plastering, rendering, repairs and maintenance — handled by skilled, tidy tradespeople.',
        list: ['Brickwork, blockwork & rendering', 'Plastering & dry-lining', 'Groundworks, drainage & repairs'],
        img: `${IMG}/general-building-services/general-building-services`, video: `${VID}/general-building-services.mp4`, poster: `${IMG}/general-building-services/general-building-services-video-poster` },
      { t: 'Properly project-managed', d: 'One point of contact, coordinated trades and clear communication from start to finish.',
        list: ['Full project management', 'Coordinated, scheduled trades', 'Clean, safe, well-run sites'],
        img: `${IMG}/property-renovations/property-renovations`, rev: true },
    ],
    benefits: [
      { t: 'One reliable team', d: 'Every trade under one accountable roof.' },
      { t: 'Any size of project', d: 'From small repairs to full builds.' },
      { t: 'Clear project management', d: 'Schedules, updates and a single contact.' },
      { t: 'Quality throughout', d: 'The same standard on every job.' },
    ],
    faqs: [
      { q: 'What counts as general building services?', a: 'Brickwork, plastering, rendering, groundworks, repairs, maintenance and the coordination of all the trades a project needs — managed by us.' },
      { q: 'Do you take on small jobs as well as large ones?', a: 'Yes. We handle everything from focused repairs to full building projects with the same care and reliability.' },
      { q: 'Will I have one point of contact?', a: 'Always. You deal with one team who manages the trades, the schedule and the communication throughout.' },
      { q: 'Do you clean up after the work?', a: 'We keep sites tidy as we go and finish with a proper clean-down and handover.' },
    ],
  },

  'roofing': {
    label: 'Roofing', icon: 'roofing',
    hero: `${IMG}/roofing/roofing`,
    short: 'New roofs, re-roofs and repairs — weatherproofing your most important asset.',
    metaTitle: 'Roofing Services London | Re-Roofing & Repairs | Vision Touch Ltd',
    metaDesc: 'Roofing services across Greater London — new roofs, re-roofing, flat roofs, repairs, guttering and leadwork. Protect your property with quality roofing. Free quotes.',
    keywords: 'roofing services London, roof repairs London, re-roofing London, flat roofing London, roofers London',
    intro: 'Your roof protects everything beneath it — so it’s worth getting right. Vision Touch Ltd provides roofing across Greater London, from full re-roofs and new pitched and flat roofs to repairs, guttering and leadwork that keep the weather firmly outside.',
    why: 'A sound roof prevents the damp, leaks and structural damage that quietly destroy property value. Investing in quality roofing protects your home, lowers long-term costs and gives genuine peace of mind through every London winter.',
    features: [
      { t: 'New roofs & re-roofing', d: 'Pitched and flat roofs installed with quality materials and proper detailing for a long, watertight life.',
        list: ['Pitched & flat roof installation', 'Full re-roofing & re-felting', 'Tiling, slating & EPDM flat roofs'],
        img: `${IMG}/roofing/roofing`, video: `${VID}/roofing.mp4`, poster: `${IMG}/roofing/roofing-video-poster` },
      { t: 'Repairs, leadwork & guttering', d: 'Fast, reliable repairs and maintenance to stop leaks and keep water moving away from your building.',
        list: ['Leak detection & roof repairs', 'Leadwork, flashing & chimneys', 'Guttering, fascias & soffits'],
        img: `${IMG}/roofing/roofing-2`, rev: true },
    ],
    benefits: [
      { t: 'Watertight protection', d: 'Quality materials and detailing that keep weather out.' },
      { t: 'New roofs & repairs', d: 'From full re-roofs to fast leak fixes.' },
      { t: 'Protects property value', d: 'Prevent damp and structural damage.' },
      { t: 'Flat & pitched roofs', d: 'The right system for your building.' },
    ],
    faqs: [
      { q: 'Do you repair roofs as well as replace them?', a: 'Yes — we handle everything from a single leak repair to a complete re-roof, and advise honestly on which you actually need.' },
      { q: 'What kind of flat roofs do you install?', a: 'We install modern flat-roof systems such as EPDM rubber and felt, detailed for durability and proper drainage.' },
      { q: 'Can you fix or replace guttering and fascias?', a: 'We do — guttering, fascias, soffits and leadwork are all part of our roofing service.' },
      { q: 'How do I know if I need a new roof?', a: 'Recurring leaks, slipped or missing tiles and sagging are common signs. We’ll inspect and give you a straight answer and a clear quote.' },
    ],
  },

  'flooring': {
    label: 'Flooring', icon: 'flooring',
    hero: `${IMG}/flooring/flooring`,
    short: 'Engineered wood, laminate, LVT and tiling — beautifully level, perfectly finished floors.',
    metaTitle: 'Flooring Installation London | Wood, LVT & Tiling | Vision Touch Ltd',
    metaDesc: 'Flooring installation across Greater London — engineered wood, laminate, luxury vinyl (LVT), tiling and floor preparation. Hard-wearing, beautiful floors. Free quotes.',
    keywords: 'flooring installation London, engineered wood flooring London, LVT flooring London, floor tiling London',
    intro: 'Flooring sets the tone for an entire room — and a perfect finish starts with proper preparation. Vision Touch Ltd installs engineered wood, laminate, luxury vinyl tile (LVT) and floor tiling across Greater London, with the subfloor prep and levelling that make the difference between good and flawless.',
    why: 'Quality, well-laid flooring instantly lifts how a space looks and feels, stands up to years of daily wear, and adds a noticeable sense of premium finish that buyers and tenants respond to.',
    features: [
      { t: 'The right floor for the room', d: 'We help you choose hard-wearing, beautiful flooring suited to how each space is used — then lay it perfectly.',
        list: ['Engineered & solid wood', 'Laminate & luxury vinyl (LVT)', 'Floor & large-format tiling'],
        img: `${IMG}/flooring/flooring` },
      { t: 'Preparation is everything', d: 'Level, sound subfloors and clean edges and transitions are what separate a premium floor from a fitted one.',
        list: ['Subfloor preparation & levelling', 'Underlay & moisture control', 'Crisp edges, trims & transitions'],
        img: `${IMG}/flooring/flooring-2`, rev: true },
    ],
    benefits: [
      { t: 'Flawless, level finish', d: 'Proper prep for floors that look and feel premium.' },
      { t: 'Hard-wearing materials', d: 'Floors chosen to handle real daily life.' },
      { t: 'Wide choice of styles', d: 'Wood, laminate, LVT and tiling.' },
      { t: 'Adds premium feel', d: 'Quality flooring lifts the whole room.' },
    ],
    faqs: [
      { q: 'What types of flooring do you install?', a: 'Engineered and solid wood, laminate, luxury vinyl tile (LVT) and floor tiling, including large-format tiles.' },
      { q: 'Do you prepare the subfloor first?', a: 'Always. We level and prepare the subfloor and fit appropriate underlay or moisture control — it’s essential for a lasting finish.' },
      { q: 'Can you remove and dispose of old flooring?', a: 'Yes — lifting and disposing of existing flooring can be included as part of the job.' },
      { q: 'Which flooring is best for a busy household?', a: 'LVT and quality laminate are excellent for high-traffic areas; we’ll recommend the best fit for each room and budget.' },
    ],
    placeholderNote: true,
  },

  'garage-conversions': {
    label: 'Garage Conversions', icon: 'garage',
    hero: `${IMG}/garage-conversions/garage-conversions`,
    short: 'Turn an underused garage into a warm, usable room — office, gym, snug or bedroom.',
    metaTitle: 'Garage Conversions London | Extra Living Space | Vision Touch Ltd',
    metaDesc: 'Garage conversions across Greater London — turn an unused garage into a home office, gym, bedroom or living space. Insulated, finished and added value. Free quotes.',
    keywords: 'garage conversions London, garage conversion company London, convert garage to room London',
    intro: 'A garage that stores boxes is wasted space. Vision Touch Ltd converts garages across Greater London into warm, fully usable rooms — home offices, gyms, snugs, playrooms or extra bedrooms — insulated, finished and integrated naturally with the rest of your home.',
    why: 'Garage conversions are one of the most cost-effective ways to add living space, because the structure already exists. With proper insulation, flooring and finishing, you gain a genuine extra room and add value — often without major planning hurdles.',
    features: [
      { t: 'From cold store to real room', d: 'We insulate, damp-proof, heat and finish the space so it’s comfortable to use all year round.',
        list: ['Insulation, damp-proofing & heating', 'New walls, windows & doors', 'Electrics, lighting & finishing'],
        img: `${IMG}/garage-conversions/garage-conversions`, video: `${VID}/garage-conversions.mp4`, poster: `${IMG}/garage-conversions/garage-conversions-video-poster` },
      { t: 'Designed to fit your home', d: 'Whether it’s an office, gym or extra bedroom, we make the new room feel like a seamless part of the house.',
        list: ['Home offices, gyms & snugs', 'Extra bedrooms & playrooms', 'Seamless integration with the home'],
        img: `${IMG}/garage-conversions/garage-conversions-2`, rev: true },
    ],
    benefits: [
      { t: 'Cost-effective space', d: 'The structure’s already there — great value per m².' },
      { t: 'Warm & usable year-round', d: 'Proper insulation, heating and finishing.' },
      { t: 'Flexible use', d: 'Office, gym, bedroom, snug — your choice.' },
      { t: 'Adds property value', d: 'More usable living space buyers want.' },
    ],
    faqs: [
      { q: 'Do I need planning permission to convert my garage?', a: 'Many garage conversions fall under Permitted Development as they use the existing structure, but it varies. We confirm exactly what’s needed for your property.' },
      { q: 'Will the converted room be warm enough?', a: 'Yes — we insulate the walls, floor and ceiling, address any damp and add heating so the room is comfortable all year.' },
      { q: 'Can you match the new room to the rest of the house?', a: 'We finish the conversion to blend with your home, including walls, flooring, windows, doors and decoration.' },
      { q: 'How long does a garage conversion take?', a: 'Most single-garage conversions take around 2–4 weeks depending on the specification and any structural changes.' },
    ],
  },
};

/* ---- Portfolio (PLACEHOLDER demo projects — replace with real client work) ---- */
export const PROJECTS = [
  { name: 'Loft Conversion in Wembley', cat: 'loft-conversions', catLabel: 'Loft Conversion', loc: 'Wembley', img: 'assets/images/services/loft-conversions/loft-conversions', desc: 'A rear dormer loft conversion creating a bright double bedroom with en-suite.' },
  { name: 'Facade Renovation & Rendering', cat: 'property-renovations', catLabel: 'Renovation', loc: 'Croydon', img: 'assets/images/before-after/facade-renovation-after', desc: 'A tired exterior transformed with fresh render and a smart new entrance.' },
  { name: 'Fitted Kitchen Transformation', cat: 'kitchen-installation', catLabel: 'Kitchen', loc: 'Ealing', img: 'assets/images/before-after/kitchen-renovation-2-after', desc: 'A modern fitted kitchen with marble-effect worktops and integrated appliances.' },
  { name: 'House Extension in Harrow', cat: 'house-extensions', catLabel: 'Extension', loc: 'Harrow', img: 'assets/images/services/house-extensions/house-extensions', desc: 'A single-storey rear extension opening the home onto the garden with bi-folds.' },
  { name: 'Bathroom Upgrade in Stratford', cat: 'bathroom-installation', catLabel: 'Bathroom', loc: 'Stratford', img: 'assets/images/services/bathroom-installation/bathroom-installation', desc: 'A spa-style family bathroom with walk-in shower and full re-tiling.' },
  { name: 'Garage Conversion in Enfield', cat: 'garage-conversions', catLabel: 'Garage Conversion', loc: 'Enfield', img: 'assets/images/services/garage-conversions/garage-conversions', desc: 'An integral garage transformed into a warm, light-filled home office.' },
  { name: 'Bespoke Media Wall', cat: 'carpentry-joinery', catLabel: 'Joinery', loc: 'Richmond', img: 'assets/images/before-after/media-wall-after', desc: 'A made-to-measure media wall with clean lines and hidden storage.' },
  { name: 'Structural Works & Steelwork', cat: 'structural-work', catLabel: 'Structural', loc: 'Camden', img: 'assets/images/work/work-02', desc: 'Load-bearing works and steel support installation to open up the space.' },
  { name: 'Galley Kitchen Renovation', cat: 'kitchen-installation', catLabel: 'Kitchen', loc: 'Barnet', img: 'assets/images/before-after/kitchen-renovation-1-after', desc: 'A dated galley kitchen reworked into a bright, hard-wearing modern space.' },
  { name: 'Staircase Renovation', cat: 'carpentry-joinery', catLabel: 'Joinery', loc: 'Islington', img: 'assets/images/before-after/staircase-renovation-after', desc: 'A refreshed staircase with new treads, handrail and a clean finish.' },
  { name: 'Roof Replacement in Bromley', cat: 'roofing', catLabel: 'Roofing', loc: 'Bromley', img: 'assets/images/services/roofing/roofing', desc: 'A full re-roof with new tiling, leadwork and guttering.' },
];

/* ---- Reviews (PLACEHOLDER demo testimonials — replace with real reviews) ---- */
export const REVIEWS = [
  { name: 'Karen Mitchell', loc: 'Wembley', service: 'Loft Conversion', stars: 5, text: 'Vision Touch handled our loft conversion professionally from start to finish. Communication was clear and the final space added real value to our home.' },
  { name: 'David Wright', loc: 'Croydon', service: 'Property Renovation', stars: 5, text: 'The renovation was completed with care and attention to detail. The team kept the site tidy and gave practical advice throughout.' },
  { name: 'Aisha Patel', loc: 'Enfield', service: 'Garage Conversion', stars: 5, text: 'We needed a garage conversion for extra living space and Vision Touch delivered a clean, functional finish. Really pleased with the result.' },
  { name: 'Mark Reynolds', loc: 'Harrow', service: 'House Extension', stars: 5, text: 'Our rear extension completely changed how we use the house. Honest pricing, a clear timeline and quality work throughout.' },
  { name: 'Sophie Bennett', loc: 'Ealing', service: 'Kitchen Installation', stars: 5, text: 'The new kitchen is exactly what we hoped for. Everything is level, the worktops are seamless and the whole fit was stress-free.' },
  { name: 'Peter Kowalczyk', loc: 'Stratford', service: 'Bathroom Installation', stars: 5, text: 'Beautiful bathroom, fitted properly and on schedule. They clearly cared about getting the waterproofing and tiling spot on.' },
  { name: 'Laura Evans', loc: 'Richmond', service: 'Carpentry & Joinery', stars: 5, text: 'The fitted wardrobes are flawless and use every bit of space. Genuine craftsmanship — exactly what we wanted.' },
  { name: 'Gary Hopkins', loc: 'Camden', service: 'Structural Work', stars: 5, text: 'They removed a load-bearing wall and installed the steel safely, with all the sign-off handled. Open-plan living at last!' },
];

export const FAQ_HOME = [
  { q: 'Which areas of London do you cover?', a: 'We work across the whole of Greater London, including boroughs such as Wembley, Croydon, Ealing, Harrow, Enfield, Richmond and more.' },
  { q: 'Do you offer free, no-obligation quotes?', a: 'Yes. Tell us about your project by phone, WhatsApp, email or our quote form and we’ll provide a clear, no-obligation quote.' },
  { q: 'Do you handle planning and building regulations?', a: 'We guide you through planning and building control where required and coordinate the necessary drawings, calculations and approvals.' },
  { q: 'Do you work with property investors and developers?', a: 'Absolutely. Alongside homeowners, we deliver renovation and development projects for investors, landlords and developers.' },
  { q: 'Is your work guaranteed?', a: 'Our workmanship is backed by aftercare, and installed products carry their manufacturer warranties. Specifics are confirmed in your quote.' },
];
