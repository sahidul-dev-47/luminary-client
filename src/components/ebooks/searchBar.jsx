"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, ChevronDown, Check, SlidersHorizontal } from "lucide-react";

const F  = "'Inter',system-ui,sans-serif";
const FD = "'Playfair Display',Georgia,serif";

const GENRES = ["Fiction",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Horror",
  "Thriller",
  "Poetry",
  "Non-Fiction",
  "Biography",
  "Personal Development",
  "Science",
  "Marketing",
  "Design",
  "Technology",
  "History",
  "Medicine & Health",
  "Religion"


];
const SORTS = [
  { value: "",           label: "Newest first" },
  { value: "price_low",  label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];
const PRICE_PRESETS = [
  { label: "Under $10",  min: "", max: "10" },
  { label: "$10 – $25",  min: "10", max: "25" },
  { label: "$25 – $50",  min: "25", max: "50" },
  { label: "$50+",       min: "50", max: "" },
];

export default function SearchBar({ defaultValue = "", resultCount = 0 }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(defaultValue);
  const [openMenu, setOpenMenu] = useState(null); 
  const wrapRef = useRef(null);

  const activeGenre = searchParams.get("genre") || "";
  const activeSort = searchParams.get("sort") || "";
  const activeMin = searchParams.get("minPrice") || "";
  const activeMax = searchParams.get("maxPrice") || "";

  const [minDraft, setMinDraft] = useState(activeMin);
  const [maxDraft, setMaxDraft] = useState(activeMax);

  // debounce the text search
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((searchParams.get("search") || "") === value.trim()) return;
      updateParams({ search: value.trim() || null, page: "1" });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenMenu(null);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function updateParams(patch) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, val]) => {
      if (val === null || val === "") params.delete(key);
      else params.set(key, val);
    });
    if (!("page" in patch)) params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  function selectGenre(g) {
    updateParams({ genre: g === activeGenre ? null : g });
    setOpenMenu(null);
  }

  function selectSort(s) {
    updateParams({ sort: s || null });
    setOpenMenu(null);
  }

  function applyPrice(min = minDraft, max = maxDraft) {
    updateParams({ minPrice: min || null, maxPrice: max || null });
    setOpenMenu(null);
  }

  function applyPreset(p) {
    setMinDraft(p.min);
    setMaxDraft(p.max);
    applyPrice(p.min, p.max);
  }

  function clearAll() {
    setValue("");
    setMinDraft("");
    setMaxDraft("");
    router.push(pathname);
  }

  const hasPriceFilter = activeMin || activeMax;
  const hasAnyFilter = activeGenre || activeSort || hasPriceFilter || defaultValue;

  const priceLabel = hasPriceFilter
    ? `$${activeMin || "0"} – ${activeMax ? `$${activeMax}` : "∞"}`
    : "Price";

  const sortLabel = SORTS.find((s) => s.value === activeSort)?.label || "Sort";

  return (
    <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 mb-8" ref={wrapRef} style={{ fontFamily: F }}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-3">

        {/* ── Search input ── */}
        <div className="relative w-full lg:w-auto lg:max-w-[360px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#475569" }} />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search by title, writer, or genre..."
            className="w-full pl-10 pr-9 py-2.5 rounded-full text-sm outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "0.5px solid rgba(255,255,255,0.1)",
              color: "#EDE9E0",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(244,196,48,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />
          {value && (
            <button
              onClick={() => setValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" style={{ color: "#475569" }} />
            </button>
          )}
        </div>

        {/* ── Filter pills ── */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Genre */}
          <div className="relative">
            <FilterPill
              label={activeGenre || "Genre"}
              active={!!activeGenre}
              open={openMenu === "genre"}
              onClick={() => setOpenMenu(openMenu === "genre" ? null : "genre")}
            />
            {openMenu === "genre" && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-52 rounded-xl overflow-hidden"
                style={{ background: "#0D0D16", border: "0.5px solid rgba(255,255,255,0.1)", boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}>
                <div className="max-h-64 overflow-y-auto py-1.5">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => selectGenre(g)}
                      className="w-full flex items-center justify-between px-4 py-2 text-left text-sm transition-colors"
                      style={{ color: g === activeGenre ? "#F4C430" : "#CBD5E1" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {g}
                      {g === activeGenre && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="relative">
            <FilterPill
              label={priceLabel}
              active={!!hasPriceFilter}
              open={openMenu === "price"}
              onClick={() => setOpenMenu(openMenu === "price" ? null : "price")}
            />
            {openMenu === "price" && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-72 rounded-xl p-4"
                style={{ background: "#0D0D16", border: "0.5px solid rgba(255,255,255,0.1)", boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {PRICE_PRESETS.map((p) => {
                    const isActive = activeMin === p.min && activeMax === p.max;
                    return (
                      <button
                        key={p.label}
                        onClick={() => applyPreset(p)}
                        className="px-3 py-1.5 rounded-full text-[12px] transition-colors"
                        style={{
                          border: "0.5px solid rgba(255,255,255,0.1)",
                          background: isActive ? "rgba(244,196,48,0.12)" : "rgba(255,255,255,0.03)",
                          color: isActive ? "#F4C430" : "#94A3B8",
                        }}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] tracking-wider uppercase mb-2" style={{ color: "#475569" }}>
                  Custom range
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px]" style={{ color: "#475569" }}>$</span>
                    <input
                      type="number"
                      min="0"
                      value={minDraft}
                      onChange={(e) => setMinDraft(e.target.value)}
                      placeholder="Min"
                      className="w-full pl-6 pr-2 py-1.5 rounded-lg text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", color: "#EDE9E0" }}
                    />
                  </div>
                  <span style={{ color: "#334155" }}>–</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px]" style={{ color: "#475569" }}>$</span>
                    <input
                      type="number"
                      min="0"
                      value={maxDraft}
                      onChange={(e) => setMaxDraft(e.target.value)}
                      placeholder="Max"
                      className="w-full pl-6 pr-2 py-1.5 rounded-lg text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", color: "#EDE9E0" }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => applyPrice()}
                  className="w-full py-2 rounded-lg text-[13px] font-semibold transition-opacity hover:opacity-90"
                  style={{ background: "#F4C430", color: "#07070E" }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <FilterPill
              icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
              label={sortLabel}
              active={!!activeSort}
              open={openMenu === "sort"}
              onClick={() => setOpenMenu(openMenu === "sort" ? null : "sort")}
            />
            {openMenu === "sort" && (
              <div className="absolute right-0 lg:left-0 top-[calc(100%+8px)] z-20 w-52 rounded-xl overflow-hidden py-1.5"
                style={{ background: "#0D0D16", border: "0.5px solid rgba(255,255,255,0.1)", boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}>
                {SORTS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => selectSort(s.value)}
                    className="w-full flex items-center justify-between px-4 py-2 text-left text-sm transition-colors"
                    style={{ color: s.value === activeSort ? "#F4C430" : "#CBD5E1" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {s.label}
                    {s.value === activeSort && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasAnyFilter && (
            <button
              onClick={clearAll}
              className="text-[12px] px-2 transition-colors"
              style={{ color: "#475569" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F4C430")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Result count ── */}
      {defaultValue && (
        <div className="mt-3 text-[12px]" style={{ color: "#475569" }}>
          {resultCount} result{resultCount !== 1 ? "s" : ""} for "{defaultValue}"
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, icon, active, open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] transition-colors whitespace-nowrap"
      style={{
        fontFamily: F,
        background: active ? "rgba(244,196,48,0.12)" : "rgba(255,255,255,0.04)",
        border: active ? "0.5px solid rgba(244,196,48,0.35)" : "0.5px solid rgba(255,255,255,0.1)",
        color: active ? "#F4C430" : "#94A3B8",
      }}
    >
      {icon}
      {label}
      <ChevronDown className="w-3.5 h-3.5 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }} />
    </button>
  );
}
