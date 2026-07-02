"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

// Each question is filed like a catalog card with a call number.
// Clicking a tab "pulls" the card forward and reveals the answer.

const FAQS = [
  {
    q: "How do I buy an ebook?",
    a: "Open any ebook's details page and click Buy Now. You'll be taken to a Stripe checkout — once payment succeeds, the ebook is marked as yours and its full content unlocks immediately.",
    code: "FAQ.001",
  },
  {
    q: "Do I need an account to browse?",
    a: "No. Anyone can browse titles, search, filter, and read ebook details without logging in. You only need an account to purchase, bookmark, or publish.",
    code: "FAQ.002",
  },
  {
    q: "How do writers publish on Fable?",
    a: "Register and choose the Writer role, complete a one-time verification payment, then use the Writer dashboard to add a title with a cover, description, price, and genre.",
    code: "FAQ.003",
  },
  {
    q: "What happens after I purchase an ebook?",
    a: "The purchase is added to your account's history immediately, and the ebook stays accessible from your dashboard for as long as your account exists — no re-buying, no expiry.",
    code: "FAQ.004",
  },
  {
    q: "Can I sell the same ebook to more than one reader?",
    a: "Yes — a purchase gives one reader access to that title, it doesn't remove it from the shelf. Your Sales History tracks every individual sale and buyer.",
    code: "FAQ.005",
  },
  {
    q: "What if I forget I already bought a book?",
    a: "Every ebook card shows a Sold badge to buyers who already own it, and the details page swaps the purchase button for an Already Purchased label.",
    code: "FAQ.006",
  },
];

function FAQCard({ item, isOpen, onToggle }) {
  return (
    <div
      className="rounded-md overflow-hidden"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
        border: `0.5px solid ${isOpen ? "rgba(244,196,48,0.35)" : "rgba(255,255,255,0.08)"}`,
        transition: "border-color .2s ease",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 text-left px-5 py-4"
        style={{ background: "transparent" }}
      >
        <span
          className="flex-shrink-0 text-[10px] tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: isOpen ? "#F4C430" : "rgba(237,233,224,0.35)" }}
        >
          {item.code}
        </span>
        <span
          className="flex-1 text-[14.5px] font-medium"
          style={{ color: "#EDE9E0", fontFamily: "'Inter', sans-serif" }}
        >
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ border: "0.5px solid rgba(244,196,48,0.4)", color: "#F4C430" }}
        >
          <Plus size={13} strokeWidth={2.25} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p
              className="px-5 pb-5 pl-[68px] text-[13.5px] leading-relaxed"
              style={{ color: "rgba(237,233,224,0.55)", fontFamily: "'Inter', sans-serif" }}
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative py-20 px-6 md:px-10" style={{ background: "#07070E" }}>
      <div className="max-w-[760px] mx-auto">
        <div className="mb-12 text-center">
          <div
            className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase"
            style={{ background: "rgba(244,196,48,0.12)", border: "0.5px solid rgba(244,196,48,0.3)", color: "#F4C430", fontFamily: "'JetBrains Mono', monospace" }}
          >
            Reference Desk
          </div>
          <h2
            className="leading-[1.1]"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#EDE9E0" }}
          >
            Frequently asked <em style={{ fontStyle: "italic", fontWeight: 400, color: "#F4C430" }}>questions</em>
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => (
            <FAQCard
              key={item.code}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}