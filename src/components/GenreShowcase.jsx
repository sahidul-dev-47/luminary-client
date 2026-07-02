"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Feather, Ghost, HeartHandshake, Rocket, Wand2,
  BookOpen, UserRound, FlaskConical,
} from "lucide-react";

// Real libraries shelve fiction by author and non-fiction by subject
// (Dewey Decimal). The "code" on each card mirrors that split.

const GENRES = [
  { name: "Fiction",     Icon: Feather,        accent: "#F4C430", code: "FIC.813" },
  { name: "Mystery",     Icon: Ghost,          accent: "#818CF8", code: "MYS.364" },
  { name: "Romance",     Icon: HeartHandshake, accent: "#D4537E", code: "ROM.306" },
  { name: "Sci-Fi",      Icon: Rocket,         accent: "#10B981", code: "SFF.629" },
  { name: "Fantasy",     Icon: Wand2,          accent: "#F97316", code: "FAN.398" },
  { name: "Non-Fiction", Icon: BookOpen,       accent: "#A8A29E", code: "GEN.001" },
  { name: "Biography",   Icon: UserRound,      accent: "#C9A876", code: "BIO.920" },
  { name: "Science",     Icon: FlaskConical,   accent: "#60A5FA", code: "SCI.500" },
];

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function ShelfLabel({ label, sub }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="text-[11px] font-semibold tracking-[0.15em] uppercase"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "#F4C430" }}
      >
        {label}
      </span>
      <span className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
      <span
        className="text-[11px]"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(237,233,224,0.35)" }}
      >
        {sub}
      </span>
    </div>
  );
}

function GenreCard({ g, i, count }) {
  const rgb = hexToRgb(g.accent);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href="/ebooks"
        className="catalog-card group flex flex-col gap-5 p-5 pt-4 rounded-lg h-full"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderTop: `2px solid rgba(${rgb},0.55)`,
          transition: "transform .22s cubic-bezier(.22,1,.36,1), border-color .22s ease, box-shadow .22s ease, background .22s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.borderColor = `rgba(${rgb},0.4)`;
          e.currentTarget.style.boxShadow = `0 16px 32px -12px rgba(${rgb},0.28)`;
          e.currentTarget.style.background = `rgba(${rgb},0.06)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.background = "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))";
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="catalog-hole w-3 h-3 rounded-full"
            style={{ background: "#07070E", boxShadow: "inset 0 0 0 1.5px rgba(237,233,224,0.15)", transition: "box-shadow .2s ease" }}
          />
          <span
            className="text-[10px] tracking-wider"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: `rgba(${rgb},0.75)` }}
          >
            {g.code}
          </span>
        </div>

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          style={{ background: `rgba(${rgb},0.14)`, border: `0.5px solid rgba(${rgb},0.3)` }}
        >
          <g.Icon size={19} strokeWidth={1.75} color={g.accent} />
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-medium leading-tight" style={{ color: "#EDE9E0", fontFamily: "'Inter',sans-serif" }}>
              {g.name}
            </span>
            <span
              className="text-[11px]"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(237,233,224,0.4)" }}
            >
              {count === null ? "…" : `${count} book${count === 1 ? "" : "s"}`}
            </span>
          </div>
          <span
            className="pull-hint text-[11px] flex-shrink-0"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: g.accent }}
          >
            pull →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function GenreShowcase() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchCounts() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/v1/home/genre-counts`);
        const data = await res.json();
        if (!cancelled && data?.success) {
          setCounts(data.counts || {});
        }
      } catch (err) {
        console.error("Failed to load genre counts:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCounts();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative py-20 px-6 md:px-10 overflow-hidden" style={{ background: "#07070E" }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "repeating-linear-gradient(180deg, #EDE9E0 0px, #EDE9E0 1px, transparent 1px, transparent 42px)",
        }}
      />

      <div className="max-w-[1180px] mx-auto relative">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div
              className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
              style={{ background: "rgba(244,196,48,0.12)", border: "0.5px solid rgba(244,196,48,0.3)", color: "#F4C430" }}
            >
              Explore
            </div>
            <h2
              className="leading-[1.1]"
              style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: "#EDE9E0" }}
            >
              Pick a <em style={{ fontStyle: "italic", fontWeight: 400, color: "#F4C430" }}>genre</em>, start reading
            </h2>
          </div>
          <p
            className="text-[13px] max-w-[300px]"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(237,233,224,0.4)", letterSpacing: "0.02em" }}
          >
            8 shelves — tap a card to browse every title.
          </p>
        </div>

        <style>{`
          .genre-grid{ display:grid; gap:16px; grid-template-columns:repeat(2,1fr); }
          @media(min-width:640px){ .genre-grid{ grid-template-columns:repeat(4,1fr); } }
          .catalog-card .pull-hint{ opacity:0; transform:translateX(-4px); transition:opacity .2s ease, transform .2s ease; }
          .catalog-card:hover .pull-hint{ opacity:1; transform:translateX(0); }
          .catalog-card:hover .catalog-hole{ box-shadow: inset 0 0 0 1.5px rgba(237,233,224,0.35); }
          @media (prefers-reduced-motion: reduce){
            .catalog-card, .catalog-card *{ transition:none !important; animation:none !important; }
          }
        `}</style>

        <ShelfLabel label="Genres" sub="8 shelves" />
        <div className="genre-grid">
          {GENRES.map((g, i) => (
            <GenreCard
              key={g.name}
              g={g}
              i={i}
              count={loading ? null : (counts[g.name] ?? 0)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}