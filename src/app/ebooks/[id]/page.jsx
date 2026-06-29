// app/ebooks/[id]/page.jsx  — SERVER COMPONENT (no "use client")

import EbookDetailsVisual from "@/components/ebooks/EbookDetailsVisual";
import { getUserSession } from "@/lib/core/session";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";


const ACCENT_MAP = {
  Mystery:  { color: "#C9A227", rgb: "201,162,39"  },
  "Sci-Fi": { color: "#818CF8", rgb: "129,140,248" },
  Romance:  { color: "#E879F9", rgb: "232,121,249" },
  Fantasy:  { color: "#34D399", rgb: "52,211,153"  },
  default:  { color: "#A78BFA", rgb: "167,139,250" },
};
const getAccent = (genre) => ACCENT_MAP[genre] || ACCENT_MAP.default;

async function getEbookDetails(id) {
  try {
    const baseUrl = process.env.NEXT_BASE_PUBLIC_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/api/ebooks/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function EbookDetailsPage(props) {
  const user = await getUserSession()
  const params = await props.params;
  const id = params.id;
  const ebook = await getEbookDetails(id);

  if (!ebook) return <NotFoundUI />;

  const { color, rgb } = getAccent(ebook.genre);
  const dateStr = ebook.createdAt
    ? new Date(ebook.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "N/A";

  return (
    <EbookDetailsVisual
      ebook={ebook}
      accentColor={color}
      accentRgb={rgb}
      dateStr={dateStr}
      user={user}
    />
  );
}

function NotFoundUI() {
  return (
    <main className="min-h-screen bg-[#07070E] flex items-center justify-center">
      <div className="text-center px-6">
        <ShieldAlert size={60} className="mx-auto mb-6 text-slate-600" />
        <h2
          className="text-3xl font-semibold text-white mb-3"
          style={{ fontFamily: "'Playfair Display',serif" }}
        >
          Ebook Not Found
        </h2>
        <p className="text-slate-500 mb-8 text-sm" style={{ fontFamily: "'Inter',sans-serif" }}>
          This book may have been removed or never existed.
        </p>
        <Link
          href="/ebooks"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-[#07070E] bg-white hover:opacity-90 transition"
          style={{ fontFamily: "'Inter',sans-serif" }}
        >
          ← Back to Library
        </Link>
      </div>
    </main>
  );
}