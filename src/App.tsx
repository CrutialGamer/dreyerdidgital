import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useSpring } from "framer-motion";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "featured", label: "CRM Demo" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

/* 
==============================================
 DBT Digital — EASY EDIT CONFIG
 Change prices / contact details here.
 All site sections read from this file.
==============================================
*/
export const SITE_CONFIG = {
  brand: "DBT Digital",
  email: "armanddreyer57@gmail.com",          // ← CONTACT FORM MESSAGES GO HERE
  publicEmail: "armanddreyer57@gmail.com",     // business email shown publicly
  whatsapp: "27633413232",                    // ← WhatsApp number (international, no +)
  phoneDisplay: "+27 63 341 3232",
  location: "Johannesburg, South Africa",

  // ── PRICES ── CHANGE HERE ──────────────────
  currency: "R",
  prices: {
    starter: 4999,       // ← CHANGE STARTER PRICE HERE (R4 999)
    business: 7999,      // ← CHANGE BUSINESS PRICE HERE (R7 999)
    premium: 10999,      // ← CHANGE PREMIUM PRICE HERE (R10 999+)
    carePlanMonthly: 499, // ← CARE PLAN /month (R499 p/m)
    domainYearly: 350,   // ← CUSTOM DOMAIN /year (R350 / yr)
  },
  // Format: R4 999
  formatPrice: (n: number) => `R${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,

  // Contact form delivery:
  // 1) FormSubmit.co – free, no signup, sends to email above
  // 2) Change email above to change where messages go
  contactEndpoint: "https://formsubmit.co/ajax/armanddreyer57@gmail.com",
  // Backup: mailto fallback is automatic if API fails

  // ── FEATURED CRM PROJECT DEMO ──────────────
  crmProject: {
    title: "Custom CRM & Sales Pipeline System",
    subtitle: "Full-Stack Web Application",
    url: "https://crm.indleladata.co.za/login?next=%2F",
    demoEmail: "demo@crm.co.za",
    demoPassword: "demo@2026",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel", "Auth & RBAC", "PostgreSQL"],
    description: "A production-grade custom CRM application built for lead pipeline tracking, deal management, client analytics, and team workflows."
  }
};
/* END CONFIG */

const SERVICES = [
  {
    icon: "🎨",
    title: "Website Design",
    blurb: "Beautiful interfaces that convert visitors.",
    bullets: ["Modern UI/UX", "Responsive", "SEO Ready", "Fast Loading"],
    color: "from-[#3B82F6] to-[#06B6D4]"
  },
  {
    icon: "⚙️",
    title: "Website Development",
    blurb: "Scalable builds, managed end-to-end.",
    bullets: ["Business websites", "Landing pages", "Online stores", "Custom dashboards", "Portals", "Web apps"],
    color: "from-[#8B5CF6] to-[#3B82F6]"
  },
  {
    icon: "☁️",
    title: "Website Hosting",
    blurb: "Enterprise-grade infrastructure, zero headaches.",
    bullets: ["Secure hosting", "SSL Certificates", "Daily Backups", "Fast servers", "99.9% uptime"],
    color: "from-[#06B6D4] to-[#8B5CF6]"
  },
  {
    icon: "🛠️",
    title: "Website Maintenance",
    blurb: "Updates handled on request — no forced monthly fees.",
    bullets: ["On-request updates", "Security patches (care plan optional)", "Bug fixes", "Content changes", "Performance tuning"],
    color: "from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4]"
  },
  {
    icon: "📈",
    title: "SEO",
    blurb: "Be found. Be chosen. Be booked.",
    bullets: ["Google optimization", "Meta tags", "Speed optimization", "Sitemap", "Analytics"],
    color: "from-[#06B6D4] to-[#3B82F6]"
  },
  {
    icon: "✨",
    title: "Branding",
    blurb: "A cohesive identity across every touchpoint.",
    bullets: ["Logo Design", "Business Email", "Domain Registration – R350 / yr", "Brand Identity", "CMS access on request"],
    color: "from-[#8B5CF6] to-[#06B6D4]"
  },
];

// PRICING — reads from SITE_CONFIG above.
// To change prices: edit SITE_CONFIG.prices at the top of this file.
const PRICING = [
  {
    name: "Starter",
    price: SITE_CONFIG.formatPrice(SITE_CONFIG.prices.starter),
    note: "Perfect for small businesses.",
    sub: "once-off",
    delivery: "7 days",
    features: [
      "1–5 Pages",
      "Responsive Design",
      "Contact Form",
      "Basic SEO",
      "Free SSL",
      `Custom domain – ${SITE_CONFIG.currency}${SITE_CONFIG.prices.domainYearly} / yr`,
      "Hosting not included"
    ],
    cta: "Start with Starter",
    popular: false
  },
  {
    name: "Business",
    price: SITE_CONFIG.formatPrice(SITE_CONFIG.prices.business),
    note: "Most Popular",
    sub: "once-off",
    delivery: "14 days",
    features: [
      "Everything in Starter",
      "10 Pages",
      "Booking System",
      "Blog",
      "Google Analytics",
      "Hosting Included",
      `Custom domain – ${SITE_CONFIG.currency}${SITE_CONFIG.prices.domainYearly} / yr`,
      "Hosting not included"
    ],
    cta: "Choose Business",
    popular: true
  },
  {
    name: "Premium",
    price: `${SITE_CONFIG.formatPrice(SITE_CONFIG.prices.premium)}+`,
    note: "Fully custom build",
    sub: "once-off",
    delivery: "14–21 days",
    features: [
      "Unlimited Pages",
      "Custom Features",
      "Admin Dashboard",
      "Priority Support",
      "Conversion Optimization",
      "Handoff Docs",
      `Custom domain – ${SITE_CONFIG.currency}${SITE_CONFIG.prices.domainYearly} / yr`
    ],
    cta: "Go Premium",
    popular: false,
    highlight: true
  },
];

const PROCESS = [
  { n: "01", title: "Free Consultation", text: "We unpack your goals, audience and timelines. You get a clear fixed-price proposal in 24h." },
  { n: "02", title: "Planning & Design", text: "Sitemap, wireframes, and a premium pixel-perfect UI designed in Figma. 2 revision rounds included." },
  { n: "03", title: "Development", text: "Clean, performant code. Lighthouse 95+ guaranteed. Built with Next.js & modern stack." },
  { n: "04", title: "Testing", text: "Device matrix QA, accessibility checks, performance audits, and security hardening." },
  { n: "05", title: "Launch", text: "0-downtime deploy, DNS setup, analytics, conversion tracking, full handoff documentation." },
  { n: "06", title: "On-Request Support", text: "Updates are handled by us, on request. No forced maintenance. Self-edit CMS available as a paid add-on." },
];

const FAQS = [
  { q: "Can I update the website myself?", a: "No — by default, all sites are fully managed by DBT Digital. Content updates, security, and changes are handled by our team on request (pay-as-you-go)." },
  { q: "Do your packages include maintenance / updates?", a: "No. All packages are one-time build pricing in South African Rand with a 30-day bug warranty. Ongoing maintenance, security patches, and support are optional." },
  { q: "How long does a website take?", a: "Starter: 7 days. Business: 14 days. Premium: 14–21 days. We move fast without cutting quality." },
  { q: "Can you redesign an existing website?", a: "Absolutely. We audit your current site, preserve SEO equity, migrate content, and rebuild with a modern premium stack." },
  { q: "Do you offer hosting?", a: "Yes. Secure global CDN, SSL, daily backups, 99.9% uptime, and fully managed hosting. Hosting is included in Business & Premium for year 1." },
  { q: "Can you build online stores?", a: "Yes. Shopify headless, WooCommerce, or custom storefronts are all possible. We can scope payments, inventory, subscriptions, and multi-currency flows." },
  { q: "How much is a custom domain?", a: "Custom .co.za / .com domains are R350 per year, managed by us. Includes DNS setup, SSL, and email forwarding setup." },
];

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });
  return <motion.div className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4] origin-left z-[70]" style={{ scaleX }} />;
}

function Counter({ to, suffix="", duration=1.7 }: { to:number, suffix?:string, duration?:number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, to, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1240);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 540);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const c = localStorage.getItem("dd_cookie");
      if (c) setCookieAccepted(true);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] antialiased relative overflow-x-hidden">
      <style>{`
        .display-font { font-family: "Space Grotesk", Inter, system-ui, sans-serif; }
      `}</style>
      <ScrollProgressBar />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-36 -right-28 h-[520px] w-[520px] rounded-full blur-[120px] opacity-[.16]" style={{ background: "radial-gradient(circle at center, #3B82F6 0%, #8B5CF6 52%, transparent 72%)" }} />
        <div className="absolute top-[48%] -left-44 h-[420px] w-[420px] rounded-full blur-[110px] opacity-[.10]" style={{ background: "radial-gradient(circle at center, #06B6D4 0%, #8B5CF6 60%, transparent 80%)" }} />
        <div className="absolute bottom-0 right-1/3 h-[230px] w-[680px] rounded-full blur-[100px] opacity-[.07]" style={{ background: "radial-gradient(circle at center, #8B5CF6 0%, #3B82F6 100%)" }} />
        <div className="qw-grid absolute inset-0 opacity-[0.19]" />
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.4,0,0.2,1] }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#080d19]"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: .5 }}
                className="mx-auto mb-6 relative"
              >
                <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#3B82F6] via-[#7c5cff] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,.34)]">
                  <span className="display-font text-white text-[26px] font-[700] tracking-[-0.04em]">D</span>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-[22px] border border-[#3B82F6]/35"
                  animate={{ scale:[1,1.35,1], opacity:[0.65,0,0.65]}}
                  transition={{ duration: 1.7, repeat: Infinity }}
                />
              </motion.div>
              <div className="display-font text-[17px] text-[#d5e3f6] tracking-tight font-500">DBT Digital</div>
              <div className="text-[11px] text-slate-400 mt-1 tracking-wide">Managed premium builds…</div>
              <div className="w-44 h-[2px] bg-white/10 rounded-full overflow-hidden mx-auto mt-5">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#06B6D4]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1.15, ease: [0.65,0,0.35,1] }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-[60] border-b border-white/[0.075]">
        <div className="backdrop-blur-2xl bg-[#0b1120]/80 qw-noise relative">
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 h-[72px] flex items-center justify-between">
            <a href="#home" className="flex items-center gap-[11px]">
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#3B82F6] via-[#6678ff] to-[#8B5CF6] shadow-[0_0_28px_rgba(95,123,255,.28)] flex items-center justify-center">
                <span className="display-font text-[18px] font-[700] text-white tracking-[-0.02em]">D</span>
              </div>
              <div>
                <div className="display-font text-[18.5px] font-[650] tracking-[-0.016em] leading-5">DBT Digital</div>
                <div className="text-[10.5px] text-[#95a7c4] tracking-[0.15em] font-[500] leading-3">STUDIO</div>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-[28px]">
              {NAV_LINKS.map(l => (
                <a key={l.id} href={`#${l.id}`} className="text-[14.4px] text-[#c9d6ea] hover:text-white transition-colors">{l.label}</a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a href="#contact" className="hidden sm:inline-flex text-[13.5px] font-[600] px-[18px] py-[10px] rounded-full bg-white text-[#0B1120] hover:bg-[#e8eeff] transition-colors">
                Get a Free Quote
              </a>
              <button aria-label="menu" onClick={()=>setMenuOpen(!menuOpen)} className="lg:hidden p-[10px] rounded-xl qw-glass">
                <div className="w-5 flex flex-col gap-[4px]">
                  <span className="h-[2px] bg-white block rounded-full" />
                  <span className="h-[2px] bg-white block rounded-full" />
                  <span className="h-[2px] bg-white block rounded-full" />
                </div>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-t border-white/[0.07] overflow-hidden"
              >
                <div className="px-5 py-4 flex flex-col gap-1.5">
                  {NAV_LINKS.map(l => (
                    <a key={l.id} onClick={()=>setMenuOpen(false)} href={`#${l.id}`} className="py-[11px] text-[15px] text-[#d8e4f6] border-b border-white/[0.06] last:border-0">{l.label}</a>
                  ))}
                  <a href="#contact" onClick={()=>setMenuOpen(false)} className="mt-2 text-center py-[12px] rounded-xl font-[600] bg-white text-[#0b1120]">Start a project</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="relative z-10">
        <section id="home" className="relative">
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 pt-[66px] sm:pt-[100px] pb-[74px]">
            <div className="grid lg:grid-cols-[1.06fr_.94fr] gap-12 lg:gap-8 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: .72, ease:[.22,1,.36,1] }}
                >
                  <div className="inline-flex items-center gap-2 px-[13px] py-[7px] rounded-full qw-glass text-[12px] text-[#bcd3f3] mb-6">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#ffb347] shadow-[0_0_10px_#f59e0b] inline-block" />
                    Managed updates • CMS access on request
                  </div>

                  <h1 className="display-font font-[700] tracking-[-0.027em] leading-[1.035] text-[41px] sm:text-[58px] lg:text-[68px]">
                    Professional<br />
                    <span className="bg-gradient-to-r from-[#6ea8ff] via-[#ab8fff] to-[#5de8ff] bg-clip-text text-transparent">Websites That</span><br />
                    Grow Your Business
                  </h1>

                  <p className="mt-[22px] text-[17.5px] sm:text-[19.5px] leading-relaxed text-[#afbed4] max-w-[560px]">
                    Custom websites, hosting, and professional support — all in one place. Managed updates, on request.
                  </p>

                  <div className="flex flex-wrap gap-3 mt-8">
                    <a href="#contact" className="px-[24px] py-[14px] rounded-full bg-white text-[#0b1427] font-[640] text-[15px] shadow-[0_8px_30px_rgba(255,255,255,.10)] hover:translate-y-[-1px] transition-transform">
                      Get a Free Quote →
                    </a>
                    <a href="#services" className="px-[24px] py-[14px] rounded-full qw-glass font-[560] text-[15px] text-[#dde7f7] hover:bg-white/[.09] transition-colors">
                      View Services
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-[28px] text-[12.8px] text-[#94a7c3]">
                    <div className="flex items-center gap-2">
                      <span className="w-[8px] h-[8px] rounded-full bg-[#6ba8ff]" />
                      <span><strong className="text-[#d8e6ff] font-[620]">Managed by us</strong> — updates on request</span>
                    </div>
                    <span className="hidden sm:inline text-[#5a6b87]">•</span>
                    <span><strong className="text-[#d8e6ff] font-[620]">No forced maintenance</strong></span>
                    <span className="hidden sm:inline text-[#5a6b87]">•</span>
                    <span>Lighthouse 97 avg</span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24, scale: .985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: .9, delay: .17, ease:[.22,1,.36,1] }}
                className="relative"
              >
                <div className="absolute -inset-[44px] rounded-[54px] blur-[60px] opacity-35 bg-[radial-gradient(60%_60%_at_50%_50%,#3B82F655_0%,#8B5CF638_55%,transparent_82%)]" />
                <div className="relative mx-auto w-full max-w-[600px]">
                  <div className="relative rounded-[22px] border border-white/[.15] qw-glass-strong p-[12px] qw-glow-shadow">
                    <div className="rounded-[14px] overflow-hidden bg-[#0f1627] border border-white/[.07]">
                      <div className="flex items-center gap-[7px] px-4 h-[38px] bg-[#121d34] border-b border-white/[.07]">
                        <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                        <span className="w-[11px] h-[11px] rounded-full bg-[#ffbd2e]" />
                        <span className="w-[11px] h-[11px] rounded-full bg-[#28ca42]" />
                        <div className="flex-1 flex justify-center">
                          <div className="w-[300px] max-w-[58%] h-[22px] rounded-[7px] bg-white/[.07] flex items-center px-3 text-[11px] text-[#9fb2d0]">
                            🔒 dreyerdigital.com
                          </div>
                        </div>
                      </div>

                      <div className="relative h-[286px] sm:h-[330px] overflow-hidden bg-gradient-to-br from-[#111a30] via-[#131d36] to-[#101a30]">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: .6 }}
                          className="absolute inset-0 px-6 py-5 sm:px-7"
                        >
                          <div className="flex items-center justify-between text-[11px] text-[#9eb2cf] mb-5">
                            <span className="display-font font-[600] text-[#e7efff]">DREYER</span>
                            <div className="hidden sm:flex gap-5 text-[10.5px]">
                              <span>Work</span><span>Services</span><span>Pricing</span><span className="text-white">Request update</span>
                            </div>
                            <span className="sm:hidden text-[10px] text-white">Support</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-[1.05fr_.95fr] gap-4 sm:gap-5 items-start">
                            <div className="pr-0 sm:pr-2">
                              <div className="text-[9px] text-[#7ea9ff] tracking-wider">MANAGED SUPPORT</div>
                              <div className="display-font text-[20px] sm:text-[22px] leading-tight text-[#eef5ff] mt-1">
                                Premium sites.<br/>Managed updates.<br/>On request.
                              </div>
                              <div className="mt-3 flex gap-2 flex-wrap">
                                <div className="text-[9px] px-[10px] py-[7px] rounded-full bg-white text-[#0d1530] font-[650]">Start project</div>
                                <div className="text-[9px] px-[10px] py-[7px] rounded-full border border-white/[.18] text-[#cfe0ff]">Request quote</div>
                              </div>
                              <div className="mt-4 flex gap-4 text-[9px] text-[#8ea6c8]">
                                <div><div className="text-[#e5eeff] font-[650]">48h</div>update turnaround</div>
                                <div><div className="text-[#e5eeff] font-[650]">On request</div>no monthly lock</div>
                              </div>
                            </div>

                            <div className="relative sm:pt-1">
                              <motion.div
                                animate={{ y: [0,-4,0] }}
                                transition={{ duration: 4, repeat: Infinity, ease:"easeInOut" }}
                                className="rounded-[16px] h-[148px] bg-gradient-to-br from-[#2a395e] to-[#1a2540] border border-white/[.09] overflow-hidden"
                              >
                                <div className="w-full h-full opacity-[.96]" style={{backgroundImage:"linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize:"16px 16px"}} />
                                <div className="absolute inset-0 p-4 text-[9px] text-[#b8c9e6]">
                                  <div className="qw-glass rounded-lg p-2 mb-2">🛠️ Update request – sent</div>
                                  <div className="qw-glass rounded-lg p-2 mb-2">✓ Deployed in 36h</div>
                                  <div className="qw-glass rounded-lg p-2">📊 CMS access – on request</div>
                                </div>
                              </motion.div>
                            </div>
                          </div>

                          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[9px] text-[#94aecf]">
                            {['We update for you','On-request pricing','CMS add-on available'].map(label=>(
                              <div key={label} className="px-3 py-[10px] rounded-[10px] bg-white/[.035] border border-white/[.06] text-center sm:text-left">{label}</div>
                            ))}
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ x:18, opacity:0 }}
                          animate={{ x:0, opacity:1 }}
                          transition={{ delay: .95 }}
                          className="absolute right-[12px] top-[54px] sm:right-[16px] sm:top-[56px] qw-glass-strong rounded-[13px] px-[11px] py-[9px] text-[10px] max-w-[132px]"
                        >
                          <div className="text-[#91aac9]">Self-update?</div>
                          <div className="display-font text-[14px] sm:text-[15px] text-[#ffc36a] font-[700] leading-tight">On request</div>
                        </motion.div>
                        <motion.div
                          initial={{ y:10, opacity:0 }}
                          animate={{ y:0, opacity:1 }}
                          transition={{ delay: 1.1 }}
                          className="absolute left-[12px] bottom-[12px] qw-glass-strong rounded-[13px] px-[11px] py-[9px] text-[10px] max-w-[132px]"
                        >
                          <div className="text-[#91aac9]">Maintenance</div>
                          <div className="display-font text-[12px] sm:text-[13px] text-white font-[700] leading-tight">Not included</div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[13px] mx-[20px] mt-[-1px] bg-gradient-to-b from-[#d4d8e0] to-[#b6bbc6] rounded-b-[18px] shadow-[0_10px_40px_rgba(0,0,0,.55)] relative">
                    <div className="absolute left-1/2 -translate-x-1/2 top-[3px] w-[95px] h-[5px] rounded-full bg-[#9aa1ad]" />
                  </div>
                  <div className="h-[8px] mx-[90px] bg-[#141a27] rounded-b-[8px] blur-[1px]" />
                </div>
              </motion.div>
            </div>

            <div className="mt-14 sm:mt-20 border-t border-white/[.07] pt-8">
              <div className="text-[11.5px] tracking-[0.14em] text-[#8092b2] mb-5">MANAGED UPDATES • NO FORCED MAINTENANCE • CMS ACCESS ON REQUEST</div>
              <div className="flex flex-wrap gap-x-10 gap-y-3 text-[15.5px] text-[#9eb1cf] font-[500] display-font tracking-tight opacity-95">
                <span>monolith®</span>
                <span>Northwind</span>
                <span>forge</span>
                <span>VELVET LAB</span>
                <span>blackwell.</span>
                <span>arc</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-[34px]">
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="rounded-[24px] qw-glass-strong p-[22px] sm:p-[28px] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border border-[#f59e0b]/18">
              <div>
                <div className="display-font text-[22px] sm:text-[25px] font-[660] tracking-tight">Can I update my website myself? <span className="text-[#ffc36a]">No — by default.</span></div>
                <p className="text-[#a8b9d3] text-[14.8px] mt-1.5 max-w-[700px]">All DBT Digital sites are <strong className="text-[#d8e6ff] font-[600]">fully managed by us</strong>. Content updates, security, and changes are handled on-request — not by default as a self-edit system.</p>
              </div>
              <a href="#faq" className="shrink-0 px-5 py-[12px] rounded-full bg-white text-[#0d1530] text-[13.8px] font-[650]">Read the FAQ →</a>
            </div>
          </div>
        </section>

        <section id="services" className="relative py-[72px] sm:py-[96px]">
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="max-w-[680px]">
              <div className="text-[11.5px] tracking-[0.18em] text-[#7da8ff] font-[600]">SERVICES</div>
              <h2 className="display-font text-[34px] sm:text-[44px] leading-[1.08] tracking-[-0.022em] mt-3">
                Everything you need — managed by us.
              </h2>
              <p className="text-[#9db1cc] mt-4 text-[17px] leading-relaxed">
                Strategy, design, engineering, hosting – under one roof. Clean code, elegant UX. Updates on request. Self-edit CMS available as add-on.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[18px] mt-11">
              {SERVICES.map((s) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-[22px] qw-glass-strong p-[24px] transition-all"
                >
                  <div className={`absolute -top-px left-6 right-6 h-[1px] bg-gradient-to-r ${s.color} opacity-70`}/>
                  <div className="text-[24px] mb-3">{s.icon}</div>
                  <div className="display-font text-[21px] font-[640] tracking-tight">{s.title}</div>
                  <div className="text-[13.8px] text-[#9bafc9] mt-[6px]">{s.blurb}</div>
                  <ul className="mt-4 space-y-[8px] text-[13.4px] text-[#c2d3ea]">
                    {s.bullets.map(b => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-[#8fb5ff] flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 text-[12.5px] text-[#94b6f8] font-[600] group-hover:translate-x-[3px] transition-transform">Explore service →</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="featured" className="py-[80px] sm:py-[105px] bg-[#0c1527]/80 border-y border-white/[.07] relative overflow-hidden">
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full qw-glass text-[12px] text-[#86b3ff] mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  LIVE DEMO AVAILABLE
                </div>
                <h2 className="display-font text-[34px] sm:text-[44px] tracking-[-0.022em] mt-1">
                  Featured Build: Custom CRM System
                </h2>
                <p className="text-[#9cb1cd] text-[16.5px] mt-2 max-w-[620px]">
                  Take a look inside a full-stack enterprise CRM web application we built from scratch. Test out the live build with our public demo credentials below.
                </p>
              </div>

              <a
                href={SITE_CONFIG.crmProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-[640] text-[14.5px] hover:shadow-[0_0_30px_rgba(59,130,246,.42)] transition-shadow"
              >
                Launch CRM Live Demo ↗
              </a>
            </div>

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[24px] qw-glass-strong border border-white/[.12] p-4 sm:p-5 relative shadow-2xl"
              >
                <div className="flex items-center justify-between px-3 py-2 bg-[#121c32] rounded-t-[14px] border-b border-white/[.07] text-[11px] text-[#8ea4c5]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="px-3 py-1 rounded-md bg-white/[.06] text-[11px] text-[#9db2d0] font-mono truncate max-w-[240px] sm:max-w-[320px]">
                    🔒 {SITE_CONFIG.crmProject.url}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Live Status</span>
                </div>

                <div className="bg-[#0b1222] rounded-b-[14px] p-5 sm:p-6 border border-white/[.05] relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/[.08] pb-4 mb-5">
                    <div>
                      <div className="display-font font-bold text-[18px] text-white flex items-center gap-2">
                        <span>⚡ Enterprise CRM Suite</span>
                        <span className="text-[10px] bg-[#3B82F6]/20 text-[#7da8ff] border border-[#3B82F6]/30 px-2 py-0.5 rounded-full">v2.4 Live</span>
                      </div>
                      <div className="text-[12px] text-[#8ba2c3] mt-0.5">Multi-tenant lead pipeline & deal management</div>
                    </div>
                    <a
                      href={SITE_CONFIG.crmProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-flex text-[11px] font-[600] text-[#7da8ff] hover:text-white"
                    >
                      Open in tab ↗
                    </a>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="qw-glass rounded-xl p-3 text-center">
                      <div className="text-[10px] text-[#8ba2c3]">Active Deals</div>
                      <div className="display-font text-[18px] sm:text-[22px] font-bold text-white mt-0.5">142</div>
                      <div className="text-[9px] text-emerald-400">+12% this mo</div>
                    </div>
                    <div className="qw-glass rounded-xl p-3 text-center">
                      <div className="text-[10px] text-[#8ba2c3]">Pipeline Value</div>
                      <div className="display-font text-[18px] sm:text-[22px] font-bold text-[#8df5c9] mt-0.5">R2.4M</div>
                      <div className="text-[9px] text-[#8df5c9]">Verified leads</div>
                    </div>
                    <div className="qw-glass rounded-xl p-3 text-center">
                      <div className="text-[10px] text-[#8ba2c3]">Win Rate</div>
                      <div className="display-font text-[18px] sm:text-[22px] font-bold text-[#b5a2ff] mt-0.5">38.4%</div>
                      <div className="text-[9px] text-[#b5a2ff]">Auto tracked</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#182848] to-[#121c32] rounded-xl p-4 border border-white/[.10] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-[13px] font-bold text-white flex items-center gap-1.5">
                        <span>🔑 Demo Login Access Ready</span>
                      </div>
                      <div className="text-[11.5px] text-[#9cb1cd] mt-0.5">
                        Use the demo account to log in and test all features live in your browser.
                      </div>
                    </div>
                    <a
                      href={SITE_CONFIG.crmProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-white text-[#0B1120] font-bold text-[12px] hover:bg-[#e4eeef] transition-colors whitespace-nowrap"
                    >
                      Log in to Demo →
                    </a>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-6">
                <div>
                  <div className="text-[11.5px] tracking-[0.16em] text-[#7da8ff] font-[600] uppercase">System Overview</div>
                  <h3 className="display-font text-[26px] font-[700] text-white mt-1">
                    {SITE_CONFIG.crmProject.title}
                  </h3>
                  <p className="text-[#9cb1cd] text-[14.5px] leading-relaxed mt-2">
                    {SITE_CONFIG.crmProject.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {SITE_CONFIG.crmProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/[.05] border border-white/[.10] text-[12px] text-[#c7d9f2] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="rounded-[20px] qw-glass-strong border border-[#3B82F6]/30 p-5 bg-[#0e192f] shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[13px] font-[700] text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Live Demo Login Details</span>
                    </div>
                    <span className="text-[10.5px] text-[#7da8ff] font-mono">Public Demo Account</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between bg-[#080f1e] border border-white/[.08] rounded-xl px-3.5 py-2.5">
                      <div>
                        <div className="text-[10px] text-[#8097b5] uppercase font-semibold">Login Email</div>
                        <div className="text-[13.5px] text-white font-mono font-medium">{SITE_CONFIG.crmProject.demoEmail}</div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(SITE_CONFIG.crmProject.demoEmail);
                          showToast("Copied demo email to clipboard!");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/[.08] hover:bg-white/[.15] text-[11.5px] text-[#bcd3f3] transition-colors font-medium"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-[#080f1e] border border-white/[.08] rounded-xl px-3.5 py-2.5">
                      <div>
                        <div className="text-[10px] text-[#8097b5] uppercase font-semibold">Login Password</div>
                        <div className="text-[13.5px] text-white font-mono font-medium">{SITE_CONFIG.crmProject.demoPassword}</div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(SITE_CONFIG.crmProject.demoPassword);
                          showToast("Copied demo password to clipboard!");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/[.08] hover:bg-white/[.15] text-[11.5px] text-[#bcd3f3] transition-colors font-medium"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[.07] flex items-center justify-between text-[11.5px]">
                    <span className="text-[#89a2c3]">Ready to test out the application?</span>
                    <a
                      href={SITE_CONFIG.crmProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5b9aff] font-bold hover:underline flex items-center gap-1"
                    >
                      Launch Live App ↗
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[13px] text-[#c5d7ee]">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Lead pipelines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Client management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Role-based auth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Responsive UI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-[42px] sm:py-[62px] border-y border-white/[.07] bg-[#0c1426]/55">
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="text-center mb-7 md:mb-10">
              <div className="text-[11.5px] tracking-[0.18em] text-[#7da8ff] font-[600]">WHY CHOOSE US</div>
              <h2 className="display-font text-[26px] sm:text-[30px] tracking-[-0.020em] mt-2 text-[#dfe9f7]">Proven delivery, boutique care</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 text-center md:text-left">
              <div>
                <div className="display-font text-[34px] sm:text-[40px] font-[700] tracking-[-0.02em]"><Counter to={50} suffix="+" /></div>
                <div className="text-[12.7px] text-[#91a8c5] mt-1">Websites Built</div>
              </div>
              <div>
                <div className="display-font text-[34px] sm:text-[40px] font-[700] tracking-[-0.02em]"><Counter to={99} suffix=".9%" /></div>
                <div className="text-[12.7px] text-[#91a8c5] mt-1">Uptime</div>
              </div>
              <div>
                <div className="display-font text-[30px] sm:text-[36px] font-[700] tracking-[-0.02em]">Fast</div>
                <div className="text-[12.7px] text-[#91a8c5] mt-1">Delivery</div>
              </div>
              <div>
                <div className="display-font text-[28px] sm:text-[34px] font-[700] tracking-[-0.02em]">Fair</div>
                <div className="text-[12.7px] text-[#91a8c5] mt-1">Affordable Pricing</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="display-font text-[28px] sm:text-[34px] font-[700] tracking-[-0.02em]">24/7</div>
                <div className="text-[12.7px] text-[#91a8c5] mt-1">Dedicated Support</div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-[80px] sm:py-[100px] bg-[#0b1426]/60 border-y border-white/[.06]">
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="text-center max-w-[720px] mx-auto">
              <div className="text-[11.5px] tracking-[0.18em] text-[#7da8ff] font-[600]">PRICING</div>
              <h2 className="display-font text-[34px] sm:text-[45px] tracking-[-0.022em] mt-2">Transparent. One-time. No lock-in.</h2>
              <p className="text-[#9db1cc] mt-3 text-[17px]">No maintenance included — updates are on-request. 50% to start, 50% at launch. 30-day bug warranty included.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-[18px] mt-12 items-stretch">
              {PRICING.map((plan)=>(
                <div key={plan.name}
                  className={`relative rounded-[24px] p-[26px] ${plan.popular ? "qw-glass-strong shadow-[0_0_60px_rgba(106,112,255,.14)] scale-[1.018] z-10" : "qw-glass-strong"} ${plan.highlight ? "border border-[#8B5CF6]/30" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 text-[11px] font-[690] tracking-[0.09em] px-[13px] py-[6px] rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white shadow-[0_16px_35px_rgba(81,112,255,.32)]">
                      POPULAR
                    </div>
                  )}
                  <div className="display-font text-[20px] font-[650]">{plan.name}</div>
                  <div className="text-[12.7px] text-[#9aadca] mt-1">{plan.note}</div>
                  <div className="display-font text-[32px] sm:text-[34px] font-[700] tracking-[-0.018em] mt-4 flex items-baseline gap-2">
                    {plan.price}
                    <span className="text-[12px] font-[500] text-[#8ea4c4] tracking-normal">{(plan as any).sub || "ZAR"}</span>
                  </div>
                  <ul className="mt-5 space-y-[10px] text-[13.8px] text-[#c2d3ea]">
                    {plan.features.map(f => (
                      <li key={f} className="flex gap-[10px]">
                        <span className="text-[#6bd2a9] mt-[1px]">✓</span><span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className={`mt-7 w-full inline-flex justify-center rounded-[13px] px-4 py-[13px] font-[630] text-[14px] transition ${plan.popular ? "bg-white text-[#0d1530] hover:bg-[#e8efff]" : "bg-white/[0.06] text-[#edf4ff] hover:bg-white/[0.10]"}`}>
                    {plan.cta}
                  </a>
                  <div className="text-[11.3px] text-[#7f91ad] mt-3 text-center">{plan.delivery} delivery • unlimited revisions • updates on-request</div>
                </div>
              ))}
            </div>

            <div className="mt-8 max-w-[860px] mx-auto rounded-[18px] qw-glass px-5 py-4 text-[13.5px] text-[#a8bad4] text-center leading-relaxed">
              <strong className="text-[#d4e4ff]">Hosting prices:</strong> <span className="text-[#bfe7d2]">R199 p/m</span> to <span className="text-[#ffd18a]">R1 200 / year</span>.<br/>
              <strong className="text-[#d4e4ff]">No maintenance included in any package.</strong> Updates are handled on-request, billed per task.<br/>
              Optional Care Plan: <span className="text-[#bfe7d2]">R499 p/m</span> — security patches, backups, performance checks, priority content changes.<br/>
              <span className="text-[#ffc36a]">Self-edit CMS access available on request as a one-time add-on.</span><br/>
              <span className="text-[#ffd18a]">Custom domains: R350 / year</span> • First-year domain FREE with Business & Premium.
            </div>

            <div className="text-center text-[12.8px] text-[#8b9fbd] mt-5">
              Need custom? <a href="#contact" className="text-[#a8c8ff] underline underline-offset-4">Get a tailored quote</a> — Enterprise, SaaS, marketplaces.
            </div>
          </div>
        </section>

        <section className="py-[84px] sm:py-[105px]">
          <div className="max-w-[1020px] mx-auto px-5 sm:px-8 lg:px-10">
            <div className="text-center mb-12">
              <div className="text-[11.5px] tracking-[0.18em] text-[#7da8ff] font-[600]">PROCESS</div>
              <h2 className="display-font text-[34px] sm:text-[43px] tracking-[-0.022em] mt-2">A clean, senior-run process.</h2>
            </div>

            <div className="relative">
              <div className="absolute left-[16px] sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#3B82F6]/80 via-[#8B5CF6]/60 to-transparent" />
              <div className="space-y-8">
                {PROCESS.map((st, i) => (
                  <motion.div
                    key={st.n}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`relative sm:grid sm:grid-cols-2 gap-10 items-start`}
                  >
                    <div className={`pl-11 sm:pl-0 ${i % 2 === 1 ? "sm:col-start-2 sm:pl-12" : "sm:text-right sm:pr-12"}`}>
                      <div className="text-[11px] tracking-[0.17em] text-[#70a2ff]">{st.n}</div>
                      <div className="display-font text-[20px] font-[640] mt-1">{st.title}</div>
                      <div className="text-[14.3px] text-[#9ab2cf] mt-2 leading-relaxed">{st.text}</div>
                    </div>
                    <div className="absolute left-[8px] sm:left-1/2 sm:-translate-x-1/2 top-[4px]">
                      <div className="w-[18px] h-[18px] rounded-full bg-[#0b1120] border-[3px] border-[#6ea3ff] shadow-[0_0_18px_#3b82f64a]" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-[78px] sm:py-[100px] bg-[#0b1426]/62 border-y border-white/[.06]">
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 grid lg:grid-cols-[1.05fr_.95fr] gap-12 items-center">
            <div>
              <div className="text-[11.5px] tracking-[0.18em] text-[#7da8ff] font-[600]">ABOUT DBT Digital</div>
              <h2 className="display-font text-[33px] sm:text-[41px] tracking-[-0.021em] mt-3 leading-[1.12]">A boutique web studio shipping agency-grade work — managed for you.</h2>
              <p className="text-[#9db0cc] mt-4 text-[16.6px] leading-relaxed">
                We build, design, and host professional websites for ambitious businesses, creators, and startups. From razor-sharp landing pages to complex portals and e-commerce — managed end-to-end with a clear, senior-led process.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-8 text-[13.8px] text-[#c5d6ec]">
                {[
                  ["We update it", "On-request changes, 48h avg turnaround."],
                  ["Performance-first", "Core Web Vitals green out-of-the-box."],
                  ["Secure by default", "SSL, backups, WAF, monitoring."],
                  ["No lock-in", "Full code ownership. CMS access on request."],
                ].map(([t, d])=>(
                  <div key={t} className="rounded-[16px] qw-glass p-[16px]">
                    <div className="font-[640] text-[#e9f0ff]">{t}</div>
                    <div className="text-[#9ab0cb] mt-1">{d}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[26px] qw-glass-strong p-[24px]">
                <div className="text-[12px] text-[#8da5c8] tracking-[0.12em]">STACK</div>
                <div className="mt-4 flex flex-wrap gap-[10px] text-[12.5px]">
                  {["Next.js","React","TypeScript","Tailwind","Framer Motion","Node","Postgres","Vercel","Shopify","Stripe","Sanity","Figma"].map(n=>(
                    <span key={n} className="px-[12px] py-[7px] rounded-full bg-white/[.055] border border-white/[.09] text-[#d2e2f9]">{n}</span>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-3 text-center gap-4">
                  <div><div className="display-font text-[24px] font-[700]">50+</div><div className="text-[11px] text-[#8fa6c3]">Projects</div></div>
                  <div><div className="display-font text-[24px] font-[700]">4.9★</div><div className="text-[11px] text-[#8fa6c3]">Avg rating</div></div>
                  <div><div className="display-font text-[24px] font-[700]">48h</div><div className="text-[11px] text-[#8fa6c3]">Avg reply</div></div>
                </div>
                <div className="mt-5 text-[12.6px] text-[#9db3cf] bg-white/[0.035] rounded-[12px] px-3 py-3 border border-white/[0.06]">
                  <strong className="text-[#dbe7ff]">Maintenance? On request.</strong> No packages include maintenance. Care Plan <strong className="text-[#bfe7d2]">R499 p/m</strong> optional. Self-edit CMS access is a paid add-on when needed.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-[76px] sm:py-[96px] bg-[#0b1426]/62 border-y border-white/[.06]">
          <div className="max-w-[900px] mx-auto px-5 sm:px-8">
            <div className="text-center mb-9">
              <div className="text-[11.5px] tracking-[0.18em] text-[#7da8ff] font-[600]">FAQ</div>
              <h2 className="display-font text-[33px] sm:text-[42px] tracking-[-0.021em] mt-2">Answers, up front.</h2>
              <p className="text-[#9db1cc] mt-2">No — you can’t self-edit by default. We manage updates. CMS access available on request.</p>
            </div>
            <FaqAccordion items={FAQS} />
          </div>
        </section>

        <section id="contact" className="py-[82px] sm:py-[108px]">
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 grid lg:grid-cols-[.9fr_1.1fr] gap-10 items-start">
            <div>
              <div className="text-[11.5px] tracking-[0.18em] text-[#7da8ff] font-[600]">CONTACT</div>
              <h2 className="display-font text-[34px] sm:text-[42px] tracking-[-0.022em] mt-2 leading-[1.09]">Tell us about your project.</h2>
              <p className="text-[#9db0cc] mt-3 text-[16.8px]">Response in under 24 hours. We’ll send a scoped proposal and timeline — no fluff. Managed updates included on request.</p>

              <div className="mt-8 space-y-[14px] text-[14.5px] text-[#c7d7eb]">
                <div className="flex items-center gap-3">
                  <span className="w-[36px] h-[36px] rounded-[11px] qw-glass flex items-center justify-center">📩</span>
                  <div>
                    <a href={`mailto:${SITE_CONFIG.publicEmail}`} className="hover:text-white">{SITE_CONFIG.publicEmail}</a>
                    <div className="text-[11px] text-[#7d92b0]">Form messages → {SITE_CONFIG.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-[36px] h-[36px] rounded-[11px] qw-glass flex items-center justify-center">💬</span>
                  <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp Business (instant): {SITE_CONFIG.phoneDisplay}</a>
                </div>
                <div className="flex items-center gap-3"><span className="w-[36px] h-[36px] rounded-[11px] qw-glass flex items-center justify-center">📍</span> {SITE_CONFIG.location} • Remote-friendly</div>
              </div>

              <div className="mt-7 flex gap-3">
                {[
                  ["X","https://x.com/"],
                  ["in","https://linkedin.com/"],
                  ["gh","https://github.com/"],
                  ["ig","https://instagram.com/"],
                ].map(([l, href]) => (
                  <a key={l} href={href} target="_blank" rel="noreferrer" className="w-[42px] h-[42px] rounded-[13px] qw-glass flex items-center justify-center text-[12px] font-[700] text-[#b9ccdf] hover:text-white hover:bg-white/[.05] transition-colors">{l}</a>
                ))}
              </div>

              <div className="mt-7 rounded-[16px] qw-glass p-4 text-[13.6px] text-[#b6c8e2] leading-relaxed">
                <strong className="text-[#e6efff]">Can I update my website myself?</strong><br/><span className="text-[#ffc36a]">No — by default.</span> We handle all updates on request.<br/>
                <strong className="text-[#e6efff] mt-[10px] inline-block">Maintenance included?</strong><br/>No — packages are build-only. Care Plan <strong className="text-[#bfe7d2]">R499 p/m</strong> optional.<br/>
                <strong className="text-[#e6efff] mt-[10px] inline-block">Self-edit CMS?</strong><br/>Available on request as a paid add-on.<br/>
                <strong className="text-[#e6efff] mt-[10px] inline-block">Custom domain?</strong><br/><span className="text-[#ffd18a]">R350 / year</span> — first year free with Business & Premium.
              </div>
            </div>

            <ContactForm onSuccess={()=>showToast("Message sent. We’ll reply within 24 hours!")} />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[.07] bg-[#08111f]/95 relative">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 py-[52px]">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-[10px] mb-3">
                <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white font-[700] display-font">D</div>
                <span className="display-font text-[17px] font-[680]">DBT Digital</span>
              </div>
              <p className="text-[13.5px] text-[#8fa3be] leading-relaxed">Managed websites that grow your business. Design • Dev • Hosting • On-request support.</p>
            </div>

            <div>
              <div className="text-[12px] tracking-[0.14em] text-[#85a0c4] mb-3">QUICK LINKS</div>
              <ul className="space-y-[9px] text-[13.7px] text-[#b9cadd]">
                {NAV_LINKS.map(l=> <li key={l.id}><a className="hover:text-white" href={`#${l.id}`}>{l.label}</a></li>)}
              </ul>
            </div>

            <div>
              <div className="text-[12px] tracking-[0.14em] text-[#85a0c4] mb-3">SERVICES</div>
              <ul className="space-y-[9px] text-[13.7px] text-[#b9cadd]">
                <li>Website Design</li>
                <li>Web Development</li>
                <li>Hosting & Support</li>
                <li>SEO & Branding</li>
              </ul>
            </div>

            <div>
              <div className="text-[12px] tracking-[0.14em] text-[#85a0c4] mb-3">NEWSLETTER</div>
              <p className="text-[13.2px] text-[#8fa3be] mb-3">Monthly build notes & launch recaps.</p>
              <form onSubmit={(e)=>{e.preventDefault(); showToast("Subscribed! Check your inbox.")}} className="flex gap-[8px]">
                <input required type="email" placeholder="your@email.com" className="flex-1 bg-white/[.055] border border-white/[.12] rounded-[11px] px-[12px] py-[10px] text-[13.4px] outline-none placeholder:text-[#7a8ea8] text-white" />
                <button className="px-[14px] py-[10px] rounded-[11px] bg-white text-[#0d1630] text-[13px] font-[650]">→</button>
              </form>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[.075] mt-10 pt-6 text-[12.7px] text-[#7f91aa]">
            <div>© {new Date().getFullYear()} DBT Digital. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#c2d6ef]">Privacy Policy</a>
              <a href="#" className="hover:text-[#c2d6ef]">Terms</a>
              <a href="#" className="hover:text-[#c2d6ef]">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <a
        href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
        target="_blank" rel="noreferrer"
        className="fixed bottom-[18px] right-[18px] z-[55] w-[56px] h-[56px] rounded-full bg-[#1fc96a] text-white flex items-center justify-center text-[25px] shadow-[0_10px_28px_rgba(22,193,90,.38)]"
        aria-label="Chat on WhatsApp"
      >
        ✆
      </a>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={()=>window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed right-[18px] bottom-[86px] z-[55] w-[46px] h-[46px] rounded-full qw-glass-strong flex items-center justify-center text-[18px]"
            aria-label="Back to top"
          >↑</motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!cookieAccepted && (
          <motion.div
            initial={{ y: 44, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 44, opacity: 0 }}
            className="fixed left-3 right-3 sm:left-5 sm:right-auto sm:max-w-[460px] bottom-3 sm:bottom-5 z-[66] qw-glass-strong rounded-[18px] p-[16px] shadow-[0_10px_40px_rgba(0,0,0,.45)]"
            role="dialog" aria-live="polite"
          >
            <div className="text-[13.8px] text-[#d3e1f6] leading-relaxed">
              <strong className="font-[640]">Cookie note</strong><br/>
              We use essential cookies to analyze traffic and improve your experience. No trackers sold.
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={()=>{ localStorage.setItem("dd_cookie","yes"); setCookieAccepted(true); }}
                className="px-[14px] py-[9px] rounded-[10px] bg-white text-[#0f1630] text-[12.8px] font-[640]"
              >
                Accept
              </button>
              <button
                onClick={()=>{ localStorage.setItem("dd_cookie","essential"); setCookieAccepted(true); }}
                className="px-[14px] py-[9px] rounded-[10px] qw-glass text-[12.8px] text-[#d6e4f6]"
              >
                Essential only
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            className="fixed z-[90] top-[82px] left-1/2 -translate-x-1/2 qw-glass-strong rounded-[14px] px-[16px] py-[12px] text-[13.6px] text-[#e3edff] shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqAccordion({ items }: { items: {q:string,a:string}[] }) {
  const [open, setOpen] = useState<number>(0);
  return (
    <div className="space-y-[12px]">
      {items.map((f, i) => (
        <div key={i} className="rounded-[16px] qw-glass-strong overflow-hidden">
          <button
            onClick={()=>setOpen(open===i ? -1 : i)}
            className="w-full flex items-center justify-between text-left px-[18px] py-[16px]"
            aria-expanded={open===i}
          >
            <span className="display-font text-[16.8px] font-[560] pr-6">{f.q}</span>
            <motion.span animate={{ rotate: open===i ? 45 : 0 }} className="text-[22px] text-[#9fb8df] leading-none">+</motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open===i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-[18px] pb-[18px] text-[14.8px] text-[#a9bccf] leading-relaxed">{f.a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function ContactForm({ onSuccess }: { onSuccess: ()=>void }) {
  const [sending,setSending]=useState(false);
  const [form,setForm]=useState({
    name:"", business:"", email:"", phone:"", service:"Website Development", budget:"R5k – R8k", details:""
  });
  const [errors,setErrors]=useState<Record<string,string>>({});

  const validate = () => {
    const e:Record<string,string> = {};
    if(!form.name.trim()) e.name = "Required";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if(form.details.trim().length < 18) e.details = "Add a bit more detail (18+ chars)";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const [submitError, setSubmitError] = useState<string|null>(null);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError(null);
    if(!validate()) return;
    setSending(true);
    try {
      const res = await fetch(SITE_CONFIG.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: form.name,
          business: form.business,
          email: form.email,
          phone: form.phone,
          service: form.service,
          budget: form.budget,
          message: form.details,
          _subject: `New DBT Digital quote — ${form.name} / ${form.service}`,
          _captcha: "false",
          _template: "table",
          _replyto: form.email,
        })
      });
      if (!res.ok) throw new Error("send failed");
      setSending(false);
      onSuccess();
      setForm({name:"",business:"",email:"",phone:"",service:"Website Development",budget:"R5k – R8k",details:""});
    } catch (err) {
      setSending(false);
      const body = encodeURIComponent(
`Name: ${form.name}
Business: ${form.business}
Email: ${form.email}
Phone: ${form.phone}
Service: ${form.service}
Budget: ${form.budget}

Project Details:
${form.details}`
      );
      window.location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent("DBT Digital – Project Brief: " + form.name)}&body=${body}`;
      setSubmitError("Email client opened as backup. We also tried to send online.");
      setTimeout(()=>{ onSuccess(); }, 900);
    }
  };

  const fieldCls = "w-full bg-[#0f1a2d] border border-white/[.12] rounded-[13px] px-[14px] py-[12px] text-[14.2px] text-white placeholder:text-[#7689a7] outline-none focus:border-[#5a97ff] transition-colors";
  const labelCls = "block text-[12.4px] text-[#94a9c5] mb-[6px] font-[550]";

  return (
    <form onSubmit={submit} className="rounded-[24px] qw-glass-strong p-[22px] sm:p-[28px] relative qw-glow-shadow" noValidate>
      <div className="grid sm:grid-cols-2 gap-[14px]">
        <div>
          <label className={labelCls}>Name *</label>
          <input className={fieldCls} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Jane Doe" />
          {errors.name && <div className="text-[11.7px] text-rose-300 mt-1">{errors.name}</div>}
        </div>
        <div>
          <label className={labelCls}>Business Name</label>
          <input className={fieldCls} value={form.business} onChange={e=>setForm({...form,business:e.target.value})} placeholder="Acme Inc." />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input type="email" className={fieldCls} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com" />
          {errors.email && <div className="text-[11.7px] text-rose-300 mt-1">{errors.email}</div>}
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input className={fieldCls} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+27 82 000 0000" />
        </div>
        <div>
          <label className={labelCls}>Service Required</label>
          <select className={fieldCls} value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
            {["Website Design","Website Development","Website Hosting","Website Maintenance","SEO","Branding","Online Store","Custom Web App","CMS Access (add-on)"].map(o=> <option key={o} className="bg-[#0f1a2d]">{o}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Budget (ZAR)</label>
          <select className={fieldCls} value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}>
            {["Under R5k","R5k – R8k","R8k – R12k","R12k – R20k","R20k+"].map(o=> <option key={o} className="bg-[#0f1a2d]">{o}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Project Details *</label>
          <textarea rows={5} className={fieldCls + " resize-y"} value={form.details} onChange={e=>setForm({...form,details:e.target.value})} placeholder="Tell us about goals, pages, deadline, and any features you need." />
          {errors.details && <div className="text-[11.7px] text-rose-300 mt-1">{errors.details}</div>}
        </div>
      </div>
      <button disabled={sending} className="mt-5 w-full py-[14px] rounded-[13px] bg-white text-[#0e1730] font-[680] text-[15px] hover:bg-[#e8efff] transition disabled:opacity-70">
        {sending ? "Sending…" : "Send Project Brief →"}
      </button>
      {submitError && (
        <div className="text-[12px] text-amber-200 mt-3 text-center bg-amber-500/10 border border-amber-400/20 rounded-[10px] px-3 py-2">
          {submitError}
        </div>
      )}
      <div className="text-[11px] text-[#8096b5] mt-3 text-center leading-relaxed">
        Messages sent to: <span className="text-[#b8cced]">{SITE_CONFIG.email}</span><br/>
        Full code ownership • Updates on request • Self-edit CMS add-on.
      </div>
    </form>
  );
}
