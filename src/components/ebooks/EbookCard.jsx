"use client";

import { motion } from "framer-motion";
import { Tag, DollarSign, ShoppingCart, CheckCircle, User, BookOpen } from "lucide-react";
import Link from "next/link";

const ACCENT_MAP = {
  Mystery:   { color: "#C9A227", rgb: "244,196,48"  },
  "Sci-Fi":  { color: "#818CF8", rgb: "129,140,248" },
  Romance:   { color: "#D4537E", rgb: "212,83,126"  },
  Fantasy:   { color: "#10B981", rgb: "16,185,129"  },
  Horror:    { color: "#F97316", rgb: "249,115,22"  },
  Thriller:  { color: "#F97316", rgb: "249,115,22"  },
  Fiction:   { color: "#818CF8", rgb: "129,140,248" },
  Biography: { color: "#10B981", rgb: "16,185,129"  },
  default:   { color: "#F4C430", rgb: "244,196,48"  },
};

const getAccent = (genre) => ACCENT_MAP[genre] || ACCENT_MAP.default;

const cardVariants = {
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function EbookCard({ ebook }) {
  const { _id, title, writerName, price, genre, status, coverImage, description } = ebook;
  const sold = status === "Sold";
  const { color, rgb } = getAccent(genre);
  const F  = "'Inter',system-ui,sans-serif";
  const FD = "'Playfair Display',Georgia,serif";

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative flex flex-col rounded-2xl overflow-hidden will-change-transform"
      style={{
        background:  "rgba(14,14,26,0.92)",
        border:      "0.5px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(10px)",
        transition:  "border-color .25s, box-shadow .25s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `rgba(${rgb},0.28)`;
        e.currentTarget.style.boxShadow   = `0 8px 32px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(${rgb},0.15)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.boxShadow   = "none";
      }}
    >
      {/* ── Cover image ──────────────────────────────── */}
      <Link href={`/ebooks/${_id}`} className="relative block overflow-hidden" style={{ height: 220 }}>
        <img
          src={coverImage || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=75"}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ transform: "scale(1)", transition: "transform .5s ease" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />

        {/* dark bottom gradient */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(7,7,14,0.85) 0%, rgba(7,7,14,0.1) 55%, transparent 100%)" }} />

        {/* description tooltip on hover */}
        <div className="absolute inset-0 flex items-end p-3 opacity-0 transition-opacity duration-300"
          style={{ background: "rgba(7,7,14,0.6)", backdropFilter: "blur(4px)" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "1"}
          onMouseLeave={e => e.currentTarget.style.opacity = "0"}>
          {description && (
            <p className="text-[11px] italic leading-relaxed line-clamp-3"
              style={{ color: "#94A3B8", fontFamily: F }}>{description}</p>
          )}
        </div>

        {/* spine line (book feel) */}
        <div className="absolute left-0 inset-y-0 w-1.5" style={{ background: `rgba(${rgb},0.5)` }} />
      </Link>

      {/* ── Genre badge — top left ── */}
      <div className="absolute top-3 left-4 z-10">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase"
          style={{ background: `rgba(${rgb},0.15)`, color, border: `0.5px solid rgba(${rgb},0.3)`, fontFamily: F }}>
          <Tag size={9} strokeWidth={2.2} />
          {genre}
        </span>
      </div>

      {/* ── Status badge — top right ── */}
      <div className="absolute top-3 right-3 z-10">
        {sold ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: "rgba(248,113,113,0.15)", color: "#F87171", border: "0.5px solid rgba(248,113,113,0.3)", fontFamily: F }}>
            Sold
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ background: "rgba(16,185,129,0.12)", color: "#10B981", border: "0.5px solid rgba(16,185,129,0.28)", fontFamily: F }}>
            Available
          </span>
        )}
      </div>

      {/* ── Card body ──────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <Link href={`/ebooks/${_id}`}
          className="block text-[14.5px] font-bold leading-snug line-clamp-1 mb-1.5 transition-colors duration-150"
          style={{ fontFamily: FD, color: "#EDE9E0" }}
          onMouseEnter={e => e.currentTarget.style.color = color}
          onMouseLeave={e => e.currentTarget.style.color = "#EDE9E0"}>
          {title}
        </Link>

        {/* Writer */}
        <div className="flex items-center gap-1.5 mb-4" style={{ color: "#334155" }}>
          <User size={12} strokeWidth={1.8} />
          <span className="text-[12px] hover:underline cursor-pointer transition-colors duration-150"
            style={{ fontFamily: F }}
            onMouseEnter={e => e.currentTarget.style.color = "#64748B"}
            onMouseLeave={e => e.currentTarget.style.color = "#334155"}>
            {writerName}
          </span>
        </div>

        {/* Divider */}
        <div className="mt-auto pt-3" style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between">
            {/* Price */}
            <div className="flex items-baseline gap-0.5">
              <DollarSign size={13} strokeWidth={2.2} style={{ color }} />
              <span className="text-[18px] font-bold leading-none" style={{ fontFamily: FD, color }}>
                {price.toFixed(2)}
              </span>
            </div>

            {/* Action button */}
            <Link href={`/ebooks/${_id}`}>
              <button
                disabled={sold}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold transition-all duration-200 active:scale-95"
                style={
                  sold
                    ? { background: "rgba(255,255,255,0.04)", color: "#334155", border: "0.5px solid rgba(255,255,255,0.07)", cursor: "not-allowed", fontFamily: F }
                    : { background: color, color: "#07070E", border: "none", cursor: "pointer", fontFamily: F, boxShadow: `0 4px 14px rgba(${rgb},0.3)` }
                }
                onMouseEnter={e => { if (!sold) e.currentTarget.style.opacity = ".87"; }}
                onMouseLeave={e => { if (!sold) e.currentTarget.style.opacity = "1"; }}>
                {sold
                  ? <><CheckCircle size={13} strokeWidth={2} />Owned</>
                  : <><ShoppingCart size={13} strokeWidth={2} />Buy now</>
                }
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
