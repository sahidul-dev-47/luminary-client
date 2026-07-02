"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, PenLine, TrendingUp } from "lucide-react";

const WRITERS = [
  {
    writerId: "placeholder-1",
    writerName: "Daniel Cole",
    totalSales: 128,
    tagline: "Sci-Fi & speculative fiction",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&fit=crop",
  },
  {
    writerId: "placeholder-2",
    writerName: "Marcus Reed",
    totalSales: 97,
    tagline: "Mystery & noir thrillers",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80&fit=crop",
  },
  {
    writerId: "placeholder-3",
    writerName: "Ethan Brooks",
    totalSales: 74,
    tagline: "Fantasy & epic sagas",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80&fit=crop",
  },
];

const PODIUM_ORDER = [1, 0, 2];
const ACCENTS = { 0: "#F4C430", 1: "#818CF8", 2: "#D4537E" };
const RGB = { "#F4C430": "244,196,48", "#818CF8": "129,140,248", "#D4537E": "212,83,126" };

function WriterCard({ writer, rank }) {
  const accent = ACCENTS[rank];
  const rgb = RGB[accent];
  const isFirst = rank === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: rank * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{ marginTop: isFirst ? 0 : 32 }}
    >
      <Link href={`/writers/${writer.writerId}`} className="block group relative">
        {/* Ghost rank numeral */}
        <span
          className="absolute select-none pointer-events-none"
          style={{
            top: isFirst ? -18 : -10,
            right: -6,
            fontFamily: "'Playfair Display',serif",
            fontWeight: 700,
            fontSize: isFirst ? 96 : 72,
            color: `rgba(${rgb},0.08)`,
            lineHeight: 1,
            zIndex: 0,
          }}
        >
          {rank + 1}
        </span>

        <div
          className="relative rounded-[24px] overflow-hidden transition-all duration-300"
          style={{
            background: "linear-gradient(155deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            border: `0.5px solid rgba(${rgb},${isFirst ? 0.35 : 0.14})`,
            boxShadow: isFirst ? `0 20px 60px -20px rgba(${rgb},0.35)` : "none",
            zIndex: 1,
          }}
        >
          {/* Photo Container */}
          <div
            className="relative overflow-hidden w-full"
            style={{
              aspectRatio: isFirst ? "4/4.8" : "4/4.2",
            }}
          >
            <img
              src={writer.avatar}
              alt={writer.writerName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ filter: "grayscale(15%)" }}
            />

            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, rgba(7,7,14,0.95) 0%, rgba(7,7,14,0.65) 45%, transparent 75%)`,
              }}
            />

            {isFirst && (
              <div
                className="absolute top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: accent,
                  boxShadow: `0 4px 20px rgba(${rgb},0.5)`,
                }}
              >
                <Crown size={16} strokeWidth={2.5} color="#07070E" />
              </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              <p
                className="leading-tight mb-1"
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: isFirst ? "clamp(1.35rem, 4vw, 1.65rem)" : "clamp(1.1rem, 3.5vw, 1.35rem)",
                  fontWeight: 700,
                  color: "#EDE9E0",
                }}
              >
                {writer.writerName}
              </p>
              <p
                className="text-[13px] md:text-[13.5px] mb-3"
                style={{ color: "#94A3B8", fontFamily: "'Inter',sans-serif" }}
              >
                {writer.tagline}
              </p>

              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: `rgba(${rgb},0.16)`,
                  border: `0.5px solid rgba(${rgb},0.35)`,
                  color: accent,
                  backdropFilter: "blur(6px)",
                }}
              >
                <TrendingUp size={13} strokeWidth={2.5} />
                {writer.totalSales} sales
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TopWriters() {
  return (
    <section className="relative py-16 md:py-20 px-4 sm:px-6 md:px-10 overflow-hidden" style={{ background: "#0A0A14" }}>
      {/* ambient glow */}
      <div
        className="absolute pointer-events-none hidden md:block"
        style={{
          top: "10%",
          left: "50%",
          width: 600,
          height: 600,
          transform: "translateX(-50%)",
          background: "radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1180px] mx-auto relative">
        <div className="mb-12 md:mb-14 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
            style={{ background: "rgba(129,140,248,0.12)", border: "0.5px solid rgba(129,140,248,0.3)", color: "#818CF8" }}>
            <PenLine size={11} strokeWidth={2.5} />
            Top writers
          </div>
          <h2 className="leading-[1.1] px-2" style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
            fontWeight: 700,
            color: "#EDE9E0"
          }}>
            Voices readers <em style={{ fontStyle: "italic", fontWeight: 400, color: "#818CF8" }}>keep coming back to</em>
          </h2>
        </div>

        <div className="max-w-[860px] mx-auto">
          <style>{`
            .writers-podium {
              display: grid;
              gap: 1.25rem;
              grid-template-columns: 1fr;
            }
            
            @media (min-width: 768px) {
              .writers-podium {
                grid-template-columns: repeat(3, 1fr);
                gap: 1.5rem;
              }
            }
            
            @media (max-width: 480px) {
              .writers-podium {
                gap: 1rem;
              }
            }
          `}</style>

          <div className="writers-podium">
            {PODIUM_ORDER.map((originalRank) => (
              <WriterCard
                key={WRITERS[originalRank].writerId}
                writer={WRITERS[originalRank]}
                rank={originalRank}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}