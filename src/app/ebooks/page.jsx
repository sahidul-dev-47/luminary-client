export const dynamic = 'force-dynamic';
import EbookGrid from "@/components/ebooks/EbookGrid";
import SearchBar from "@/components/ebooks/searchBar";
import React from "react";

const F = "'Inter', system-ui, sans-serif";
const FD = "'Playfair Display', Georgia, serif";

async function getEbooks(sp) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const params = new URLSearchParams();

    if (sp?.search) params.set("search", sp.search);
    if (sp?.genre) params.set("genre", sp.genre);
    if (sp?.minPrice) params.set("minPrice", sp.minPrice);
    if (sp?.maxPrice) params.set("maxPrice", sp.maxPrice);
    if (sp?.sort) params.set("sort", sp.sort);

    // Pagination - 10 per page
    params.set("page", sp?.page || "1");
    params.set("limit", "10");

    const res = await fetch(`${baseUrl}/api/ebooks?${params.toString()}`, {
      cache: "no-store"
    });

    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  } catch (error) {
    console.error("Error fetching ebooks:", error);
    return { ebooks: [], total: 0, page: 1, totalPages: 1 };
  }
}

export default async function EbooksPage({ searchParams }) {
  const sp = await searchParams;
  const data = await getEbooks(sp);

  const ebooks = data.ebooks || [];
  const currentPage = parseInt(data.page) || 1;
  const totalPages = data.totalPages || 1;

  // Smart pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <main className="min-h-screen" style={{ background: "#07070E" }}>

      <div
        className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "24px 24px", zIndex: 0 }}
      />

      <div className="relative z-10">

        {/* ── Page header ── */}
        <div className="max-w-[1180px] mx-auto px-4 sm:px-8 lg:px-10 pt-16 sm:pt-24 lg:pt-28 pb-2 flex flex-col items-center text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 sm:mb-5 text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase text-center"
            style={{ background: "rgba(244,196,48,0.1)", border: "0.5px solid rgba(244,196,48,0.25)", color: "#F4C430", fontFamily: F }}
          >
            ✦ Original ebooks
          </div>

          <div className="flex flex-col items-center gap-4 mb-6 sm:mb-8 w-full">
            <div className="w-full">
              <h1
                className="leading-[1.1] tracking-tight mb-2 sm:mb-3"
                style={{ fontFamily: FD, fontSize: "clamp(1.5rem,6vw,3rem)", fontWeight: 700, color: "#EDE9E0", letterSpacing: "-.02em" }}
              >
                Browse all{" "}
                <em style={{ fontStyle: "italic", fontWeight: 400, color: "#F4C430" }}>ebooks</em>
              </h1>
              <p
                className="text-[13px] sm:text-[14px] max-w-[460px] mx-auto px-2"
                style={{ color: "#334155", fontFamily: F, lineHeight: 1.7 }}
              >
                Explore original creations from independent writers — every genre, every mood.
              </p>
            </div>

            <div className="flex items-center gap-0 flex-shrink-0 flex-wrap justify-center">
              {[
                { n: `${data.total ?? ebooks.length}`, l: "Titles" },
                { n: "3.4K", l: "Writers" },
                { n: "4.9★", l: "Avg rating" },
              ].map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className={i === 0 ? "pr-3 sm:pr-5 text-right" : "px-3 sm:px-5 text-right"}>
                    <div
                      className="text-[16px] sm:text-[20px] font-bold leading-none mb-0.5"
                      style={{ fontFamily: FD, color: "#F4C430" }}
                    >
                      {s.n}
                    </div>
                    <div className="text-[9px] sm:text-[10px] tracking-wider" style={{ color: "#1E293B", fontFamily: F }}>
                      {s.l}
                    </div>
                  </div>
                  {i < 2 && <div className="w-px h-6" style={{ background: "rgba(255,255,255,0.07)" }} />}
                </div>
              ))}
            </div>
          </div>

          <div
            className="w-full"
            style={{ height: "0.5px", background: "linear-gradient(90deg, rgba(244,196,48,0.3), rgba(244,196,48,0.05) 60%, transparent)" }}
          />
        </div>

        {/* ── Search + filters ── */}
        <SearchBar defaultValue={sp?.search || ""} resultCount={ebooks.length} />

        {/* ── Grid ── */}
        <EbookGrid ebooks={ebooks} />

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="max-w-[1180px] mx-auto px-4 sm:px-8 lg:px-10 pb-14 sm:pb-20 flex justify-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Previous Button */}
            <a
              href={`?${new URLSearchParams({ ...sp, page: Math.max(1, currentPage - 1) }).toString()}`}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-1 transition-all whitespace-nowrap ${
                currentPage === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-white/10'
              }`}
              style={{ fontFamily: F, color: "#94A3B8", border: "0.5px solid rgba(255,255,255,0.1)" }}
            >
              ← <span className="hidden sm:inline">Prev</span>
            </a>

            {/* Page Numbers */}
            {pageNumbers.map((p, i) => (
              <a
                key={i}
                href={`?${new URLSearchParams({ ...sp, page: p }).toString()}`}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-xs sm:text-sm flex-shrink-0"
                style={{
                  fontFamily: F,
                  background: p === currentPage ? "#F4C430" : "rgba(255,255,255,0.05)",
                  color: p === currentPage ? "#07070E" : "#94A3B8",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                }}
              >
                {p}
              </a>
            ))}

            {/* Next Button */}
            <a
              href={`?${new URLSearchParams({ ...sp, page: Math.min(totalPages, currentPage + 1) }).toString()}`}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-1 transition-all whitespace-nowrap ${
                currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-white/10'
              }`}
              style={{ fontFamily: F, color: "#94A3B8", border: "0.5px solid rgba(255,255,255,0.1)" }}
            >
              <span className="hidden sm:inline">Next</span> →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
