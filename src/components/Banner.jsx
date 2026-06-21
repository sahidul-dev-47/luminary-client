"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, Star } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    eyebrow: "New arrivals this week",
    headline: "Discover stories\nthat stay with you",
    sub: "Browse thousands of original ebooks from independent writers — hand-picked, beautifully presented.",
    cta: "Browse Ebooks",
    ctaHref: "/browse",
    accent: "#F4C430",
    genre: "Fiction · Mystery · Sci-Fi",
    stat1: { val: "12K+", label: "Ebooks" },
    stat2: { val: "3.4K", label: "Writers" },
    visual: "book",
  },
  {
    id: 2,
    eyebrow: "For writers",
    headline: "Publish once,\nearn forever",
    sub: "Upload your ebook, set your price, and reach a global audience of passionate readers — all in minutes.",
    cta: "Start Writing",
    ctaHref: "/register",
    accent: "#818CF8",
    genre: "Romance · Fantasy · Horror",
    stat1: { val: "$42K", label: "Paid out" },
    stat2: { val: "98%", label: "Satisfaction" },
    visual: "quill",
  },
  {
    id: 3,
    eyebrow: "Reader spotlight",
    headline: "Your next favourite\nbook is one click away",
    sub: "Search, filter by genre, and read instantly. Bookmark, collect, and revisit your favourite titles anytime.",
    cta: "Explore Now",
    ctaHref: "/browse",
    accent: "#F97316",
    genre: "Biography · Self-help · Poetry",
    stat1: { val: "4.9★", label: "Avg rating" },
    stat2: { val: "50K+", label: "Readers" },
    visual: "stars",
  },
];

/* ── floating book SVG visuals per slide ─────────────────── */
const Visual = ({ type, accent }) => {
  if (type === "book") return (
    <svg viewBox="0 0 260 300" fill="none" width="100%" height="100%">
      <rect x="30" y="20" width="160" height="220" rx="10"
        fill="rgba(244,196,48,0.08)" stroke="rgba(244,196,48,0.2)" strokeWidth="0.8" />
      <rect x="50" y="40" width="120" height="160" rx="6"
        fill="rgba(244,196,48,0.05)" stroke="rgba(244,196,48,0.12)" strokeWidth="0.5" />
      <line x1="65" y1="80"  x2="155" y2="80"  stroke="rgba(244,196,48,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="65" y1="100" x2="155" y2="100" stroke="rgba(244,196,48,0.2)" strokeWidth="1" strokeLinecap="round" />
      <line x1="65" y1="118" x2="130" y2="118" stroke="rgba(244,196,48,0.2)" strokeWidth="1" strokeLinecap="round" />
      <line x1="65" y1="135" x2="145" y2="135" stroke="rgba(244,196,48,0.15)" strokeWidth="1" strokeLinecap="round" />
      <line x1="65" y1="152" x2="120" y2="152" stroke="rgba(244,196,48,0.15)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="110" cy="58" r="12" fill="rgba(244,196,48,0.15)" stroke="rgba(244,196,48,0.35)" strokeWidth="0.8" />
      <path d="M110 50 L113 58 L110 56 L107 58 Z" fill="#F4C430" />
      <path d="M110 56 L110 64" stroke="#F4C430" strokeWidth="1" strokeLinecap="round" />
      {[0,1,2].map(i => (
        <rect key={i} x={50 + i * 48} y="210" width="36" height="50" rx="4"
          fill={`rgba(244,196,48,${0.06 + i * 0.03})`}
          stroke={`rgba(244,196,48,${0.1 + i * 0.05})`} strokeWidth="0.5" />
      ))}
      <circle cx="200" cy="60" r="24" fill="rgba(244,196,48,0.06)" stroke="rgba(244,196,48,0.15)" strokeWidth="0.5" />
      <circle cx="20"  cy="200" r="16" fill="rgba(129,140,248,0.06)" stroke="rgba(129,140,248,0.15)" strokeWidth="0.5" />
    </svg>
  );

  if (type === "quill") return (
    <svg viewBox="0 0 260 300" fill="none" width="100%" height="100%">
      <path d="M200 30 C160 60 100 120 80 240" stroke="rgba(129,140,248,0.35)" strokeWidth="2" strokeLinecap="round" />
      <path d="M200 30 C220 80 160 160 80 240" stroke="rgba(129,140,248,0.15)" strokeWidth="1" strokeLinecap="round" />
      <path d="M80 240 L90 220 L70 225 Z" fill="rgba(129,140,248,0.4)" />
      <circle cx="200" cy="30" r="20" fill="rgba(129,140,248,0.1)" stroke="rgba(129,140,248,0.25)" strokeWidth="0.8" />
      <rect x="30" y="255" width="140" height="1.5" rx="1"
        fill="rgba(129,140,248,0.3)" />
      <rect x="30" y="268" width="100" height="1" rx="1"
        fill="rgba(129,140,248,0.18)" />
      <rect x="30" y="279" width="120" height="1" rx="1"
        fill="rgba(129,140,248,0.15)" />
      {[0,1,2,3].map(i => (
        <circle key={i} cx={180 + (i % 2) * 40} cy={100 + i * 40} r={3 + i}
          fill={`rgba(129,140,248,${0.15 - i * 0.02})`} />
      ))}
    </svg>
  );

  return (
    <svg viewBox="0 0 260 300" fill="none" width="100%" height="100%">
      {[0,1,2,3,4,5,6].map(i => {
        const cx = 40 + (i * 37) % 200;
        const cy = 40 + (i * 53) % 220;
        const r  = 6 + (i * 7) % 16;
        return (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill={`rgba(249,115,22,${0.04 + (i % 3) * 0.03})`}
            stroke={`rgba(249,115,22,${0.1 + (i % 3) * 0.07})`}
            strokeWidth="0.5" />
        );
      })}
      {[0,1,2,3,4].map(i => {
        const x = 60 + i * 36, y = 130 + (i % 3) * 20;
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <path d="M0-8 L2-2 L8-2 L3 2 L5 8 L0 4 L-5 8 L-3 2 L-8-2 L-2-2 Z"
              fill={`rgba(249,115,22,${0.15 + i * 0.05})`}
              stroke={`rgba(249,115,22,0.3)`} strokeWidth="0.5" />
          </g>
        );
      })}
      <rect x="60" y="220" width="140" height="40" rx="6"
        fill="rgba(249,115,22,0.05)" stroke="rgba(249,115,22,0.15)" strokeWidth="0.5" />
      <line x1="75" y1="234" x2="185" y2="234" stroke="rgba(249,115,22,0.2)" strokeWidth="1" strokeLinecap="round" />
      <line x1="75" y1="247" x2="155" y2="247" stroke="rgba(249,115,22,0.15)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
};

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState(1);

  const go = useCallback((idx) => {
    setDir(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => go((current + 1) % SLIDES.length), [current, go]);
  const prev = useCallback(() => go((current - 1 + SLIDES.length) % SLIDES.length), [current, go]);

  useEffect(() => {
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next]);

  const slide = SLIDES[current];

  const variants = {
    enter:  (d) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      background: "#0D0D1A",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
    }}>

      {/* ── ambient glow ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 60% at 60% 50%, ${slide.accent}0D 0%, transparent 65%)`,
        transition: "background 0.8s ease",
      }} />
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: "45%", height: "60%", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(129,140,248,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── dot grid texture ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.35,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      {/* ── content ── */}
      <div style={{
        position: "relative", zIndex: 2,
        width: "100%", maxWidth: "1200px",
        margin: "0 auto",
        padding: "100px 40px 80px",
        display: "grid",
        gridTemplateColumns: "1fr 420px",
        gap: "60px",
        alignItems: "center",
      }}
      className="banner-grid">

        {/* LEFT — text */}
        <div>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={slide.id}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* eyebrow */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                padding: "5px 12px", borderRadius: "99px", marginBottom: "28px",
                background: `${slide.accent}18`,
                border: `0.5px solid ${slide.accent}35`,
                fontSize: "12px", fontWeight: 600,
                color: slide.accent, letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>
                <Sparkles size={11} />
                {slide.eyebrow}
              </div>

              {/* headline */}
              <h1 style={{
                fontFamily: "var(--font-playfair),'Playfair Display',Georgia,serif",
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                fontWeight: 700,
                color: "#F8FAFC",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                marginBottom: "24px",
                whiteSpace: "pre-line",
              }}>
                {slide.headline}
              </h1>

              {/* sub */}
              <p style={{
                fontSize: "16px",
                color: "#94A3B8",
                lineHeight: 1.75,
                maxWidth: "480px",
                marginBottom: "40px",
              }}>
                {slide.sub}
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "52px" }}>
                <Link href={slide.ctaHref}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "13px 28px", borderRadius: "10px",
                    fontSize: "14.5px", fontWeight: 600,
                    background: slide.accent, color: "#0D0D1A",
                    textDecoration: "none",
                    transition: "opacity 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1";    e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <BookOpen size={15} strokeWidth={2} />
                  {slide.cta}
                </Link>
                <Link href="/browse"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "12px 24px", borderRadius: "10px",
                    fontSize: "14.5px", fontWeight: 500,
                    color: "#94A3B8",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    textDecoration: "none", background: "transparent",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#F8FAFC"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  See all genres
                </Link>
              </div>

              {/* stats */}
              <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                {[slide.stat1, slide.stat2].map((s, i) => (
                  <div key={i}>
                    <div style={{
                      fontFamily: "var(--font-playfair),'Playfair Display',serif",
                      fontSize: "26px", fontWeight: 700,
                      color: slide.accent, lineHeight: 1,
                    }}>
                      {s.val}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px", letterSpacing: "0.06em" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
                <div style={{ width: "0.5px", height: "36px", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ fontSize: "12px", color: "#64748B", maxWidth: "120px", lineHeight: 1.5 }}>
                  {slide.genre}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT — visual */}
        <div style={{ position: "relative", height: "400px" }} className="banner-visual">
          {/* glow ring */}
          <div style={{
            position: "absolute", inset: "10%",
            borderRadius: "50%",
            background: `radial-gradient(ellipse, ${slide.accent}0A 0%, transparent 70%)`,
            border: `0.5px solid ${slide.accent}15`,
            transition: "all 0.8s ease",
          }} />
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={`vis-${slide.id}`}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ position: "absolute", inset: 0 }}
            >
              <Visual type={slide.visual} accent={slide.accent} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── controls ── */}
      <div style={{
        position: "absolute", bottom: "40px", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: "16px", zIndex: 10,
      }}>
        <button onClick={prev} style={{
          width: "36px", height: "36px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.06)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          color: "#94A3B8", cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#F8FAFC"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94A3B8"; }}
        aria-label="Previous slide">
          <ChevronLeft size={16} />
        </button>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => go(i)}
              style={{
                width: i === current ? "24px" : "7px",
                height: "7px",
                borderRadius: "99px",
                background: i === current ? slide.accent : "rgba(255,255,255,0.2)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.3s ease",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button onClick={next} style={{
          width: "36px", height: "36px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.06)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          color: "#94A3B8", cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#F8FAFC"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94A3B8"; }}
        aria-label="Next slide">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── slide counter ── */}
      <div style={{
        position: "absolute", bottom: "44px", right: "40px",
        fontSize: "12px", color: "#4B5563", zIndex: 10,
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "0.08em",
      }}>
        0{current + 1} / 0{SLIDES.length}
      </div>

      {/* ── mobile responsive style ── */}
      <style>{`
        @media (max-width: 768px) {
          .banner-grid {
            grid-template-columns: 1fr !important;
            padding: 100px 24px 100px !important;
            gap: 32px !important;
          }
          .banner-visual {
            height: 240px !important;
          }
        }
      `}</style>
    </section>
  );
}
