export const dynamic = 'force-dynamic';
import React from "react";
import EbookGrid from "@/components/ebooks/EbookGrid";

const F  = "'Inter',system-ui,sans-serif";
const FD = "'Playfair Display',Georgia,serif";

async function getEbooks() {
  try {
    const baseUrl = process.env.NEXT_BASE_PUBLIC_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/api/ebooks`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  } catch (error) {
    console.error("Error fetching ebooks:", error);
    return [];
  }
}

export default async function EbooksPage() {
  const ebooks = await getEbooks();

  return (
    <main className="min-h-screen" style={{ background: "#07070E" }}>

      {/* dot grid texture */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "24px 24px", zIndex: 0 }} />

      <div className="relative z-10">

        {/* ── Page header ── */}
        <div className="max-w-[1180px] mx-auto px-10 pt-28 pb-2">
          {/* eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-[11px] font-semibold tracking-widest uppercase"
            style={{ background: "rgba(244,196,48,0.1)", border: "0.5px solid rgba(244,196,48,0.25)", color: "#F4C430", fontFamily: F }}>
            ✦ Original ebooks
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h1 className="leading-[1.1] tracking-tight mb-3"
                style={{ fontFamily: FD, fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, color: "#EDE9E0", letterSpacing: "-.02em" }}>
                Browse all{" "}
                <em style={{ fontStyle: "italic", fontWeight: 400, color: "#F4C430" }}>ebooks</em>
              </h1>
              <p className="text-[14px] max-w-[460px]" style={{ color: "#334155", fontFamily: F, lineHeight: 1.7 }}>
                Explore original creations from independent writers — every genre, every mood.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-0 flex-shrink-0">
              {[
                { n: `${ebooks.length}`, l: "Titles" },
                { n: "3.4K", l: "Writers" },
                { n: "4.9★", l: "Avg rating" },
              ].map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className={i === 0 ? "pr-5 text-right" : "px-5 text-right"}>
                    <div className="text-[20px] font-bold leading-none mb-0.5"
                      style={{ fontFamily: FD, color: "#F4C430" }}>{s.n}</div>
                    <div className="text-[10px] tracking-wider" style={{ color: "#1E293B", fontFamily: F }}>{s.l}</div>
                  </div>
                  {i < 2 && <div className="w-px h-6" style={{ background: "rgba(255,255,255,0.07)" }} />}
                </div>
              ))}
            </div>
          </div>

          {/* thin gold rule */}
          <div style={{ height: "0.5px", background: "linear-gradient(90deg, rgba(244,196,48,0.3), rgba(244,196,48,0.05) 60%, transparent)" }} />
        </div>

        {/* ── Grid ── */}
        <EbookGrid ebooks={ebooks} />
      </div>
    </main>
  );
}
