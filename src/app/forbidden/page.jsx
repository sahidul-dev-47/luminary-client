"use client";

// app/forbidden/page.jsx  — 403 Forbidden Page
// Place at: src/app/forbidden/page.jsx
// Or use as a component wherever needed.

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, BookOpen, ShieldOff } from "lucide-react";

const COLOR    = "#EF4444";
const RGB      = "239,68,68";
const CODE     = "403";
const LABEL    = "Forbidden";

// ── Particle canvas ──────────────────────────────────────
function Particles({ rgb }) {
  const cvRef = useRef(null);
  useEffect(() => {
    const cvs = cvRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    let raf;
    const resize = () => { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 35 }, () => ({
      x: Math.random() * 1600, y: Math.random() * 900,
      r: Math.random() * 1.1 + 0.2,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -(Math.random() * 0.1 + 0.02),
      a: Math.random() * 0.15 + 0.03,
    }));
    const [r, g, b] = rgb.split(",");
    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      dots.forEach((p) => {
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
  }, [rgb]);
  return <canvas ref={cvRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }} />;
}

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-[#07070E] relative overflow-hidden flex items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes lumPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }
        @keyframes lockShake {
          0%,100%{ transform: rotate(0deg) scale(1); }
          15%    { transform: rotate(-6deg) scale(1.05); }
          30%    { transform: rotate(6deg) scale(1.05); }
          45%    { transform: rotate(-4deg); }
          60%    { transform: rotate(4deg); }
          75%    { transform: rotate(-2deg); }
        }
        .lock-icon:hover { animation: lockShake 0.55s ease; }
      `}</style>

      {/* BG layers */}
      <div className="fixed inset-0" style={{ zIndex: 0, background: "linear-gradient(135deg, #07070E 0%, #120810 50%, #07070E 100%)" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: `radial-gradient(ellipse 60% 55% at 50% 50%, rgba(${RGB},0.07) 0%, transparent 65%)` }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <Particles rgb={RGB} />
      </div>

      {/* Ghost code — background typography */}
      <div
        className="fixed select-none pointer-events-none"
        style={{
          zIndex: 1,
          fontFamily: "'Playfair Display',serif",
          fontSize: "clamp(18rem, 35vw, 32rem)",
          fontWeight: 700,
          color: `rgba(${RGB},0.04)`,
          lineHeight: 1,
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          letterSpacing: "-0.05em",
          userSelect: "none",
        }}
      >
        {CODE}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">

        {/* Animated lock icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div
            className="lock-icon w-20 h-20 rounded-2xl flex items-center justify-center cursor-default mx-auto"
            style={{
              background: `rgba(${RGB},0.1)`,
              border: `0.5px solid rgba(${RGB},0.25)`,
              boxShadow: `0 0 40px rgba(${RGB},0.12), inset 0 0 20px rgba(${RGB},0.05)`,
            }}
          >
            <Lock size={34} style={{ color: COLOR }} strokeWidth={1.5} />
          </div>

          {/* Pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            className="absolute rounded-2xl pointer-events-none"
            style={{
              width: 80, height: 80,
              border: `1px solid rgba(${RGB},0.3)`,
              top: 0, left: "50%", transform: "translateX(-50%)",
            }}
          />
        </motion.div>

        {/* Error code + label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-4"
        >
          <span
            className="text-[11px] font-bold tracking-[0.22em] uppercase px-3 py-1.5 rounded-full"
            style={{
              background: `rgba(${RGB},0.1)`,
              border: `0.5px solid rgba(${RGB},0.25)`,
              color: COLOR,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            {CODE} · {LABEL}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
            fontWeight: 700,
            color: "#EDE9E0",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}
        >
          This shelf is{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: COLOR }}>
            locked
          </em>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-[14px] leading-[1.75] mb-10"
          style={{ color: "#475569", fontFamily: "'Inter',sans-serif", fontWeight: 300 }}
        >
          You don't have permission to access this page.
          This section is restricted to certain roles only.
          If you believe this is a mistake, please contact support.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full"
        >
          <Link
            href="/"
            className="flex-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
            style={{
              background: COLOR,
              color: "#07070E",
              fontFamily: "'Inter',sans-serif",
              boxShadow: `0 4px 20px rgba(${RGB},0.25)`,
            }}
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            Go home
          </Link>

          <Link
            href="/ebooks"
            className="flex-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 hover:text-slate-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.1)",
              color: "#475569",
              fontFamily: "'Inter',sans-serif",
              backdropFilter: "blur(8px)",
            }}
          >
            <BookOpen size={14} strokeWidth={1.8} />
            Browse ebooks
          </Link>
        </motion.div>

        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 flex items-center gap-2"
          style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}
        >
          <ShieldOff size={12} strokeWidth={1.5} />
          <span className="text-[11px] tracking-wide">
            Access denied · Role insufficient
          </span>
        </motion.div>
      </div>
    </main>
  );
}