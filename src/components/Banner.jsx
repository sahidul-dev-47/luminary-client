"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, PenLine, Compass } from "lucide-react";

// ─── Slide data ───────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    accent: "#F4C430",
    accentRgb: "244,196,48",
    Icon: Compass,
    kicker: "For every curious mind",
    headline: ["Discover stories\nthat ", "stay with you"],
    italic: true, // second part is italic
    sub: "Browse thousands of original ebooks — hand-picked from independent writers across every genre.",
    cta: "Browse ebooks",         ctaHref: "/browse",
    ghost: "How it works",        ghostHref: "#",
    stats: [
      { n: "12K+", l: "Ebooks" },
      { n: "3.4K", l: "Writers" },
      { n: "4.9",  l: "Stars" },
    ],
    books: [
      { a: "M", title: "The Silent Archive", genre: "Mystery",  price: "$4.99", accent: "#C9A227", badge: "Bestseller" },
      { a: "N", title: "Neon Requiem",        genre: "Sci-Fi",   price: "$5.99", accent: "#818CF8", badge: "New" },
      { a: "R", title: "Riverstone",          genre: "Romance",  price: "$3.99", accent: "#D4537E", badge: "Top rated" },
    ],
    review: {
      text: "Finished this in one sitting. Couldn't put it down.",
      name: "Aisha K.", acBg: "#F4C430", acC: "#07070E",
    },
  },
  {
    id: 1,
    accent: "#818CF8",
    accentRgb: "129,140,248",
    Icon: PenLine,
    kicker: "For writers",
    headline: ["Your words,\nyour ", "income, forever"],
    italic: true,
    sub: "Upload in minutes, set your price, and earn from every sale — no gatekeepers, no revenue caps.",
    cta: "Start publishing",    ctaHref: "/register",
    ghost: "See how it works",  ghostHref: "#",
    stats: [
      { n: "$42K", l: "Paid out" },
      { n: "98%",  l: "Satisfaction" },
      { n: "Free", l: "To join" },
    ],
    books: [
      { a: "E", title: "Echoes of Silence",  genre: "Romance",  price: "$3.49", accent: "#D4537E", badge: "Top 10" },
      { a: "G", title: "Glass Meridian",      genre: "Fantasy",  price: "$6.99", accent: "#818CF8", badge: "Editor pick" },
      { a: "V", title: "Void Protocol",       genre: "Sci-Fi",   price: "$4.99", accent: "#10B981", badge: "Rising" },
    ],
    review: {
      text: "Made $800 in my first month. The platform actually works.",
      name: "James T.", acBg: "#818CF8", acC: "#07070E",
    },
  },
  {
    id: 2,
    accent: "#F97316",
    accentRgb: "249,115,22",
    Icon: Zap,
    kicker: "50,000 readers agree",
    headline: ["Your next favourite\nbook is ", "one click away"],
    italic: true,
    sub: "Search by genre, price, or mood. Bookmark, collect, and revisit your favourites any time.",
    cta: "Explore now",       ctaHref: "/browse",
    ghost: "Top genres",      ghostHref: "#",
    stats: [
      { n: "50K+", l: "Readers" },
      { n: "Free", l: "To browse" },
      { n: "Daily", l: "New picks" },
    ],
    books: [
      { a: "L", title: "The Last Cartographer", genre: "Fantasy",   price: "$4.99", accent: "#F97316", badge: "Hot" },
      { a: "P", title: "Paper Kingdoms",         genre: "Historical",price: "$2.99", accent: "#10B981", badge: "Free week" },
      { a: "S", title: "Starfall",               genre: "Sci-Fi",   price: "$5.49", accent: "#818CF8", badge: "Staff pick" },
    ],
    review: {
      text: "Found three new favourite authors in one afternoon.",
      name: "Priya S.", acBg: "#F97316", acC: "#07070E",
    },
  },
];

const AVATAR_BG = ["#F4C430","#818CF8","#10B981","#F97316","#D4537E"];
const GENRES    = ["Fiction","Mystery","Sci-Fi","Romance","Fantasy","Horror","Thriller","Poetry"];

// ─── Particle canvas ──────────────────────────────────────
function Particles({ rgb }) {
  const cvRef  = useRef(null);
  const rgbRef = useRef(rgb);
  useEffect(() => { rgbRef.current = rgb; }, [rgb]);

  useEffect(() => {
    const cvs = cvRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let raf;
    const resize = () => {
      cvs.width  = cvs.offsetWidth;
      cvs.height = cvs.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: 70 }, () => ({
      x:  Math.random() * 1600,
      y:  Math.random() * 900,
      r:  Math.random() * 1.3 + 0.25,
      vx: (Math.random() - 0.5) * 0.14,
      vy: -(Math.random() * 0.18 + 0.04),
      a:  Math.random() * 0.25 + 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      const [r, g, b] = rgbRef.current.split(",");
      dots.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -4) p.y = cvs.height + 4;
        if (p.x < -4) p.x = cvs.width + 4;
        if (p.x > cvs.width + 4) p.x = -4;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={cvRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─── Live reader count ────────────────────────────────────
function LiveBadge() {
  const [n, setN] = useState(247);
  useEffect(() => {
    const id = setInterval(() => {
      setN(p => Math.min(340, Math.max(190, p + Math.floor(Math.random() * 7) - 3)));
    }, 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
      style={{ background: "rgba(16,185,129,0.1)", border: "0.5px solid rgba(16,185,129,0.25)", color: "#10B981" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      {n} online now
    </div>
  );
}

// ─── Single book row ──────────────────────────────────────
function BookRow({ b, accent }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 group"
      style={{ background: "rgba(14,14,26,0.85)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
      {/* mini cover */}
      <div className="relative flex-shrink-0 flex items-center justify-center w-10 h-14 rounded-[3px_6px_6px_3px] text-base font-bold overflow-hidden"
        style={{ background: `rgba(${b.accent === "#C9A227" ? "244,196,48" : b.accent === "#818CF8" ? "129,140,248" : b.accent === "#D4537E" ? "212,83,126" : b.accent === "#10B981" ? "16,185,129" : "249,115,22"},0.13)`, color: b.accent, fontFamily: "'Playfair Display',serif", border: `0.5px solid rgba(${b.accent === "#C9A227" ? "244,196,48" : b.accent === "#818CF8" ? "129,140,248" : b.accent === "#D4537E" ? "212,83,126" : b.accent === "#10B981" ? "16,185,129" : "249,115,22"},0.22)` }}>
        <div className="absolute left-0 inset-y-0 w-1" style={{ background: "rgba(0,0,0,0.22)" }} />
        {b.a}
      </div>
      {/* info */}
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-medium text-slate-300 truncate leading-snug">{b.title}</p>
        <p className="text-[10px] text-slate-600 mt-0.5">{b.genre}</p>
        <span className="inline-block mt-1 text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full"
          style={{ background: `rgba(${b.accent === "#C9A227" ? "244,196,48" : b.accent === "#818CF8" ? "129,140,248" : b.accent === "#D4537E" ? "212,83,126" : b.accent === "#10B981" ? "16,185,129" : "249,115,22"},0.12)`, color: b.accent }}>
          {b.badge}
        </span>
      </div>
      <span className="text-[13px] font-semibold flex-shrink-0" style={{ color: b.accent }}>{b.price}</span>
    </div>
  );
}

// ─── Main Banner ──────────────────────────────────────────
export default function Banner() {
  const [cur, setCur] = useState(0);
  const slide = SLIDES[cur];

  const go = useCallback(idx => setCur((idx + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const id = setInterval(() => go(cur + 1), 6500);
    return () => clearInterval(id);
  }, [cur, go]);

  return (
    <section className="relative overflow-hidden flex items-center"
      style={{ background: "#07070E", minHeight: "100vh" }}>

      {/* ── keyframe for live dot ── */}
      <style>{`
        @keyframes lumPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.65)} }
        .animate-pulse { animation: lumPulse 2s infinite; }
        @media(max-width:900px){ .hero-grid{ grid-template-columns:1fr !important; } }
        @media(prefers-reduced-motion:reduce){ *{ animation-duration:.01ms !important; transition-duration:.01ms !important; } }
      `}</style>

      {/* particles */}
      <Particles rgb={slide.accentRgb} />

      {/* dot-grid texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

      {/* ambient glow */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ zIndex: 1, background: `radial-gradient(ellipse 65% 55% at 65% 45%, rgba(${slide.accentRgb},0.07) 0%, transparent 65%)` }} />

      {/* ── Content ── */}
      <div className="relative w-full max-w-[1180px] mx-auto px-12 pb-24"
        style={{ zIndex: 3, paddingTop: "80px" }}>

        {/* ── Top strip: live badge + genre pills ── */}
        <div className="flex items-center justify-between mb-12 flex-wrap gap-3">
          <LiveBadge />
          <div className="flex gap-2 flex-wrap">
            {GENRES.map(g => (
              <span key={g} className="px-3 py-1 rounded-full text-[11px] font-medium"
                style={{ color: "rgba(255,255,255,0.2)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* ── Slide content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cur}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main 2-col grid */}
            <div className="hero-grid mb-10"
              style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "52px", alignItems: "start" }}>

              {/* ── LEFT ── */}
              <div>
                {/* kicker */}
                <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
                  style={{ background: `rgba(${slide.accentRgb},0.1)`, border: `0.5px solid rgba(${slide.accentRgb},0.28)`, color: slide.accent }}>
                  <slide.Icon size={11} strokeWidth={2.5} />
                  {slide.kicker}
                </div>

                {/* Headline — large Playfair, italic second part */}
                <h1 className="mb-5 leading-[1.08] tracking-tight"
                  style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.2rem,4.2vw,3.4rem)", fontWeight: 700, color: "#EDE9E0", whiteSpace: "pre-line", letterSpacing: "-.025em" }}>
                  {slide.headline[0]}
                  <em style={{ fontStyle: "italic", fontWeight: 400, color: slide.accent }}>{slide.headline[1]}</em>
                </h1>

                {/* Sub */}
                <p className="text-[14px] leading-[1.75] mb-8 max-w-[400px]"
                  style={{ color: "#475569", fontFamily: "'Inter',sans-serif" }}>
                  {slide.sub}
                </p>

                {/* CTA row */}
                <div className="flex items-center gap-3 mb-9 flex-wrap">
                  <Link href={slide.ctaHref}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[9px] text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0"
                    style={{ background: slide.accent, color: "#07070E", fontFamily: "'Inter',sans-serif" }}>
                    {slide.cta}
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </Link>
                  <Link href={slide.ghostHref}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[9px] text-[13px] font-medium transition-all duration-200 hover:text-slate-200"
                    style={{ color: "#475569", border: "0.5px solid rgba(255,255,255,0.09)", fontFamily: "'Inter',sans-serif" }}>
                    {slide.ghost}
                  </Link>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-0 mb-9">
                  {slide.stats.map((s, i) => (
                    <div key={i} className="flex items-center">
                      <div className={i === 0 ? "pr-5" : "px-5"}>
                        <div className="text-[22px] font-bold leading-none mb-1"
                          style={{ fontFamily: "'Playfair Display',serif", color: slide.accent }}>{s.n}</div>
                        <div className="text-[11px] tracking-wider"
                          style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>{s.l}</div>
                      </div>
                      {i < slide.stats.length - 1 && (
                        <div className="w-px h-7" style={{ background: "rgba(255,255,255,0.07)" }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Trust row: stacked avatars + text */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex">
                    {AVATAR_BG.map((c, i) => (
                      <div key={i} className="flex items-center justify-center rounded-full text-[10px] font-bold"
                        style={{ width: 26, height: 26, background: c, color: "#07070E", border: "2px solid #07070E", marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i }}>
                        {"ABCDE"[i]}
                      </div>
                    ))}
                  </div>
                  <p className="text-[12px] leading-snug" style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}>
                    <span style={{ color: "#94A3B8", fontWeight: 500 }}>50,000+</span> readers this month
                    <span className="mx-2" style={{ color: "#1E293B" }}>·</span>
                    Rated <span style={{ color: "#94A3B8", fontWeight: 500 }}>4.9★</span>
                  </p>
                </div>
              </div>

              {/* ── RIGHT: book list + review ── */}
              <div className="flex flex-col gap-2.5">
                {/* Section label */}
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-1"
                  style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>Featured right now</p>

                {slide.books.map((b, i) => (
                  <motion.div key={b.title}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22,1,0.36,1] }}>
                    <BookRow b={b} accent={slide.accent} />
                  </motion.div>
                ))}

                {/* Review card */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24, duration: 0.4, ease: [0.22,1,0.36,1] }}
                  className="mt-1 px-4 py-3.5 rounded-xl"
                  style={{ background: "rgba(14,14,26,0.85)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[11px] mb-1" style={{ color: "#F4C430", letterSpacing: ".2px" }}>★★★★★</p>
                  <p className="text-[12px] leading-relaxed mb-2.5 italic"
                    style={{ color: "#475569", fontFamily: "'Inter',sans-serif" }}>
                    "{slide.review.text}"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center rounded-full text-[9px] font-bold"
                      style={{ width: 22, height: 22, background: slide.review.acBg, color: slide.review.acC }}>
                      {slide.review.name[0]}
                    </div>
                    <span className="text-[11px]" style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}>
                      {slide.review.name} · Verified reader
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* ── Stats bar ── */}
            <div className="grid grid-cols-3 rounded-xl overflow-hidden mb-9"
              style={{ background: "rgba(255,255,255,0.04)", gap: "1px" }}>
              {slide.stats.map((s, i) => (
                <div key={i} className="py-4 text-center" style={{ background: "#07070E" }}>
                  <div className="text-[20px] font-bold leading-none mb-1"
                    style={{ fontFamily: "'Playfair Display',serif", color: slide.accent }}>{s.n}</div>
                  <div className="text-[10px] tracking-widest uppercase"
                    style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* ── Trending strip ── */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3"
                style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>Trending this week</p>
              <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {[...slide.books, ...SLIDES[(cur+1)%3].books, ...SLIDES[(cur+2)%3].books].slice(0,8).map((b, i) => (
                  <div key={i} className="flex-shrink-0 w-[72px] cursor-pointer group">
                    <div className="w-[72px] h-24 rounded-lg flex items-center justify-center text-lg font-bold mb-1.5 transition-transform duration-200 group-hover:-translate-y-1"
                      style={{ background: `rgba(${b.accent === "#C9A227" ? "244,196,48" : b.accent === "#818CF8" ? "129,140,248" : b.accent === "#D4537E" ? "212,83,126" : b.accent === "#10B981" ? "16,185,129" : "249,115,22"},0.1)`, border: `0.5px solid rgba(${b.accent === "#C9A227" ? "244,196,48" : b.accent === "#818CF8" ? "129,140,248" : b.accent === "#D4537E" ? "212,83,126" : b.accent === "#10B981" ? "16,185,129" : "249,115,22"},0.2)`, color: b.accent, fontFamily: "'Playfair Display',serif" }}>
                      {b.a}
                    </div>
                    <p className="text-[10px] text-center leading-tight line-clamp-2"
                      style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}>{b.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Slide controls ── */}
      <div className="absolute bottom-7 left-12 right-12 flex items-center justify-between"
        style={{ zIndex: 10 }}>
        {/* progress dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className="h-0.5 rounded-full transition-all duration-300 border-none cursor-pointer p-0"
              style={{ width: i === cur ? 28 : 14, background: i === cur ? slide.accent : "rgba(255,255,255,0.1)" }}
              aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>

        <span className="text-[10px] tracking-widest" style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>
          0{cur + 1} / 0{SLIDES.length}
        </span>

        {/* arrows */}
        <div className="flex gap-2">
          {[
            { label: "Previous", delta: -1, icon: "←" },
            { label: "Next",     delta: +1, icon: "→" },
          ].map(({ label, delta, icon }) => (
            <button key={label} onClick={() => go(cur + delta)} aria-label={label}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", color: "#334155", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#94A3B8"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#334155"; }}>
              {icon}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
