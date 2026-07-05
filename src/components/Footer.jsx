"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Send, ChevronUp, Sparkles, Globe } from "lucide-react";

// ─── Social icons — all inline SVGs (version-safe) ───────
const TwitterIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedInIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const PortfolioIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M7 8h.01M11 8h6" />
    <path d="M7 12h.01M11 12h6" />
  </svg>
);

// ─── Luminary icon (matches Navbar) ──────────────────────
const LuminaryIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
    <circle cx="19" cy="19" r="18" fill="rgba(244,196,48,0.12)" stroke="rgba(244,196,48,0.3)" strokeWidth="0.8" />
    <path d="M19 8 L22.5 16 L19 13.5 L15.5 16 Z" fill="#F4C430" />
    <path d="M19 13.5 L19 27" stroke="#F4C430" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M13.5 30 L24.5 30" stroke="rgba(244,196,48,0.45)" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="19" cy="8" r="2.2" fill="#F4C430" />
    <path d="M13 10.5 L8.5 8.5" stroke="rgba(244,196,48,0.5)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M25 10.5 L29.5 8.5" stroke="rgba(244,196,48,0.5)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// ─── Book spines — client-only (avoids Math.sin hydration mismatch) ─
function BookSpines() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const spines = Array.from({ length: 11 }, (_, i) => ({
    right: i * 16,
    height: Math.round((60 + Math.sin(i * 1.1) * 40 + i * 9) * 100) / 100,
    alpha: parseFloat((0.04 + i * 0.012).toFixed(3)),
  }));
  return (
    <div className="absolute bottom-0 right-0 pointer-events-none hidden sm:block"
      style={{ width: 180, height: 260, zIndex: 1, opacity: 0.5 }} aria-hidden="true">
      {spines.map((s, i) => (
        <div key={i} className="absolute bottom-0" style={{
          right: s.right, width: 3, height: `${s.height}px`,
          background: `rgba(244,196,48,${s.alpha})`, borderRadius: "2px 2px 0 0",
        }} />
      ))}
    </div>
  );
}

// ─── Copyright year — client-only (avoids SSR date mismatch) ─
function CopyrightYear() {
  const [year, setYear] = useState(null);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year ?? "2025"}</>;
}

// ─── Animated stat counter ────────────────────────────────
function CountUp({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    const raf = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── Newsletter ───────────────────────────────────────────
function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setState("sending");
    setTimeout(() => { setState("done"); setEmail(""); }, 1200);
  };
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-3"
        style={{ color: "#F4C430", fontFamily: "'Inter',sans-serif" }}>
        Weekly reading picks
      </p>
      <p className="text-[12.5px] leading-relaxed mb-4"
        style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}>
        Curated ebooks, rising writers, and genre spotlights — every Sunday.
      </p>
      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-[12.5px] font-medium"
            style={{ background: "rgba(16,185,129,0.1)", border: "0.5px solid rgba(16,185,129,0.25)", color: "#10B981" }}>
            <Sparkles size={13} />
            You&apos;re on the list. See you Sunday.
          </motion.div>
        ) : (
          <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onSubmit={handleSubmit} className="flex flex-col xs:flex-row gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 min-w-0 px-4 py-2.5 rounded-[9px] text-[12.5px] outline-none transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)",
                color: "#F8FAFC", fontFamily: "'Inter',sans-serif" }}
              onFocus={e => (e.target.style.borderColor = "rgba(244,196,48,0.4)")}
              onBlur={e  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              type="submit" disabled={state === "sending"}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[9px] text-[12px] font-semibold flex-shrink-0"
              style={{ background: "#F4C430", color: "#07070E",
                fontFamily: "'Inter',sans-serif", opacity: state === "sending" ? 0.7 : 1 }}>
              {state === "sending" ? <span className="lum-spinner" /> : <Send size={12} strokeWidth={2.2} />}
              {state === "sending" ? "" : "Join"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────
const SOCIALS = [
  {
    Icon: PortfolioIcon,
    label: "Portfolio",
    href: "https://my-portfolio-chi-rust.vercel.app/",
    hoverColor: "#F4C430",
    hoverBg: "rgba(244,196,48,0.1)",
    hoverBorder: "rgba(244,196,48,0.3)",
  },
  {
    Icon: LinkedInIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sahidul-islam-/",
    hoverColor: "#60A5FA",
    hoverBg: "rgba(96,165,250,0.1)",
    hoverBorder: "rgba(96,165,250,0.3)",
  },
  {
    Icon: FacebookIcon,
    label: "Facebook",
    href: "https://www.facebook.com/share/1HxwDmZNvF/",
    hoverColor: "#818CF8",
    hoverBg: "rgba(129,140,248,0.1)",
    hoverBorder: "rgba(129,140,248,0.3)",
  },
  {
    Icon: GithubIcon,
    label: "GitHub",
    href: "https://github.com/sahidul-dev-47",
    hoverColor: "#94A3B8",
    hoverBg: "rgba(148,163,184,0.1)",
    hoverBorder: "rgba(148,163,184,0.3)",
  },
];

const COLS = [
  {
    heading: "Explore",
    links: [
      { label: "Browse Ebooks",    href: "/browse" },
      { label: "Top Writers",      href: "/browse?tab=writers" },
      { label: "Genres",           href: "/browse?tab=genres" },
      { label: "New Releases",     href: "/browse?sort=newest" },
      { label: "Bestsellers",      href: "/browse?sort=bestsellers" },
    ],
  },
  {
    heading: "Writers",
    links: [
      { label: "Start Publishing", href: "/auth/register" },
      { label: "Writer Dashboard", href: "/dashboard/writer" },
      { label: "Pricing",          href: "#" },
      { label: "Writing Guide",    href: "#" },
      { label: "Success Stories",  href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",     href: "#" },
      { label: "Blog",      href: "#" },
      { label: "Careers",   href: "#" },
      { label: "Contact",   href: "#" },
      { label: "Press Kit", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",   href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy",    href: "#" },
      { label: "DMCA",             href: "#" },
      { label: "Accessibility",    href: "#" },
    ],
  },
];

const STATS = [
  { n: 12400, suffix: "+", label: "Ebooks published",  dollar: false },
  { n: 3400,  suffix: "",  label: "Active writers",    dollar: false },
  { n: 50000, suffix: "+", label: "Readers worldwide", dollar: false },
  { n: 42000, suffix: "",  label: "Dollars paid out",  dollar: true  },
];

const REVIEWS = [
  { q: "Found three new favourite authors in one afternoon.", n: "Priya S." },
  { q: "The platform actually supports independent writers.",  n: "James T." },
];

// ─── Main Footer ──────────────────────────────────────────
export default function Footer() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer ref={ref} className="relative overflow-hidden"
      style={{ background: "#07070E", borderTop: "0.5px solid rgba(244,196,48,0.1)" }}>

      <style>{`
        @keyframes lum-spin { to { transform: rotate(360deg); } }
        .lum-spinner {
          display: inline-block; width: 12px; height: 12px;
          border: 2px solid rgba(7,7,14,0.3); border-top-color: #07070E;
          border-radius: 50%; animation: lum-spin 0.7s linear infinite;
        }
        .lum-footer-grid { gap: 3rem; }
        @media (max-width: 900px) {
          .lum-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem; }
        }
        @media (max-width: 580px) {
          .lum-footer-grid { grid-template-columns: 1fr !important; gap: 1.75rem; }
          .lum-stats-grid  { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 380px) {
          .xs\\:flex-row { flex-direction: column; }
        }
      `}</style>

      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: "60%", height: "1px",
          background: "linear-gradient(90deg,transparent,rgba(244,196,48,0.35),transparent)" }} />

      {/* Ambient blob */}
      <div className="absolute bottom-0 left-1/4 -translate-x-1/2 pointer-events-none"
        style={{ width: 500, height: 320,
          background: "radial-gradient(ellipse,rgba(244,196,48,0.04) 0%,transparent 70%)" }} />

      {/* ── Stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 2 }}>
        <div className="lum-stats-grid max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-10"
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {STATS.map((s, i) => (
            <div key={i} className="py-5 sm:py-6 lg:py-7 text-center"
              style={{ borderRight: i < STATS.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none" }}>
              <div className="text-[18px] sm:text-[20px] lg:text-[24px] font-bold leading-none mb-1.5"
                style={{ fontFamily: "'Playfair Display',serif", color: "#F4C430" }}>
                {s.dollar ? "$" : ""}<CountUp to={s.n} suffix={s.suffix} />
              </div>
              <div className="text-[9px] sm:text-[10px] tracking-widest uppercase"
                style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Main grid ── */}
      <div className="relative max-w-[1180px] mx-auto px-5 sm:px-6 lg:px-10 pt-10 sm:pt-12 lg:pt-14 pb-8 sm:pb-10" style={{ zIndex: 2 }}>
        <div className="lum-footer-grid"
          style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4,1fr)" }}>

          {/* ── Brand column ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.05 }}>

            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <LuminaryIcon size={30} />
              <div className="flex flex-col leading-none">
                <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700,
                  fontSize: 18, color: "#F8FAFC", letterSpacing: "0.02em" }}>
                  Luminary
                </span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 8, fontWeight: 600,
                  letterSpacing: "0.18em", textTransform: "uppercase", color: "#F4C430", marginTop: 3 }}>
                  Read · Discover · Shine
                </span>
              </div>
            </Link>

            <p className="text-[12.5px] leading-relaxed mb-5 max-w-[240px]"
              style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}>
              Where independent writers meet curious readers. Every ebook, a new world.
            </p>

            {/* ── Developer credit ── */}
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase mb-2"
              style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>
              Built by
            </p>
            <a href="https://my-portfolio-chi-rust.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mb-5 text-[12px] font-medium transition-colors duration-150"
              style={{ color: "#F4C430", fontFamily: "'Inter',sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F8FAFC")}
              onMouseLeave={e => (e.currentTarget.style.color = "#F4C430")}>
              Sahidul Islam
              <ArrowUpRight size={11} strokeWidth={2} />
            </a>

            {/* ── Social icons ── */}
            <div className="flex gap-2 mb-6">
              {SOCIALS.map(({ Icon, label, href, hoverColor, hoverBg, hoverBorder }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.93 }}
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 rounded-[8px] transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.08)", color: "#475569" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background   = hoverBg;
                    e.currentTarget.style.borderColor  = hoverBorder;
                    e.currentTarget.style.color        = hoverColor;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background   = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor  = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color        = "#475569";
                  }}>
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>

            {/* Region pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px]"
              style={{ background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>
              <Globe size={11} strokeWidth={1.6} />
              English (Global)
            </div>
          </motion.div>

          {/* ── Link columns ── */}
          {COLS.map((col, ci) => (
            <motion.div key={col.heading} initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + ci * 0.07 }}>
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase mb-4"
                style={{ color: "#F4C430", fontFamily: "'Inter',sans-serif" }}>
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href}
                      className="group inline-flex items-center gap-1 text-[12.5px] transition-colors duration-150"
                      style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#94A3B8")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#334155")}>
                      {label}
                      <ArrowUpRight size={10} strokeWidth={2}
                        className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ── Newsletter + reviews strip ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 rounded-2xl px-5 sm:px-6 lg:px-8 py-6 sm:py-7"
          style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Newsletter />
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}>
                What readers say
              </p>
              {REVIEWS.map(({ q, n }) => (
                <div key={n} className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(14,14,26,0.8)", border: "0.5px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex-shrink-0 flex items-center justify-center rounded-full text-[9px] font-bold mt-0.5"
                    style={{ width: 20, height: 20, background: "#F4C430", color: "#07070E" }}>
                    {n[0]}
                  </div>
                  <div>
                    <p className="text-[11.5px] italic leading-relaxed"
                      style={{ color: "#475569", fontFamily: "'Inter',sans-serif" }}>
                      &ldquo;{q}&rdquo;
                    </p>
                    <p className="text-[10px] mt-1"
                      style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>
                      — {n}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Bottom bar ── */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center">
            <p className="text-[11.5px]"
              style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>
              © <CopyrightYear /> Luminary. Crafted for curious minds.
            </p>
            <span style={{ color: "#1E293B" }} className="hidden sm:inline">·</span>
            <a href="https://my-portfolio-chi-rust.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="text-[11px] transition-colors duration-150"
              style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F4C430")}
              onMouseLeave={e => (e.currentTarget.style.color = "#334155")}>
              Dev: Sahidul Islam
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            {["Privacy", "Terms", "Cookies"].map((t) => (
              <Link key={t} href="#" className="text-[11.5px] transition-colors duration-150"
                style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#475569")}
                onMouseLeave={e => (e.currentTarget.style.color = "#1E293B")}>
                {t}
              </Link>
            ))}
            <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.07)" }} />
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.93 }} onClick={scrollTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
              style={{ background: "rgba(244,196,48,0.08)", border: "0.5px solid rgba(244,196,48,0.2)",
                color: "#F4C430", fontFamily: "'Inter',sans-serif" }}>
              <ChevronUp size={11} strokeWidth={2.5} />
              Back to top
            </motion.button>
          </div>
        </motion.div>
      </div>

     
      <BookSpines />
    </footer>
  );
}