"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck, Wallet, Feather, Search, Sparkles, Users, ArrowRight,
} from "lucide-react";

// Each reason is presented as an old library due-date card — the kind
// glued inside the back cover, stamped every time a book changed hands.
// The "stamp" doubles as the stat, the ink color signals the theme.

const REASONS = [
  {
    Icon: Feather,
    stamp: "DIRECT",
    title: "Writers, unfiltered",
    body: "No publisher sits between the person who wrote the book and the person reading it. Every title comes straight from its author.",
    ink: "#F4C430",
  },
  {
    Icon: ShieldCheck,
    stamp: "VERIFIED",
    title: "Every writer checked",
    body: "Writers clear a one-time verification before they can publish, so the shelf stays free of throwaway uploads.",
    ink: "#B33A3A",
  },
  {
    Icon: Wallet,
    stamp: "SECURE PAY",
    title: "Stripe-backed checkout",
    body: "Payments run through Stripe. Your card details never touch our servers, and every purchase is recorded to your account.",
    ink: "#5EEAD4",
  },
  {
    Icon: Search,
    stamp: "FINDABLE",
    title: "Built to browse",
    body: "Search by title or writer, filter by genre, price, or availability, and sort the shelf however suits you.",
    ink: "#818CF8",
  },
  {
    Icon: Sparkles,
    stamp: "CURATED",
    title: "Featured on merit",
    body: "The home page surfaces titles by activity and admin pick, not by who paid for placement.",
    ink: "#F97316",
  },
  {
    Icon: Users,
    stamp: "OWNED",
    title: "Your library, kept",
    body: "Everything you buy stays on your account permanently, with a full purchase history you can revisit any time.",
    ink: "#D4537E",
  },
];

function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function StampCard({ r, i }) {
  const rgb = hexToRgb(r.ink);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative p-6 rounded-md flex flex-col gap-4"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
        border: "0.5px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* rotated stamp, like ink pressed at a careless angle */}
      <div
        className="absolute top-5 right-5 px-2.5 py-1 rounded-[3px] text-[10px] font-bold tracking-wider select-none"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: r.ink,
          border: `1.5px solid rgba(${rgb},0.55)`,
          transform: "rotate(6deg)",
          opacity: 0.85,
        }}
      >
        {r.stamp}
      </div>

      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `rgba(${rgb},0.14)`, border: `0.5px solid rgba(${rgb},0.3)` }}
      >
        <r.Icon size={19} strokeWidth={1.75} color={r.ink} />
      </div>

      <h3
        className="text-[17px] font-medium leading-tight"
        style={{ color: "#EDE9E0", fontFamily: "'Inter', sans-serif" }}
      >
        {r.title}
      </h3>
      <p
        className="text-[13.5px] leading-relaxed"
        style={{ color: "rgba(237,233,224,0.55)", fontFamily: "'Inter', sans-serif" }}
      >
        {r.body}
      </p>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  return (
    <main style={{ background: "#07070E", minHeight: "100vh" }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "repeating-linear-gradient(180deg, #EDE9E0 0px, #EDE9E0 1px, transparent 1px, transparent 42px)",
        }}
      />

      <section className="relative max-w-[1180px] mx-auto px-6 md:px-10 pt-28 pb-10 text-center">
        <div
          className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
          style={{ background: "rgba(244,196,48,0.12)", border: "0.5px solid rgba(244,196,48,0.3)", color: "#F4C430", fontFamily: "'JetBrains Mono', monospace" }}
        >
          Why Fable
        </div>
        <h1
          className="leading-[1.1] mb-5"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4.2vw, 3.2rem)", fontWeight: 700, color: "#EDE9E0" }}
        >
          A shelf you can actually <em style={{ fontStyle: "italic", fontWeight: 400, color: "#F4C430" }}>trust</em>
        </h1>
        <p
          className="max-w-[520px] mx-auto text-[14.5px] leading-relaxed"
          style={{ color: "rgba(237,233,224,0.5)", fontFamily: "'Inter', sans-serif" }}
        >
          Six reasons readers and writers keep coming back to Luminary — stamped,
          card-catalog style, the way every book here used to be checked out.
        </p>
      </section>

      <section className="relative max-w-[1180px] mx-auto px-6 md:px-10 pb-24">
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => <StampCard key={r.stamp} r={r} i={i} />)}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 flex flex-col items-center gap-5 text-center"
        >
          <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(237,233,224,0.6)", fontSize: "14px" }}>
            Ready to see what's on the shelf?
          </p>
          <Link
            href="/ebooks"
            className="group inline-flex items-center gap-2.5 pl-6 pr-5 py-3.5 rounded-sm text-[14px] font-semibold"
            style={{
              background: "#F4C430",
              color: "#07070E",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.02em",
              boxShadow: "0 12px 28px -10px rgba(244,196,48,0.45)",
              transition: "transform .2s cubic-bezier(.22,1,.36,1)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Browse Ebooks
            <ArrowRight size={15} strokeWidth={2.5} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}