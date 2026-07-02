"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, ArrowUpRight, BookOpen } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const ACCENTS = ["#F4C430", "#818CF8", "#D4537E", "#10B981", "#F97316", "#818CF8"];

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
      <div style={{ aspectRatio: "3/4", background: "rgba(255,255,255,0.05)" }} />
      <div className="p-4 space-y-2">
        <div className="h-3 rounded" style={{ width: "70%", background: "rgba(255,255,255,0.06)" }} />
        <div className="h-2.5 rounded" style={{ width: "40%", background: "rgba(255,255,255,0.05)" }} />
      </div>
    </div>
  );
}

function EbookCard({ book, rank }) {
  const accent = ACCENTS[rank % ACCENTS.length];
  const sold = book.soldCount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: rank * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link href={`/ebooks/${book._id}`} className="block">
        <div className="relative rounded-2xl overflow-hidden mb-3"
          style={{ aspectRatio: "3/4", background: `rgba(${hexToRgb(accent)},0.08)`, border: "0.5px solid rgba(255,255,255,0.08)" }}>
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={32} color={accent} strokeWidth={1.5} />
            </div>
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to top, rgba(7,7,14,0.85), transparent 60%)" }} />

          {/* Rank + sold badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
            style={{ background: "rgba(7,7,14,0.75)", border: `0.5px solid rgba(${hexToRgb(accent)},0.4)`, color: accent, backdropFilter: "blur(6px)" }}>
            <Flame size={10} strokeWidth={2.5} />
            {sold > 0 ? `${sold} sold` : "New"}
          </div>

          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: accent, color: "#07070E" }}>
            <ArrowUpRight size={12} strokeWidth={3} />
          </div>
        </div>

        <p className="text-[13px] font-medium leading-snug mb-0.5 line-clamp-1" style={{ color: "#EDE9E0", fontFamily: "'Inter',sans-serif" }}>
          {book.title}
        </p>
        <p className="text-[11px] mb-1.5" style={{ color: "#475569", fontFamily: "'Inter',sans-serif" }}>
          {book.writerName || "Unknown Writer"}
        </p>
        <p className="text-[13px] font-semibold" style={{ color: accent }}>
          ${Number(book.price || 0).toFixed(2)}
        </p>
      </Link>
    </motion.div>
  );
}

function hexToRgb(hex) {
  const map = { "#F4C430": "244,196,48", "#818CF8": "129,140,248", "#D4537E": "212,83,126", "#10B981": "16,185,129", "#F97316": "249,115,22" };
  return map[hex] || "255,255,255";
}

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(false);
        // Reuses the existing /api/ebooks list endpoint (default sort = newest first,
        // status: Published). No dedicated "featured" route needed — the moment a
        // writer publishes a new ebook it's #1 here automatically.
        const res = await fetch(`${API_BASE}/api/ebooks?limit=6&page=1`);
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        if (!cancelled) setEbooks(data.ebooks || []);
      } catch (e) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative py-20 px-6 md:px-10" style={{ background: "#07070E" }}>
      <div className="max-w-[1180px] mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
              style={{ background: "rgba(244,196,48,0.12)", border: "0.5px solid rgba(244,196,48,0.3)", color: "#F4C430" }}>
              <Flame size={11} strokeWidth={2.5} />
              Fresh off the shelf
            </div>
            <h2 className="leading-[1.1]" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 700, color: "#EDE9E0" }}>
              Just <em style={{ fontStyle: "italic", fontWeight: 400, color: "#F4C430" }}>published</em>
            </h2>
          </div>
          <Link href="/browse"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-200"
            style={{ color: "#475569", fontFamily: "'Inter',sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.color = "#F4C430"}
            onMouseLeave={e => e.currentTarget.style.color = "#475569"}>
            Browse all ebooks <ArrowUpRight size={14} />
          </Link>
        </div>

        {error && (
          <p className="text-[13px]" style={{ color: "#64748B", fontFamily: "'Inter',sans-serif" }}>
            Couldn't load featured ebooks right now. Please try again shortly.
          </p>
        )}

        {!error && (
          <>
            <style>{`
              .featured-grid{ display:grid; gap:20px; grid-template-columns:repeat(2,1fr); }
              @media(min-width:640px){ .featured-grid{ grid-template-columns:repeat(3,1fr); } }
              @media(min-width:1024px){ .featured-grid{ grid-template-columns:repeat(6,1fr); } }
            `}</style>
            <div className="featured-grid">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : ebooks.length === 0
                  ? <p style={{ gridColumn: "1/-1", color: "#334155", fontFamily: "'Inter',sans-serif", fontSize: 13 }}>No published ebooks yet — check back soon.</p>
                  : ebooks.map((book, i) => <EbookCard key={book._id} book={book} rank={i} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
