"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, PenLine, Compass } from "lucide-react";

// ─── Background images from Unsplash ─────────────────────
// Free to use, no attribution required (Unsplash License)
const BG_IMAGES = [
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1800&q=80&fit=crop", // library shelves warm
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1800&q=80&fit=crop", // old books dark
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1800&q=80&fit=crop", // stack of books
];

// ─── Book cover images from Unsplash ─────────────────────
const BOOK_COVERS = {
  M: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&q=80&fit=crop",
  N: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=120&q=80&fit=crop",
  R: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=120&q=80&fit=crop",
  E: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=120&q=80&fit=crop",
  G: "https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=120&q=80&fit=crop",
  V: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=120&q=80&fit=crop",
  L: "https://images.unsplash.com/photo-1512045482940-f37f5216f639?w=120&q=80&fit=crop",
  P: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=120&q=80&fit=crop",
  S: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=120&q=80&fit=crop",
};

// ─── Slide data ───────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    accent: "#F4C430",
    accentRgb: "244,196,48",
    Icon: Compass,
    kicker: "For every curious mind",
    headline: ["Discover stories\nthat ", "stay with you"],
    sub: "Browse thousands of original ebooks — hand-picked from independent writers across every genre.",
    cta: "Browse ebooks",      ctaHref: "/browse",
    ghost: "How it works",     ghostHref: "#",
    stats: [{ n: "12K+", l: "Ebooks" }, { n: "3.4K", l: "Writers" }, { n: "4.9", l: "Stars" }],
    books: [
      { a: "M", title: "The Silent Archive", genre: "Mystery",  price: "$4.99", accent: "#C9A227", badge: "Bestseller" },
      { a: "N", title: "Neon Requiem",        genre: "Sci-Fi",   price: "$5.99", accent: "#818CF8", badge: "New" },
      { a: "R", title: "Riverstone",          genre: "Romance",  price: "$3.99", accent: "#D4537E", badge: "Top rated" },
    ],
    review: { text: "Finished this in one sitting. Couldn't put it down.", name: "Aisha K.", acBg: "#F4C430", acC: "#07070E" },
  },
  {
    id: 1,
    accent: "#818CF8",
    accentRgb: "129,140,248",
    Icon: PenLine,
    kicker: "For writers",
    headline: ["Your words,\nyour ", "income, forever"],
    sub: "Upload in minutes, set your price, and earn from every sale — no gatekeepers, no revenue caps.",
    cta: "Start publishing",   ctaHref: "/register",
    ghost: "See how it works", ghostHref: "#",
    stats: [{ n: "$42K", l: "Paid out" }, { n: "98%", l: "Satisfaction" }, { n: "Free", l: "To join" }],
    books: [
      { a: "E", title: "Echoes of Silence", genre: "Romance", price: "$3.49", accent: "#D4537E", badge: "Top 10" },
      { a: "G", title: "Glass Meridian",    genre: "Fantasy", price: "$6.99", accent: "#818CF8", badge: "Editor pick" },
      { a: "V", title: "Void Protocol",     genre: "Sci-Fi",  price: "$4.99", accent: "#10B981", badge: "Rising" },
    ],
    review: { text: "Made $800 in my first month. The platform actually works.", name: "James T.", acBg: "#818CF8", acC: "#07070E" },
  },
  {
    id: 2,
    accent: "#F97316",
    accentRgb: "249,115,22",
    Icon: Zap,
    kicker: "50,000 readers agree",
    headline: ["Your next favourite\nbook is ", "one click away"],
    sub: "Search by genre, price, or mood. Bookmark, collect, and revisit your favourites any time.",
    cta: "Explore now",   ctaHref: "/browse",
    ghost: "Top genres",  ghostHref: "#",
    stats: [{ n: "50K+", l: "Readers" }, { n: "Free", l: "To browse" }, { n: "Daily", l: "New picks" }],
    books: [
      { a: "L", title: "The Last Cartographer", genre: "Fantasy",    price: "$4.99", accent: "#F97316", badge: "Hot" },
      { a: "P", title: "Paper Kingdoms",         genre: "Historical", price: "$2.99", accent: "#10B981", badge: "Free week" },
      { a: "S", title: "Starfall",               genre: "Sci-Fi",    price: "$5.49", accent: "#818CF8", badge: "Staff pick" },
    ],
    review: { text: "Found three new favourite authors in one afternoon.", name: "Priya S.", acBg: "#F97316", acC: "#07070E" },
  },
];

const AVATAR_BG = ["#F4C430","#818CF8","#10B981","#F97316","#D4537E"];
const GENRES    = ["Fiction","Mystery","Sci-Fi","Romance","Fantasy","Horror","Thriller","Poetry"];

// ─── accent hex → rgb string helper ──────────────────────
const ACCENT_RGB_MAP = {
  "#C9A227": "244,196,48",
  "#818CF8": "129,140,248",
  "#D4537E": "212,83,126",
  "#10B981": "16,185,129",
  "#F97316": "249,115,22",
};
const toRgb = (hex) => ACCENT_RGB_MAP[hex] || "255,255,255";

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
    const resize = () => { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * 1600, y: Math.random() * 900,
      r: Math.random() * 1.3 + 0.25,
      vx: (Math.random() - 0.5) * 0.13,
      vy: -(Math.random() * 0.18 + 0.04),
      a: Math.random() * 0.22 + 0.05,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      const [r, g, b] = rgbRef.current.split(",");
      dots.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`; ctx.fill();
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

  return <canvas ref={cvRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }} />;
}

// ─── Live badge ───────────────────────────────────────────
function LiveBadge() {
  const [n, setN] = useState(247);
  useEffect(() => {
    const id = setInterval(() => setN(p => Math.min(340, Math.max(190, p + Math.floor(Math.random() * 7) - 3))), 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
      style={{ background: "rgba(16,185,129,0.12)", border: "0.5px solid rgba(16,185,129,0.3)", color: "#10B981", backdropFilter: "blur(8px)" }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981", animation: "lumPulse 2s infinite" }} />
      {n} online now
    </div>
  );
}

// ─── Book row — vertical list, cover image ────────────────
function BookRow({ b }) {
  const rgb = toRgb(b.accent);
  const coverSrc = BOOK_COVERS[b.a];

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer"
      style={{ background: "rgba(7,7,14,0.7)", border: "0.5px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `rgba(${rgb},0.3)`}
      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>

      {/* Cover image */}
      <div className="relative flex-shrink-0 overflow-hidden rounded-[3px_6px_6px_3px]"
        style={{ width: 36, height: 52, background: `rgba(${rgb},0.12)`, border: `0.5px solid rgba(${rgb},0.2)` }}>
        {/* book spine line */}
        <div className="absolute left-0 inset-y-0 w-[3px]" style={{ background: `rgba(${rgb},0.35)` }} />
        {coverSrc && (
          <img
            src={coverSrc}
            alt={b.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.75, mixBlendMode: "luminosity" }}
          />
        )}
        {/* overlay tint */}
        <div style={{ position: "absolute", inset: 0, background: `rgba(${rgb},0.18)` }} />
        {/* letter fallback */}
        <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold"
          style={{ fontFamily: "'Playfair Display',serif", color: b.accent, zIndex: 1 }}>{b.a}</div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium truncate leading-snug" style={{ color: "#CBD5E1" }}>{b.title}</p>
        <p className="text-[10px] mt-0.5" style={{ color: "#334155" }}>{b.genre}</p>
        <span className="inline-block mt-1 text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full"
          style={{ background: `rgba(${rgb},0.12)`, color: b.accent }}>{b.badge}</span>
      </div>

      <span className="text-[12.5px] font-semibold flex-shrink-0" style={{ color: b.accent }}>{b.price}</span>
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
    <section className="relative overflow-hidden flex items-center" style={{ minHeight: "100vh" }}>

      <style>{`
        @keyframes lumPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.65)} }
        @media(max-width:900px){ .hero-grid{ grid-template-columns:1fr !important; } .right-col{ display:none !important; } }
        @media(prefers-reduced-motion:reduce){ *{ animation-duration:.01ms !important; transition-duration:.01ms !important; } }
        ::-webkit-scrollbar{ display:none }
      `}</style>

      {/* ── Layer 0: Unsplash background image ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${cur}`}
          className="absolute inset-0"
          style={{ zIndex: 0 }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <img
            src={BG_IMAGES[cur]}
            alt=""
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Layer 1: Dark overlay — keeps text readable ── */}
      <div className="absolute inset-0" style={{ zIndex: 1, background: "linear-gradient(to right, rgba(7,7,14,0.95) 0%, rgba(7,7,14,0.82) 55%, rgba(7,7,14,0.55) 100%)" }} />

      {/* ── Layer 1b: bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{ zIndex: 1, background: "linear-gradient(to top, #07070E 0%, transparent 100%)" }} />

      {/* ── Layer 1c: dot grid ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

      {/* ── Layer 1d: accent ambient glow ── */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ zIndex: 1, background: `radial-gradient(ellipse 60% 50% at 65% 45%, rgba(${slide.accentRgb},0.06) 0%, transparent 65%)` }} />

      {/* ── Layer 2: Particles ── */}
      <Particles rgb={slide.accentRgb} />

      {/* ── Layer 3: Content ── */}
      <div className="relative w-full max-w-[1180px] mx-auto px-10 pb-24" style={{ zIndex: 3, paddingTop: "84px" }}>

        {/* Top strip */}
        <div className="flex items-center justify-between mb-10 flex-wrap gap-3">
          <LiveBadge />
          <div className="flex gap-2 flex-wrap">
            {GENRES.map(g => (
              <span key={g} className="px-2.5 py-1 rounded-full text-[10.5px] font-medium"
                style={{ color: "rgba(255,255,255,0.22)", border: "0.5px solid rgba(255,255,255,0.08)", backdropFilter: "blur(6px)", background: "rgba(7,7,14,0.3)" }}>
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Main slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cur}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* 2-col grid */}
            <div className="hero-grid mb-10"
              style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "56px", alignItems: "start" }}>

              {/* ── LEFT ── */}
              <div>
                {/* kicker */}
                <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
                  style={{ background: `rgba(${slide.accentRgb},0.12)`, border: `0.5px solid rgba(${slide.accentRgb},0.3)`, color: slide.accent, backdropFilter: "blur(8px)" }}>
                  <slide.Icon size={11} strokeWidth={2.5} />
                  {slide.kicker}
                </div>

                {/* Headline */}
                <h1 className="mb-5 leading-[1.08] tracking-tight"
                  style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.4rem,4.5vw,3.6rem)", fontWeight: 700, color: "#EDE9E0", whiteSpace: "pre-line", letterSpacing: "-.025em", textShadow: "0 2px 32px rgba(0,0,0,0.5)" }}>
                  {slide.headline[0]}
                  <em style={{ fontStyle: "italic", fontWeight: 400, color: slide.accent }}>{slide.headline[1]}</em>
                </h1>

                {/* Sub */}
                <p className="text-[14px] leading-[1.75] mb-8 max-w-[420px]"
                  style={{ color: "#64748B", fontFamily: "'Inter',sans-serif" }}>
                  {slide.sub}
                </p>

                {/* CTAs */}
                <div className="flex items-center gap-3 mb-9 flex-wrap">
                  <Link href={slide.ctaHref}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] text-[13.5px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
                    style={{ background: slide.accent, color: "#07070E", fontFamily: "'Inter',sans-serif", boxShadow: `0 4px 20px rgba(${slide.accentRgb},0.3)` }}>
                    {slide.cta}
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </Link>
                  <Link href={slide.ghostHref}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] text-[13.5px] font-medium transition-all duration-200 hover:text-slate-200"
                    style={{ color: "#475569", border: "0.5px solid rgba(255,255,255,0.12)", fontFamily: "'Inter',sans-serif", backdropFilter: "blur(8px)", background: "rgba(7,7,14,0.3)" }}>
                    {slide.ghost}
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-0 mb-9">
                  {slide.stats.map((s, i) => (
                    <div key={i} className="flex items-center">
                      <div className={i === 0 ? "pr-6" : "px-6"}>
                        <div className="text-[24px] font-bold leading-none mb-1"
                          style={{ fontFamily: "'Playfair Display',serif", color: slide.accent }}>{s.n}</div>
                        <div className="text-[11px] tracking-wider" style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}>{s.l}</div>
                      </div>
                      {i < slide.stats.length - 1 && <div className="w-px h-7" style={{ background: "rgba(255,255,255,0.08)" }} />}
                    </div>
                  ))}
                </div>

                {/* Trust row */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex">
                    {AVATAR_BG.map((c, i) => (
                      <div key={i} className="flex items-center justify-center rounded-full text-[10px] font-bold"
                        style={{ width: 26, height: 26, background: c, color: "#07070E", border: "2px solid rgba(7,7,14,0.8)", marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i }}>
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

              {/* ── RIGHT: vertical book list + review ── */}
              <div className="right-col flex flex-col gap-2">
                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-1"
                  style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>Featured right now</p>

                {/* Vertical book list */}
                {slide.books.map((b, i) => (
                  <motion.div key={b.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                    <BookRow b={b} />
                  </motion.div>
                ))}

                {/* Review card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.26, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-1 px-4 py-3.5 rounded-xl"
                  style={{ background: "rgba(7,7,14,0.7)", border: "0.5px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
                  <p className="text-[11px] mb-1.5" style={{ color: "#F4C430", letterSpacing: ".2px" }}>★★★★★</p>
                  <p className="text-[12px] leading-relaxed mb-2.5 italic"
                    style={{ color: "#475569", fontFamily: "'Inter',sans-serif" }}>"{slide.review.text}"</p>
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

            {/* Stats bar */}
            <div className="grid grid-cols-3 rounded-xl overflow-hidden mb-8"
              style={{ background: "rgba(255,255,255,0.04)", gap: "1px", backdropFilter: "blur(8px)" }}>
              {slide.stats.map((s, i) => (
                <div key={i} className="py-4 text-center" style={{ background: "rgba(7,7,14,0.65)" }}>
                  <div className="text-[20px] font-bold leading-none mb-1"
                    style={{ fontFamily: "'Playfair Display',serif", color: slide.accent }}>{s.n}</div>
                  <div className="text-[10px] tracking-widest uppercase" style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Trending strip */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase mb-3"
                style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>Trending this week</p>
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {[...slide.books, ...SLIDES[(cur+1)%3].books, ...SLIDES[(cur+2)%3].books].slice(0, 8).map((b, i) => {
                  const rgb = toRgb(b.accent);
                  return (
                    <div key={i} className="flex-shrink-0 w-[70px] cursor-pointer group">
                      <div className="relative w-[70px] h-[94px] rounded-lg mb-1.5 overflow-hidden transition-transform duration-200 group-hover:-translate-y-1"
                        style={{ background: `rgba(${rgb},0.1)`, border: `0.5px solid rgba(${rgb},0.2)` }}>
                        {BOOK_COVERS[b.a] && (
                          <img src={BOOK_COVERS[b.a]} alt={b.title}
                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, mixBlendMode: "luminosity" }} />
                        )}
                        <div style={{ position: "absolute", inset: 0, background: `rgba(${rgb},0.2)` }} />
                        <div className="absolute inset-0 flex items-center justify-center text-[16px] font-bold"
                          style={{ fontFamily: "'Playfair Display',serif", color: b.accent, zIndex: 1 }}>{b.a}</div>
                        <div className="absolute left-0 inset-y-0 w-1" style={{ background: `rgba(${rgb},0.4)` }} />
                      </div>
                      <p className="text-[10px] text-center leading-tight line-clamp-2"
                        style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}>{b.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Slide controls ── */}
      <div className="absolute bottom-7 left-10 right-10 flex items-center justify-between" style={{ zIndex: 10 }}>
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className="h-0.5 rounded-full transition-all duration-300 border-none cursor-pointer p-0"
              style={{ width: i === cur ? 28 : 14, background: i === cur ? slide.accent : "rgba(255,255,255,0.15)" }}
              aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
        <span className="text-[10px] tracking-widest" style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}>
          0{cur + 1} / 0{SLIDES.length}
        </span>
        <div className="flex gap-2">
          {[{ label: "Previous", delta: -1, icon: "←" }, { label: "Next", delta: +1, icon: "→" }].map(({ label, delta, icon }) => (
            <button key={label} onClick={() => go(cur + delta)} aria-label={label}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", color: "#475569", backdropFilter: "blur(8px)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#94A3B8"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#475569"; }}>
              {icon}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
