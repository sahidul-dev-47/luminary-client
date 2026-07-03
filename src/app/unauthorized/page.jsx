"use client";


import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { KeyRound, ArrowRight, BookOpen, UserX } from "lucide-react";

const COLOR = "#818CF8";
const RGB   = "129,140,248";
const CODE  = "401";
const LABEL = "Unauthorized";

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

// ── Floating key animation ───────────────────────────────
function FloatingKey({ color, rgb }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 relative"
    >
      {/* Outer glow ring — slow rotate */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          width: 88, height: 88,
          margin: "auto",
          background: `conic-gradient(from 0deg, rgba(${rgb},0.0) 0%, rgba(${rgb},0.3) 50%, rgba(${rgb},0.0) 100%)`,
          borderRadius: "50%",
        }}
      />

      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto relative z-10"
        style={{
          background: `rgba(${rgb},0.1)`,
          border: `0.5px solid rgba(${rgb},0.25)`,
          boxShadow: `0 0 40px rgba(${rgb},0.14), inset 0 0 20px rgba(${rgb},0.05)`,
        }}
      >
        {/* Dashed orbit ring */}
        <div
          className="absolute inset-[-10px] rounded-full pointer-events-none"
          style={{ border: `1px dashed rgba(${rgb},0.18)` }}
        />
        <KeyRound size={32} style={{ color }} strokeWidth={1.5} />
      </div>

      {/* Pulse rings */}
      {[1.4, 1.8].map((scale, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, scale], opacity: [0.25, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 80, height: 80,
            border: `1px solid rgba(${rgb},0.3)`,
            top: 0, left: "50%", transform: "translateX(-50%)",
          }}
        />
      ))}
    </motion.div>
  );
}

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#07070E] relative overflow-hidden flex items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        @keyframes lumPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }
      `}</style>

      {/* BG layers */}
      <div className="fixed inset-0" style={{ zIndex: 0, background: "linear-gradient(135deg, #07070E 0%, #0D0B1A 50%, #07070E 100%)" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: `radial-gradient(ellipse 60% 55% at 50% 50%, rgba(${RGB},0.07) 0%, transparent 65%)` }} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <Particles rgb={RGB} />
      </div>

      {/* Ghost code */}
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

        <FloatingKey color={COLOR} rgb={RGB} />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
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
          Who goes{" "}
          <em style={{ fontStyle: "italic", fontWeight: 400, color: COLOR }}>
            there?
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
          You need to sign in before entering this library.
          Your session may have expired, or you haven't logged in yet.
          Please authenticate to continue reading.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full"
        >
          <Link
            href="/login"
            className="flex-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
            style={{
              background: COLOR,
              color: "#07070E",
              fontFamily: "'Inter',sans-serif",
              boxShadow: `0 4px 20px rgba(${RGB},0.25)`,
            }}
          >
            Sign in
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>

          <Link
            href="/register"
            className="flex-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 hover:text-slate-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.1)",
              color: "#475569",
              fontFamily: "'Inter',sans-serif",
              backdropFilter: "blur(8px)",
            }}
          >
            Create account
          </Link>
        </motion.div>

        {/* Browse without login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-5"
        >
          <Link
            href="/ebooks"
            className="inline-flex items-center gap-1.5 text-[12px] transition-colors duration-200 hover:text-slate-300"
            style={{ color: "#334155", fontFamily: "'Inter',sans-serif" }}
          >
            <BookOpen size={12} strokeWidth={1.8} />
            Continue browsing as guest
          </Link>
        </motion.div>

        {/* Bottom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-8 flex items-center gap-2"
          style={{ color: "#1E293B", fontFamily: "'Inter',sans-serif" }}
        >
          <UserX size={12} strokeWidth={1.5} />
          <span className="text-[11px] tracking-wide">
            No active session found
          </span>
        </motion.div>
      </div>
    </main>
  );
}