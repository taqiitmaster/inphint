// ── Contact ────────────────────────────────────────────────
export const CONTACT = {
  email: 'inphint@gmail.com',
  whatsapp: '+92 326 0251540',
  whatsappLink: 'https://wa.me/923260251540',
  instagram: 'https://www.instagram.com/inphint/',
  linkedin: 'https://www.linkedin.com/company/inphint/',
  facebook: 'https://www.facebook.com/profile.php?id=61575874866783',
}

// ── Services (secondary grid; AI automation is the featured block) ──
export const SERVICES = [
  { lab: 'Build', t: 'Web development', d: 'Fast, scalable sites and apps that convert — from a launch page to a full platform.',
    sub: ['WordPress', 'Custom sites', 'React apps', 'Shopify', 'WooCommerce', 'Maintenance'],
    icon: '<path d="M3 5h18v14H3z"/><path d="M3 9h18"/><path d="M7 7h.01"/>' },
  { lab: 'Identity', t: 'Branding & design', d: 'Brands people remember — logos, systems and every asset that carries your name.',
    sub: ['Logo design', 'Brand identity', 'Social design', 'Packaging', 'Company profiles'],
    icon: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>' },
  { lab: 'Growth', t: 'Social media marketing', d: 'Content and paid campaigns that fill your pipeline — measured to the dollar.',
    sub: ['Content', 'Account management', 'Meta ads', 'Lead generation', 'Campaigns'],
    icon: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>' },
  { lab: 'Visibility', t: 'SEO', d: 'Technical and content SEO that earns rankings you keep — not tricks that fade.',
    sub: ['On-page', 'Off-page', 'Technical', 'Local'],
    icon: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>' },
  { lab: 'Story', t: 'Video editing', d: 'Scroll-stopping edits — reels, ads and brand films cut for attention.',
    sub: ['Reels', 'Commercials', 'Promos', 'YouTube', 'Motion graphics'],
    icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/>' },
  { lab: 'Reliability', t: 'Web hosting', d: 'Managed, secure hosting with backups and monitoring — so your site just stays up.',
    sub: ['Managed hosting', 'Security', 'Backups', 'Maintenance'],
    icon: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>' },
]

// ── AI automation flagship services (chips shown in the AI feature block) ──
export const AI_CHIPS = [
  'AI chat agents', 'AI voice agents', 'Lead-response agents', 'Booking & appointment agents',
  'Customer-support agents', 'Follow-up & reminder automation', 'Email automation', 'WhatsApp & SMS automation',
  'CRM automation', 'Data & document automation', 'Invoice & quote automation', 'Renewal & retention automation',
  'Social & content automation', 'Reporting & analytics automation', 'Workflow automation',
]

// ── AI projects (tileable — add more here in future) ──
export const AI_PROJECTS = [
  {
    title: 'AI renewal & lead engine for an independent insurance broker',
    tag: 'AI automation · live project',
    demo: 'https://docs.google.com/forms/d/e/1FAIpQLSeJmO379znX5fjLM4yBaoVBJVLo5hU1E2CCct2dhszNOhNeYg/viewform?usp=publish-editor',
    features: [
      'AI lead response', 'Automatic follow-ups', 'Daily renewal engine', 'Personalised draft messages',
      'All product lines in one view', 'Business intelligence', 'You stay in control',
    ],
  },
  {
    title: '24/7 AI customer support agent',
    tag: 'AI automation · live project',
    demo: 'https://docs.google.com/forms/d/e/1FAIpQLSdiFfnjnIkUzsLEoW0IHGUcbCNGi24sNllcrT1KTChN9HnUDQ/viewform?usp=publish-editor',
    features: [
      'Omnichannel — web, Instagram, Messenger, WhatsApp', 'Instant FAQ responses', 'Order tracking',
      'Product recommendations', 'Size & fit assistance', 'Returns & exchanges', 'Cart recovery',
      'Lead capture', 'Upselling & cross-selling', 'Smart escalation to humans', 'Post-purchase feedback',
      'Review request automation', 'Customer insights', 'Analytics dashboard', '24/7 availability',
    ],
  },
]

// ── Client project grid ──
export const CATLABEL = { ai: 'AI automation', web: 'Web', brand: 'Branding', mktg: 'Marketing' }

export const PROJECTS = [
  { t: 'Tycoon Estate', img: 'tycoon', cats: ['web', 'mktg'], url: 'https://tycoonestate.com.au/' },
  { t: "Luke's Renovations", img: 'luke', cats: ['mktg'], url: 'https://www.instagram.com/lukesrenovations/' },
  { t: 'Gaming Associates', img: 'gaming', cats: ['web', 'brand'], url: 'https://gamingassociates.com/' },
  { t: 'Kolachi Grill', img: 'kolachi', cats: ['web', 'brand', 'mktg'], url: 'https://kolachigrill.com.au/' },
  { t: 'Rosetas Bouquets', img: 'rosetas', cats: ['mktg'], url: 'https://www.instagram.com/rosetas.bouquets/' },
  { t: 'Lenex Steel', img: 'lenex', cats: ['web', 'brand'], url: 'https://lenexsteel.com/' },
  { t: 'Rodeo Plumbing', img: 'rodeo', cats: ['web'], url: 'https://rodeo-plumbing.com/' },
  { t: 'Prime Audit', img: 'prime', cats: ['web', 'brand'], url: 'https://primeaudit.com.au/' },
  { t: 'Ardyno', img: 'ardyno', cats: ['web', 'mktg', 'brand'], url: 'https://ardynoshop.com/' },
  { t: 'USA Waterfire', img: 'usawaterfire', cats: ['web'], url: 'https://usawaterfire.wpenginepowered.com/' },
  { t: 'SSS Foods', img: 'sss', cats: ['mktg'], url: 'https://sssfoods.com.au/' },
  { t: 'Ali Gul Soomro Landscaping', img: 'aligul', cats: ['brand'], url: '' },
  { t: 'Jalsa Foods', img: 'jalsa', cats: ['mktg'], url: 'https://www.jalsafoods.com.au/' },
]

// ── Inphox chatbot ──
// Note: the AI's full knowledge/system prompt now lives in server/chatSystem.js
// (kept server-side so the API key and prompt never ship to the browser, and so
// Vercel's function bundler — which only reliably includes files under server/ —
// can always find it). This file keeps only the offline keyword fallback below,
// used when the live API is briefly unavailable.

export function fallback(qRaw) {
  const q = qRaw.toLowerCase()
  const C = 'email inphint@gmail.com or WhatsApp +92 326 0251540 — you\'ll hear back within 12 hours'
  if (/instagram|insta\b/.test(q)) return 'Here\'s our Instagram: https://www.instagram.com/inphint/'
  if (/linkedin/.test(q)) return 'Here\'s our LinkedIn: https://www.linkedin.com/company/inphint/'
  if (/facebook|\bfb\b/.test(q)) return 'Here\'s our Facebook: https://www.facebook.com/profile.php?id=61575874866783'
  if (/whatsapp|whats app|\bnumber\b|phone|mobile|call you/.test(q)) return 'You can reach us on WhatsApp at +92 326 0251540 (https://wa.me/923260251540), or email inphint@gmail.com — we reply within 12 hours.'
  if (/all.*link|your link|socials|social media link|follow you|profiles/.test(q)) return 'Here\'s everything — Email: inphint@gmail.com · WhatsApp: +92 326 0251540 · Instagram: https://www.instagram.com/inphint/ · LinkedIn: https://www.linkedin.com/company/inphint/ · Facebook: https://www.facebook.com/profile.php?id=61575874866783'
  if (/\bfounder\b|\bceo\b|\bowner\b|who runs|who started|who owns|when.*(found|establish)|how old/.test(q)) return 'We\'re a small, senior in-house team — that\'s really the focus rather than any one name. Happy to tell you more about how we work if that\'d help.'
  if (/price|cost|budget|how much|quote|rate|charge|pricing|\bfee|payment/.test(q)) return 'Pricing depends entirely on your project and scope, so I can\'t give a number here — ' + C + ' for a tailored quote.'
  if (/automat|\bai\b|agent|chatbot|\bbot\b|voice|workflow/.test(q)) return 'We build the full range of AI automation — chat agents, voice agents, booking agents, customer-support agents, email/WhatsApp automation, CRM automation, workflow automation, all running 24/7. What kind of task are you looking to automate?'
  if (/web|site|website|shopify|react|wordpress|\bapp\b|ecommerce|e-commerce|store|landing/.test(q)) return 'We build fast, responsive websites and apps — WordPress, custom sites, React apps, Shopify and WooCommerce stores, SaaS products, the works. What are you looking to build?'
  if (/brand|logo|design|identity|packag|graphic/.test(q)) return 'Our branding work covers logos, full identity systems, guidelines, social design, packaging — you get all the source files too.'
  if (/seo|rank|google|search engine/.test(q)) return 'We handle on-page, technical, off-page and local SEO — built to earn rankings you actually keep, not shortcuts that fade.'
  if (/market|\bads\b|social media marketing|\blead|campaign/.test(q)) return 'We run content and paid Meta campaigns focused on real leads, with clear reporting so you can see what\'s working.'
  if (/video|reel|editing|youtube|motion/.test(q)) return 'We edit reels, commercials, promos, YouTube videos and motion graphics — can work from footage you already have too.'
  if (/host|server|uptime|maintenance|backup|security/.test(q)) return 'We offer managed, secure hosting with backups, monitoring, and ongoing maintenance — so your site just stays up.'
  if (/experience|expertise|how long.*(experience|been)|years/.test(q)) return 'Our team brings 10+ years of combined experience across design, engineering and marketing.'
  if (/how many (people|members|staff|employees)|team size|how big.*team|\bteam\b|employ|staff/.test(q)) return 'We\'re a team of 15+ full-time designers, engineers and marketers, all in-house — nothing outsourced.'
  if (/process|how.*work|steps|timeline|how long.*(take|project)/.test(q)) return 'Our process is Discovery, Strategy, Build, Launch, Grow — with weekly updates along the way. Timelines really depend on scope, happy to talk through yours.'
  if (/where|country|countries|location|based|region/.test(q)) return 'We\'re remote-first and work with clients across the USA, Canada, Europe and Australia.'
  if (/\bbook\b|\bcall\b|consult|get started|begin|start a project/.test(q)) return 'Best next step is a free discovery call — ' + C + ' and we\'ll set it up.'
  if (/email|mail\b|reach|get in touch|contact/.test(q)) return 'You can ' + C + '.'
  if (/what.*(do|offer)|services|help\b/.test(q)) return 'We build AI automation, websites, brands, marketing, SEO, video and hosting — AI automation is what most people come to us for first. What are you working on?'
  if (/^(hi|hey|hello|yo|sup|salam|asalam|assalam)/.test(q)) return 'Hey! I\'m Inphox. Ask me anything about AI automation, websites, branding, marketing, SEO, video or hosting — or just tell me what you\'re working on.'
  return 'Good question — that one\'s worth a real conversation with the team so you get exactly the right answer. ' + C + '.'
}
