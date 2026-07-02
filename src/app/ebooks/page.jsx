export const dynamic = 'force-dynamic';
import EbookGrid from "@/components/ebooks/EbookGrid";
import SearchBar from "@/components/ebooks/searchBar";
import React from "react";


const F  = "'Inter',system-ui,sans-serif";
const FD = "'Playfair Display',Georgia,serif";

async function getEbooks(sp) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const params = new URLSearchParams();
    if (sp?.search) params.set("search", sp.search);
    if (sp?.genre) params.set("genre", sp.genre);
    if (sp?.minPrice) params.set("minPrice", sp.minPrice);
    if (sp?.maxPrice) params.set("maxPrice", sp.maxPrice);
    if (sp?.sort) params.set("sort", sp.sort);
    if (sp?.page) params.set("page", sp.page);

    const res = await fetch(`${baseUrl}/api/ebooks?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  } catch (error) {
    console.error("Error fetching ebooks:", error);
    return { ebooks: [], total: 0, page: 1, totalPages: 1 };
  }
}

export default async function EbooksPage({ searchParams }) {
  const sp = await searchParams; // Next.js 15: searchParams is a Promise
  const data = await getEbooks(sp);
  const ebooks = data.ebooks || [];

  return (
    <main className="min-h-screen" style={{ background: "#07070E" }}>

      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "24px 24px", zIndex: 0 }} />

      <div className="relative z-10">

        {/* ── Page header ── */}
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 pt-20 sm:pt-24 lg:pt-28 pb-2 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-[11px] font-semibold tracking-widest uppercase"
            style={{ background: "rgba(244,196,48,0.1)", border: "0.5px solid rgba(244,196,48,0.25)", color: "#F4C430", fontFamily: F }}>
            ✦ Original ebooks
          </div>

          <div className="flex flex-col items-center gap-4 mb-8">
            <div>
              <h1 className="leading-[1.1] tracking-tight mb-3"
                style={{ fontFamily: FD, fontSize: "clamp(1.75rem,5vw,3rem)", fontWeight: 700, color: "#EDE9E0", letterSpacing: "-.02em" }}>
                Browse all{" "}
                <em style={{ fontStyle: "italic", fontWeight: 400, color: "#F4C430" }}>ebooks</em>
              </h1>
              <p className="text-[14px] max-w-[460px] mx-auto" style={{ color: "#334155", fontFamily: F, lineHeight: 1.7 }}>
                Explore original creations from independent writers — every genre, every mood.
              </p>
            </div>

            <div className="flex items-center gap-0 flex-shrink-0">
              {[
                { n: `${data.total ?? ebooks.length}`, l: "Titles" },
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

          <div style={{ height: "0.5px", background: "linear-gradient(90deg, rgba(244,196,48,0.3), rgba(244,196,48,0.05) 60%, transparent)" }} />
        </div>

        {/* ── Search + filters ── */}
        <SearchBar defaultValue={sp?.search || ""} resultCount={ebooks.length} />

        {/* ── Grid ── */}
        <EbookGrid ebooks={ebooks} />

        {/* ── Pagination ── */}
        {data.totalPages > 1 && (
          <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 pb-20 flex justify-center gap-2 flex-wrap">
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <a
                key={p}
                href={`?${new URLSearchParams({ ...sp, page: p }).toString()}`}
                className="w-9 h-9 flex items-center justify-center rounded-full text-sm"
                style={{
                  fontFamily: F,
                  background: p === data.page ? "#F4C430" : "rgba(255,255,255,0.05)",
                  color: p === data.page ? "#07070E" : "#94A3B8",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                }}
              >
                {p}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
