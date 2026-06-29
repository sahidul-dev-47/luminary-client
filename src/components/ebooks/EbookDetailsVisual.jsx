"use client";

// components/ebooks/EbookDetailsVisual.jsx — CLIENT COMPONENT

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Tag,
  Calendar,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  Sparkles,
  Clock,
  Globe,
  Award,
} from "lucide-react";

// ── Particle canvas ─────────────────────────────────────────────────────────
function Particles({ rgb }) {
  const cvRef = useRef(null);
  const rgbRef = useRef(rgb);
  useEffect(() => { rgbRef.current = rgb; }, [rgb]);

  useEffect(() => {
    const cvs = cvRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let raf;
    const resize = () => {
      cvs.width = cvs.offsetWidth;
      cvs.height = cvs.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 45 }, () => ({
      x: Math.random() * 1600,
      y: Math.random() * 900,
      r: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.1,
      vy: -(Math.random() * 0.14 + 0.03),
      a: Math.random() * 0.18 + 0.04,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      const [r, g, b] = rgbRef.current.split(",");
      dots.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) p.y = cvs.height + 4;
        if (p.x < -4) p.x = cvs.width + 4;
        if (p.x > cvs.width + 4) p.x = -4;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={cvRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}

// ── Stars ───────────────────────────────────────────────────────────────────
function Stars({ rating = 4.8, accent }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          fill={s <= Math.round(rating) ? accent : "transparent"}
          stroke={s <= Math.round(rating) ? accent : "#334155"}
          strokeWidth={1.5}
        />
      ))}
      <span className="text-[12px] ml-1" style={{ color: accent, fontFamily: "'Inter',sans-serif" }}>
        {rating}
      </span>
      <span className="text-[11px] text-slate-600 ml-0.5">(2.4k reviews)</span>
    </div>
  );
}

// ── Pill ────────────────────────────────────────────────────────────────────
function Pill({ icon: Icon, label, accent, rgb }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide"
      style={{
        background: `rgba(${rgb},0.1)`,
        border: `0.5px solid rgba(${rgb},0.25)`,
        color: accent,
        backdropFilter: "blur(8px)",
        fontFamily: "'Inter',sans-serif",
      }}
    >
      {Icon && <Icon size={11} strokeWidth={2} />}
      {label}
    </span>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, accent, rgb, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-1 px-3 py-4 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center mb-1"
        style={{ background: `rgba(${rgb},0.12)` }}
      >
        <Icon size={15} style={{ color: accent }} strokeWidth={2} />
      </div>
      <span
        className="text-lg font-bold leading-none"
        style={{ color: accent, fontFamily: "'Playfair Display',serif" }}
      >
        {value}
      </span>
      <span
        className="text-[10px] tracking-wider uppercase text-center"
        style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function EbookDetailsVisual({ ebook, accentColor, accentRgb, dateStr }) {
  const [liked, setLiked] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Safety guard — ebook undefined হলে crash এড়াবে
  if (!ebook) return null;

  const color = accentColor;
  const rgb = accentRgb;

  const handleShare = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2200);
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <main className="min-h-screen bg-[#07070E] relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes lumPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.65)} }
        @keyframes spineShimmer {
          0%   { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
      `}</style>


     

    {/* ── BG: blurred cover ── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 w-full h-full"> 
          <Image
            src={ebook.coverImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            style={{
              filter: "blur(80px) saturate(0.4) brightness(0.15)",
              transform: "scale(1.1)",
            }}
            priority={false}
          />
        </div>
      </div>

      {/* ── Dark overlay ── */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(135deg, rgba(7,7,14,0.97) 0%, rgba(7,7,14,0.88) 50%, rgba(7,7,14,0.96) 100%)",
        }}
      />

      {/* ── Dot grid ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Accent glow ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `radial-gradient(ellipse 55% 50% at 15% 40%, rgba(${rgb},0.09) 0%, transparent 65%)`,
        }}
      />

      {/* ── Particles ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <Particles rgb={rgb} />
      </div>

      {/* ── Page content ── */}
      <div className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-24">

        {/* Back */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <Link
            href="/ebooks"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors duration-200 text-sm group"
            style={{ fontFamily: "'Inter',sans-serif" }}
          >
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.09)",
              }}
            >
              <ArrowLeft size={13} strokeWidth={2} />
            </span>
            Back to Library
          </Link>
        </motion.div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-start">

          {/* ── LEFT column ── */}
          <div className="flex flex-col items-center lg:items-start gap-6">

            {/* Cover + spine */}
            <motion.div
              {...fadeUp(0.05)}
              className="relative w-[220px] sm:w-[260px] lg:w-full max-w-[320px]"
              style={{ aspectRatio: "2/3" }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  boxShadow: `0 0 60px rgba(${rgb},0.18), 0 32px 64px rgba(0,0,0,0.6)`,
                }}
              />

              {/* Spine — signature element */}
              <div
                className="absolute left-0 top-0 bottom-0 z-10 rounded-l-2xl overflow-hidden"
                style={{ width: "18px" }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(180deg, rgba(${rgb},0.9) 0%, rgba(${rgb},0.4) 50%, rgba(${rgb},0.9) 100%)`,
                    backgroundSize: "100% 200%",
                    animation: "spineShimmer 4s linear infinite",
                  }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    transform: "rotate(180deg)",
                  }}
                >
                  <span
                    className="text-[8px] font-bold tracking-[0.2em] uppercase"
                    style={{ color: "rgba(7,7,14,0.7)", fontFamily: "'Inter',sans-serif" }}
                  >
                    {ebook.genre}
                  </span>
                </div>
              </div>

            
             {/* Cover image */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ left: "18px" }}
              >
                <div className="relative w-full h-full"> 
                  <Image
                    src={ebook.coverImage}
                    alt={ebook.title}
                    fill
                    className="object-cover"
                    priority={true} 
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(7,7,14,0.7) 0%, rgba(7,7,14,0.1) 40%, transparent 70%)",
                  }}
                />
              </div>

              {/* Status badge */}
              <div
                className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
                style={{
                  background:
                    ebook.status === "Sold"
                      ? "rgba(153,27,27,0.9)"
                      : "rgba(22,101,52,0.9)",
                  color: "white",
                  border: `0.5px solid ${ebook.status === "Sold" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                  backdropFilter: "blur(8px)",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                {ebook.status}
              </div>

              {/* Price overlay */}
              <div
                className="absolute bottom-0 left-[18px] right-0 px-4 py-3 z-20 rounded-br-2xl"
                style={{
                  background:
                    "linear-gradient(to top, rgba(7,7,14,0.92) 0%, transparent 100%)",
                }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color, fontFamily: "'Playfair Display',serif" }}
                >
                  {ebook.price ? `$${ebook.price}` : "Free"}
                </span>
              </div>
            </motion.div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-2 w-full max-w-[320px] lg:max-w-none">
              <StatCard icon={Star}     value="4.8" label="Rating" accent={color} rgb={rgb} delay={0.14} />
              <StatCard icon={BookOpen} value="320" label="Pages"  accent={color} rgb={rgb} delay={0.18} />
              <StatCard icon={Globe}    value="EN"  label="Lang"   accent={color} rgb={rgb} delay={0.22} />
            </div>

            {/* Save / Share */}
            <motion.div
              {...fadeUp(0.2)}
              className="flex items-center gap-3 w-full max-w-[320px] lg:max-w-none"
            >
              <button
                onClick={() => setLiked((l) => !l)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all duration-200"
                style={{
                  background: liked ? `rgba(${rgb},0.12)` : "rgba(255,255,255,0.04)",
                  border: `0.5px solid ${liked ? `rgba(${rgb},0.3)` : "rgba(255,255,255,0.08)"}`,
                  color: liked ? color : "#475569",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                <Heart
                  size={14}
                  fill={liked ? color : "transparent"}
                  stroke={liked ? color : "#475569"}
                  strokeWidth={1.5}
                />
                {liked ? "Saved" : "Save"}
              </button>

              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all duration-200 hover:text-slate-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  color: "#475569",
                  fontFamily: "'Inter',sans-serif",
                }}
              >
                <Share2 size={14} strokeWidth={1.5} />
                Share
              </button>
            </motion.div>
          </div>

          {/* ── RIGHT column ── */}
          <div className="flex flex-col">

            {/* Pills */}
            <motion.div {...fadeUp(0.08)} className="flex flex-wrap items-center gap-2 mb-5">
              <Pill icon={Tag}      label={ebook.genre} accent={color}     rgb={rgb}          />
              <Pill icon={Calendar} label={dateStr}      accent="#475569"   rgb="71,85,105"    />
              <Pill icon={Award}    label="Verified"     accent="#10B981"   rgb="16,185,129"   />
            </motion.div>

            {/* Title */}
            <motion.h1
              {...fadeUp(0.12)}
              className="leading-[1.06] tracking-[-0.03em] text-white mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
                textShadow: "0 2px 32px rgba(0,0,0,0.5)",
              }}
            >
              {ebook.title}
            </motion.h1>

            {/* Stars */}
            <motion.div {...fadeUp(0.15)} className="mb-5">
              <Stars rating={4.8} accent={color} />
            </motion.div>

            {/* Author */}
            <motion.div
              {...fadeUp(0.17)}
              className="flex items-center gap-3 mb-8 pb-8"
              style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: `rgba(${rgb},0.15)`,
                  border: `0.5px solid rgba(${rgb},0.25)`,
                  color,
                }}
              >
                {ebook.writerName?.[0] || "A"}
              </div>
              <div>
                <p
                  className="text-[13px] font-medium text-slate-200"
                  style={{ fontFamily: "'Inter',sans-serif" }}
                >
                  {ebook.writerName || "Unknown Author"}
                </p>
                <p className="text-[11px] text-slate-600" style={{ fontFamily: "'Inter',sans-serif" }}>
                  {ebook.writerEmail}
                </p>
              </div>
              <div
                className="ml-auto flex items-center gap-1.5 text-[11px]"
                style={{ color: "#10B981", fontFamily: "'Inter',sans-serif" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  style={{ animation: "lumPulse 2s infinite" }}
                />
                Active writer
              </div>
            </motion.div>

            {/* Description */}
            <motion.div {...fadeUp(0.2)} className="mb-10">
              <p
                className="text-[10.5px] font-semibold tracking-[0.14em] uppercase mb-3"
                style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}
              >
                About this book
              </p>
              <p
                className="text-slate-400 leading-[1.85] text-[15px]"
                style={{ fontFamily: "'Inter',sans-serif", fontWeight: 300 }}
              >
                {ebook.description}
              </p>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              {...fadeUp(0.24)}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10"
            >
              {[
                { icon: Clock,    label: "~4 hr read"      },
                { icon: BookOpen, label: "DRM-free PDF"     },
                { icon: Sparkles, label: "Instant download" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "0.5px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <Icon size={13} style={{ color, flexShrink: 0 }} strokeWidth={1.8} />
                  <span
                    className="text-[12px] text-slate-400"
                    style={{ fontFamily: "'Inter',sans-serif" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA card */}
            <motion.div {...fadeUp(0.28)}>
              <div
                className="rounded-2xl p-5 sm:p-6"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: `0.5px solid rgba(${rgb},0.15)`,
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Price */}
                <div className="flex items-end gap-3 mb-5">
                  <span
                    className="text-4xl font-bold"
                    style={{ color, fontFamily: "'Playfair Display',serif" }}
                  >
                    {ebook.price ? `$${ebook.price}` : "Free"}
                  </span>
                  {ebook.originalPrice && (
                    <span
                      className="text-slate-600 line-through text-lg mb-1"
                      style={{ fontFamily: "'Inter',sans-serif" }}
                    >
                      ${ebook.originalPrice}
                    </span>
                  )}
                  <span
                    className="ml-auto text-[11px] text-slate-500 mb-1"
                    style={{ fontFamily: "'Inter',sans-serif" }}
                  >
                    One-time purchase
                  </span>
                </div>

                {/*
                  ── Drop your EbookActions component here ──
                  <EbookActions ebook={ebook} accentColor={color} accentRgb={rgb} />
                */}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
                    style={{
                      background: color,
                      color: "#07070E",
                      fontFamily: "'Inter',sans-serif",
                      boxShadow: `0 4px 24px rgba(${rgb},0.28)`,
                    }}
                  >
                    <ShoppingCart size={15} strokeWidth={2.5} />
                    Buy Now
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>

                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 hover:text-slate-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "0.5px solid rgba(255,255,255,0.1)",
                      color: "#475569",
                      fontFamily: "'Inter',sans-serif",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    Preview sample
                  </button>
                </div>

                <p
                  className="text-center text-[11px] text-slate-700 mt-4"
                  style={{ fontFamily: "'Inter',sans-serif" }}
                >
                  🔒 Secure checkout · Instant delivery · 30-day refund
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Browse tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-20 pt-8 flex items-center gap-3 flex-wrap"
          style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}
        >
          <span
            className="text-[11px] tracking-wider uppercase text-slate-700"
            style={{ fontFamily: "'Inter',sans-serif" }}
          >
            Browse more
          </span>
          {[...new Set(["Fiction", ebook.genre, "New releases", "Staff picks"])].map((tag, i) => (
            <Link
              key={`${tag}-${i}`}
              href={`/browse?genre=${tag}`}
              className="px-3 py-1.5 rounded-full text-[11px] transition-colors duration-200 hover:text-slate-200"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                color: "#334155",
                fontFamily: "'Inter',sans-serif",
              }}
            >
              {tag}
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Share toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium"
            style={{
              background: "rgba(22,22,32,0.95)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              color: "#94A3B8",
              backdropFilter: "blur(16px)",
              fontFamily: "'Inter',sans-serif",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            ✓ Link copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}