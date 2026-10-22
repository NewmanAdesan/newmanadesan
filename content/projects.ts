export type Shot = { src: string; alt: string };

// A short muted screen recording. The first one leads the case study and plays on hover on the home card.
export type Video = { src: string; poster: string; label: string };

// An interactive demo shown right after the story it illustrates.
export type DemoId = "gift-card" | "cursor-pagination" | "dispatch-feed";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  role: string;
  period: string;
  stack: string[];
  link?: { href: string; label: string };
  summary: string;
  context: string;
  built: string[];
  // Your own account of a hard problem and how you solved it. Leave empty until written.
  story?: { heading: string; body: string; demo?: DemoId }[];
  // Version history, shown before the stories.
  timeline?: { label: string; text: string }[];
  videos?: Video[];
  // Swyftng only: the two lead screenshots open the case study and every recording moves to the end.
  videosLast?: boolean;
  // Home card image when it shouldn't be the first screenshot.
  cover?: Shot;
  // The first two appear right after "What I built"; the rest follow the stories.
  shots: Shot[];
};

export const projects: Project[] = [
  {
    slug: "swyftng",
    name: "Swyftng",
    tagline: "Multi-service ordering and delivery marketplace",
    role: "Frontend developer",
    period: "May 2024 – present",
    stack: ["React", "TypeScript", "Vite", "React Query", "Zustand", "React Hook Form", "Zod", "Tailwind CSS"],
    link: { href: "https://swyftng.com", label: "swyftng.com" },
    summary:
      "I have built Swyftng's web platform since the MVP in May 2024, through five major versions. Version 5 has just shipped.",
    context:
      "Swyftng lets customers order from restaurants, supermarkets, local markets and home care services in one place, book a rider for any parcel, and pay with gift cards and earned credit. Vendors, riders and Swyftng's own staff run their side of each order, and the platform has grown by a new kind of order with almost every version.",
    built: [
      "Consumer, vendor, rider and admin interfaces in one React app.",
      "The full order workflow, from payment through processing to delivered, for every kind of order the platform sells.",
      "Credit and rewards end to end: gift cards, referrals, feedback rewards, cashback and special packages, from the customer's wallet to the admin tools that manage and track them.",
      "Cursor pagination on the credit management tables, using the pattern I first designed on the ambulance platform.",
    ],
    timeline: [
      { label: "v1", text: "Food ordering and delivery, with consumer, vendor, rider and admin interfaces." },
      { label: "v2", text: "Errands from supermarkets, local markets and drink shops, fulfilled by Swyftng's own marketers." },
      { label: "v3", text: "Swyftng Express+: book a dispatch rider for any parcel." },
      { label: "v4", text: "Personal and home care services, booked as appointments." },
      { label: "v5", text: "Credit management (gift cards, referrals, cashback and feedback rewards) and special packages." },
    ],
    story: [
      {
        heading: "One app, every interface",
        body: "Swyftng serves customers, vendors, riders and admins from one React application. Each interface has its own layout, routes and context, and they share one onboarding flow that signs a user in and sends them to the right interface for their role. A session that lands in the wrong interface is signed out rather than shown someone else's screens.\n\nMarketers are Swyftng staff who shop the errands customers order, and they work from a separate mobile app. My side of that is where it meets the web: the customer placing the errand, and the admin seeing and managing the marketer's orders alongside every other kind.\n\nShared building blocks live in one place: the API client, the query hooks and the UI kit. A fix to how errors are handled reaches every interface at once.",
      },
      {
        heading: "Growing through five versions without a rewrite",
        body: "Almost every version added a new kind of order: restaurant meals, market errands, parcel dispatch, home care appointments, gift cards, then special packages. Each one touches the cart, checkout, order history and the admin. Rewriting for each was never an option on a live platform, so the work was making every layer accept a new order type without breaking the old ones.\n\nThe customer's order history card works out which kind of order it is showing and renders the right details, prices and actions. The admin's order view does the same, and product management handles restaurant, market, service and special-package products, each with its own create and edit rules.\n\nBy v5 checkout had grown into one 1,672-line component, plus a separate guest cart and two toast libraries. I rebuilt it as a three-screen wizard (cart, checkout, then transaction PIN) driven by a single order context that owns the cart query, the delivery and payment choices and every mutation. If the customer has no PIN yet, creating one is its own small state machine: create, confirm, verify by OTP, then enter. Redeeming a gift card and applying earned credit then went in as one component each.",
      },
      {
        heading: "Admin roles, permissions and an audit trail",
        body: "The super admin invites other admins, creates roles from any set of permissions, assigns a role to each admin, and can suspend or restore an account. The admin list shows who is online, who is offline, when each admin last signed in, and who has been invited but hasn't joined yet.\n\nEvery change an admin makes is recorded: who made it, which record it touched, and the old and new value of each field. A product's price, discount or approval status can be traced to the person who changed it and when, and each admin's account page lists their recent actions.",
      },
      {
        heading: "A colour system admins can't break",
        body: "Admins design gift cards and special-package cards themselves, so colour had to be safe in their hands. A gift card's design is four colours. I curated 30 named combinations that work together, and the backend stores only the four hex values. The names live only in the frontend, so they can be renamed without touching the API. When an admin picks a theme, each option shows whether it is already in use and on how many cards. When an admin edits a card, the right theme is pre-selected by matching the stored colours back to a name.\n\nA special package needs only one colour. The card's grid lines are derived from it, same hue and slightly darker, so no choice can clash. The card works in HSL internally and converts to hex only at the API boundary, and it still reads an older colour format the backend once stored, so old packages keep rendering.",
        demo: "gift-card",
      },
      {
        heading: "When the data disagrees",
        body: "In a customer's order history, expanding a special-package order showed the wrong price for its items: ₦1,500 where the customer had paid ₦15,000. The screen was reading the product's base price. The backend sends several price fields for each cart item, and they don't agree: one is sometimes a spurious 0, and the base price ignores the variation the customer chose.\n\nInstead of guessing which field to trust, I checked each one against 100 real orders and counted where the line totals added up to what was charged. Regular products reconciled best on the product price, dynamic packages on the selected variation's price, and static packages on the base price. I reordered the fallback chain to match. That fixed 5 orders with no regressions.\n\nTwo orders matched no combination of fields at all. I sent them to the backend team with the evidence, because the real fix is one authoritative charged price per item. Until then, my chain is a documented workaround.",
      },
      {
        heading: "Breadcrumbs that follow the admin anywhere",
        body: "Admins investigating a problem jump between records: from an order to the customer who placed it, to the vendor, to one of the vendor's products, and back. I built each detail view (order, account, business, product, service) as a self-contained component that takes the breadcrumb trail it was opened from, adds its own crumb, and passes the longer trail to whatever it opens next.\n\nBecause every view works the same way, they nest in any order and work from any admin section, and clicking any crumb returns to that level. The trade-off is that the trail lives in component state rather than the URL, so a page refresh returns to the list. Moving it into the URL is the next step.",
      },
    ],
    videosLast: true,
    videos: [
      { src: "/videos/swyftng/landing.mp4", poster: "/videos/swyftng/landing.jpg", label: "The Swyftng landing page" },
    ],
    shots: [
      { src: "/images/swyftng/admin-gift-card-themes.jpg", alt: "Admin: gift card colour themes, with how many cards use each" },
      { src: "/images/swyftng/supermarket.jpg", alt: "Supermarket storefront with category filters" },
      { src: "/images/swyftng/landing.jpg", alt: "Swyftng landing page" },
      { src: "/images/swyftng/restaurants.jpg", alt: "Restaurant listing with sort options" },
      { src: "/images/swyftng/search.jpg", alt: "Search results grouped by service" },
      { src: "/images/swyftng/gift-card-store.jpg", alt: "Gift card store for customers" },
      { src: "/images/swyftng/credit-balances.jpg", alt: "Customer credit balances: referral, gift card, feedback, cashback" },
      { src: "/images/swyftng/admin-gift-cards.jpg", alt: "Admin: active gift card templates" },
      { src: "/images/swyftng/admin-special-package.jpg", alt: "Admin: editing a special package" },
      { src: "/images/swyftng/admin-fees.jpg", alt: "Admin: processing and delivery fees per service" },
    ],
  },
  {
    slug: "demiverse",
    name: "Demiverse",
    tagline: "Showcase site for an architectural visualisation studio",
    role: "Web developer",
    period: "Sep – Oct 2026",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Photo Sphere Viewer", "sharp"],
    link: { href: "https://demiverse-site.vercel.app", label: "demiverse-site.vercel.app" },
    summary:
      "A portfolio site that presents the studio's projects as stills, day and night comparisons, 360° tours and film.",
    context:
      "Demiverse produces architectural renders and walkthroughs. The site had to show heavy visual media well on phones without becoming slow or hard to update.",
    built: [
      "Project pages for stills, day/night comparisons, 360° tours and film.",
      "Scroll-driven motion: a project hero that turns from day to night, and a home page sequence where the room's furniture rises as you scroll.",
      "A media pipeline, so a new project is added through configuration rather than new code.",
      "Delivered in 16 phases, each signed off by the founder.",
      "Scores 100 for accessibility on mobile Lighthouse.",
    ],
    story: [
      {
        heading: "Very large renders, loading fast",
        body: "Architectural renders are huge, and the studio's clients open links on whatever phone they have, so I planned for an iPhone 7 with 2 GB of RAM and Safari 15. On a phone like that the limit is memory as much as download size: a 2,560px render takes about 26 MB once decoded, however well it was compressed.\n\nA build script turns each raw render into AVIF and WebP at several widths, plus a tiny blurred preview. Each image is a <picture> with an AVIF source and a WebP fallback, because Safari 15 can't show AVIF. Accurate sizes attributes stop phones fetching desktop widths, which on the home page alone had been over-fetching 277 KB. Hover-only images are never requested on touch screens, and phones never request the home page's video at all.",
      },
      {
        heading: "Scroll that tells the time of day",
        body: "The site's idea is that the day passes as you scroll. On The Cabin's page the hero pins to the screen and its render crossfades from day to night across the pinned distance, finishing before the hero starts to leave. The page background follows: it holds at dusk through the opening sections, then turns to night over about one screen height, anchored to the shot where the pictures switch to their night versions, so background and images turn together. The background crossfade is pure opacity, which the browser can run without repainting, and text colours change in four steps rather than every frame, so it stays smooth on old phones.\n\nOn the home page, the furniture in a room rises as you scroll. It looks like video but isn't: scrubbing a video by its playback time makes the browser decode from the nearest keyframe on every step, which no old phone does smoothly. Instead it is 60 WebP frames, 0.59 MB in all, drawn to a canvas only when the frame changes. A frame that hasn't arrived yet is skipped rather than cleared, so a slow connection looks like a pause, not a blank. Under a 4× CPU slowdown on a phone-sized screen it dropped 0 frames.\n\nBoth effects share one scroll listener. With reduced motion switched on there is no pinning or scrubbing: the hero shows night with a day/night switch, and the home page shows the finished room as a still.",
      },
      {
        heading: "No white boxes while loading",
        body: "Testing on a throttled 3G connection, I found some slots showing flat colour or white boxes while they loaded. The blurred preview lived inside one image component, so it only reached images that went through it. Video posters, home tiles and the 360° preview each built their own element and had no preview at all.\n\nI moved the loading treatment into one shared frame component used by every image, video and canvas, and generated previews for the media that had none. I then audited all 13 kinds of media slot mid-load, on Slow 3G, at phone and desktop widths. All 13 show a blurred preview, with zero white boxes, and layout shift stays at 0.",
      },
    ],
    videos: [
      { src: "/videos/demiverse/homepage.mp4", poster: "/videos/demiverse/homepage.jpg", label: "The home page: the project grid, then the room's furniture rising as you scroll" },
      { src: "/videos/demiverse/cabin-day-night.mp4", poster: "/videos/demiverse/cabin-day-night.jpg", label: "The Cabin: the hero turns from day to night as you scroll" },
      { src: "/videos/demiverse/tour-360.mp4", poster: "/videos/demiverse/tour-360.jpg", label: "The 360° tour of The Cabin" },
    ],
    cover: { src: "/images/demiverse/cover.jpg", alt: "Demiverse home page" },
    shots: [
      { src: "/images/demiverse/interiors-1.jpg", alt: "The Cabin: walkthrough grid of interior views" },
      { src: "/images/demiverse/interiors-2.jpg", alt: "The Cabin: more views of the living area" },
      { src: "/images/demiverse/exteriors.jpg", alt: "An exterior project: street and aerial views" },
    ],
  },
  {
    slug: "shkula",
    name: "Shkula",
    tagline: "Multi-school management platform",
    role: "Software developer",
    period: "Dec 2023 – Apr 2025",
    stack: ["React", "Next.js", "TypeScript", "Firebase"],
    link: {
      href: "https://multi-school-data-management-interf.vercel.app/admin",
      label: "Super-admin dashboard demo",
    },
    summary:
      "The company's public website, then the internal dashboard used to oversee more than ten schools.",
    context:
      "Shkula is school management software used by several schools at once. The company needed a public face first, and then a way for its own team to see across every school on the platform.",
    built: [
      "The public website: marketing pages, blog, documentation and pricing.",
      "The internal super-admin dashboard for overseeing 10+ schools.",
      "Role-based access separating school administrators from platform administrators.",
    ],
    videos: [
      { src: "/videos/shkula/loading.mp4", poster: "/videos/shkula/loading.jpg", label: "The Shkula site's loading animation" },
    ],
    shots: [
      { src: "/images/shkula/homepage.png", alt: "Shkula homepage hero with the mobile app preview" },
      { src: "/images/shkula/multi-admin-dashboard.png", alt: "The super-admin dashboard across schools" },
      { src: "/images/shkula/about-page.png", alt: "Shkula about page" },
      { src: "/images/shkula/pricing_system.png", alt: "Shkula pricing page" },
      { src: "/images/shkula/documentation_system.png", alt: "Shkula documentation pages" },
      { src: "/images/shkula/blog_system_A.png", alt: "Shkula blog listing" },
      { src: "/images/shkula/blog_system_B.png", alt: "Shkula blog article" },
    ],
  },
  {
    slug: "ambulance-dispatch",
    name: "Ambulance dispatch platform",
    tagline: "Request and dispatch ambulances in real time",
    role: "Frontend developer",
    period: "2025 – present",
    stack: ["Next.js", "React", "TypeScript", "Socket.IO", "TanStack Query", "Zustand", "Tailwind CSS"],
    summary:
      "Web interfaces for a healthcare logistics platform: people request an ambulance for an emergency or an event, providers offer their ambulances, and administrators run the operation.",
    context:
      "The platform has three sides: consumers requesting ambulances, providers running them, and administrators overseeing both. The product hasn't launched yet and the client is under confidentiality, so there are no screenshots or name here.",
    built: [
      "Consumer, provider and admin interfaces in one Next.js app, each with its own layout and context.",
      "Real-time requests, offers, booking status updates and booking chat over Socket.IO.",
      "Emergency and event booking. When several providers offer ambulances, the consumer confirms or reserves as many as they asked for.",
      "Admin tools for accounts, bookings, ambulances, staff, facilities, pricing, transactions, and admin roles and permissions.",
      "Cursor-aware pagination for the admin lists, a pattern I later brought to Swyftng.",
    ],
    story: [
      {
        heading: "Real-time dispatch over Socket.IO",
        body: "A request has to reach providers the moment it is made, and their offers have to reach the consumer just as fast. When a signed-in consumer or provider opens the app, their interface opens one Socket.IO connection, authenticated with their token, and closes it when they leave. The connection lives in a small Zustand store, so any component can read the latest event or send one without passing the socket around.\n\nListeners and actions are gated by role: only a consumer can ask for available ambulances, only a provider can offer one, and only consumers listen for booking status changes. Actions wait for the server's acknowledgement before the screen changes, so a provider's offer shows as sent only once the server has it. Consumer and provider can message each other about a booking in a chat sheet that follows them across the app.\n\nAdmins get a live feed of booking status changes on their dashboard, with its own connection, the latest seven updates, a Live, Offline or Error indicator and a retry button, so a dropped connection is visible instead of silently stale. Before the backend's events were ready, the client was tested against a small mock Socket.IO server that answers a request and has a provider accept it five seconds later.",
        demo: "dispatch-feed",
      },
      {
        heading: "Cursor pagination that never looks frozen",
        body: "The admin lists page through the server with cursors. A cursor marks a position in one particular result set, so the moment a filter or the page size changes, the old cursor means nothing. The common bug is changing a filter and forgetting to reset it.\n\nI made that bug impossible to write. All of a list's filters, page size and cursor live in one object, changed only through one function that every call site must tell whether to reset the cursor. Filter and page-size changes reset it; next and previous move it. The whole object is the query key, so every field that affects the response triggers a refetch, and a page that was already fetched with the same key comes straight from cache. The first list I moved to this pattern had a search box that did nothing, because search was missing from its query key. That class of bug can't happen in a list built this way.\n\nWhile a page loads, the buttons disable, so a double click can't skip a page, and the page number turns into a spinner, so the table never looks stuck. If the first load fails, the table shows an error with a retry. If a later page fails, the rows already on screen stay and a small banner offers a retry, which re-runs exactly the request that failed because its cursor is already in state.",
        demo: "cursor-pagination",
      },
    ],
    cover: { src: "/images/ambulance/cover.jpg", alt: "The live booking feed demo from this case study" },
    shots: [],
  },
  {
    slug: "globam",
    name: "GloBam",
    tagline: "Landing page for an engineered-bamboo company",
    role: "Web developer",
    period: "2026",
    stack: ["React", "TypeScript", "Vite"],
    summary:
      "A landing page that turns a founder's story into a case for engineered bamboo as an answer to affordable housing in Nigeria.",
    context:
      "GloBam promotes bamboo as a building material well beyond scaffolding, and runs the yearly Global Bamboo Expo, held online in 2023 and 2024, at FUTA in 2025 and at UNILAG in 2026. The founder explained the company to me in a series of voice notes.",
    built: [
      "Listened to all of the founder's voice notes, then transcribed them to study his intent before writing a word. From that I built the site's structure and copy: the thesis, a three-level engineered-bamboo capability ladder, the expo timeline and the flagship beach-house concept.",
      "A design that reads like an architect's drawing set, in keeping with an audience of architects, builders and students.",
      "Concept work labelled honestly as not yet built.",
    ],
    shots: [
      { src: "/images/globam/home.jpg", alt: "GloBam home: Bamboo, beyond scaffolding" },
      { src: "/images/globam/ladder.jpg", alt: "The engineered-bamboo capability ladder" },
      { src: "/images/globam/expo.jpg", alt: "Global Bamboo Expo timeline" },
      { src: "/images/globam/flagship.jpg", alt: "The beach bamboo haven concept" },
    ],
  },
  {
    slug: "ba-digi-marketing",
    name: "BA Digi Marketing",
    tagline: "Lead-qualifying website for a marketing agency",
    role: "Web developer and solutions analyst",
    period: "Mar 2026",
    stack: ["React", "TypeScript"],
    summary:
      "I wrote the blueprint for the agency's site, the client approved it, and then I built it.",
    context:
      "The agency wanted its website to bring in better-qualified leads, not just look good.",
    built: [
      "A four-page conversion funnel, with the purpose and content of every section planned before any code.",
      "Transparent pricing tiers.",
      "A package recommendation quiz that qualifies leads and pre-fills the contact form.",
    ],
    shots: [
      { src: "/images/ba-digi/home.jpg", alt: "BA Digi Marketing home page" },
      { src: "/images/ba-digi/pricing.jpg", alt: "Four pricing tiers" },
      { src: "/images/ba-digi/quiz.jpg", alt: "Package recommendation quiz" },
      { src: "/images/ba-digi/contact.jpg", alt: "Contact page with the form the quiz pre-fills" },
    ],
  },
];

export const analysis = [
  {
    name: "Visual House Ortoptica",
    detail:
      "Vision therapy clinic, Bogotá (2026). Proposal for an at-home therapy platform: 17 user stories with acceptance criteria across patient, therapist and admin roles.",
    href: "https://visual-house-orthopica-1.vercel.app",
  },
  {
    name: "Better Lives, Inc.",
    detail:
      "Home healthcare, Maryland, USA (2026). Researched the business and three competitors and proposed a five-part growth system.",
    href: "https://better-lives-diagnostics.vercel.app",
  },
];

export const engineering = [
  {
    name: "Generator IoT monitoring",
    detail:
      "TETFund-funded final-year project (2023). Firmware lead on a four-person team: per-phase monitoring and remote load switching for a 100kVA three-phase generator.",
  },
  {
    name: "Electricity theft detection",
    detail:
      "With a distribution-company engineer (2025–2026). An embedded system that detects meter bypass and disconnects the supply remotely over GSM.",
  },
];

export const profile = {
  name: "Newman Adesan",
  // Change this to the real address once the site is deployed; share links and the sitemap use it.
  siteUrl: "https://newmanadesan.vercel.app",
  title: "Frontend developer",
  secondTitle: "Software solutions analyst",
  intro:
    "Code is only part of the job. I start from the business process the software has to fit, plan and build the frontend around it, test it, then track whether it actually solved the problem and adjust from there. Recent work: a delivery marketplace through five versions, real-time ambulance dispatch, and school management across more than ten schools.",
  email: "newmanadesan@gmail.com",
  github: "https://github.com/NewmanAdesan",
  linkedin: "https://www.linkedin.com/in/newman-adesan-74ba22210",
  education: "B.Eng. Electrical & Electronics Engineering, Federal University of Technology, Akure (2023)",
};
