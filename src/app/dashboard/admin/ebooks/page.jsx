"use client";

import { useEffect, useMemo, useState } from "react";
import { Fraunces, Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookMarked,
  CheckCircle2,
  CircleSlash,
  Eye,
  EyeOff,
  Loader2,
  Search,
  SlidersHorizontal,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

// Same tokens as the rest of the admin panel (Ledger / Membership Roll)
// so the three admin screens read as one product, not three.
const PALETTE = {
  gold: "#D4A657",
  rose: "#E2836F",
  teal: "#6FBF9A",
  ink: "#0B0D14",
  card: "#161922",
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "Published", label: "Published" },
  { key: "Unpublished", label: "Unpublished" },
];

export default function ManageEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [busyId, setBusyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEbooks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/ebooks`);
      const data = await res.json();

      if (data.success) {
        setEbooks(data.ebooks);
        setError("");
      } else {
        setError(data.message || "Failed to load ebooks");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot connect to server. Check backend URL.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  const handleToggleStatus = async (book) => {
    setBusyId(book._id);
    const nextStatus = book.status === "Published" ? "Unpublished" : "Published";

    setEbooks((prev) => prev.map((b) => (b._id === book._id ? { ...b, status: nextStatus } : b)));

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/ebooks/${book._id}/toggle-status`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message || "Failed to update status");

      toast.success(
        data.status === "Published" ? `"${book.title}" is now published` : `"${book.title}" was unpublished`
      );
    } catch (err) {
      setEbooks((prev) => prev.map((b) => (b._id === book._id ? { ...b, status: book.status } : b)));
      toast.error(err.message || "Could not update status");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/ebooks/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete ebook");

      setEbooks((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      toast.success(`"${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Could not delete ebook");
    } finally {
      setDeleting(false);
    }
  };

  const filteredEbooks = useMemo(() => {
    return ebooks.filter((b) => {
      const matchesQuery =
        !query ||
        b.title?.toLowerCase().includes(query.toLowerCase()) ||
        b.writerName?.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [ebooks, query, statusFilter]);

  const stats = useMemo(() => {
    const total = ebooks.length;
    const published = ebooks.filter((b) => b.status === "Published").length;
    return { total, published, unpublished: total - published };
  }, [ebooks]);

  return (
    <div
      className={`${display.variable} ${body.variable} ${body.className} flex min-h-screen text-[#F4F1EA]`}
      style={{ backgroundColor: PALETTE.ink }}
    >
      <DashboardSidebar />

      {/*
        FIX: the sidebar sits inline in this flex row (it is not position:fixed),
        so flex-1 alone already gives <main> the remaining width. The previous
        `md:ml-60` added a *second* offset on top of that, shoving all content
        far to the right of the sidebar. min-w-0 stops the table from forcing
        the flex item wider than the viewport on smaller desktop sizes.
      */}
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 md:px-10 md:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#8B90A3]">
            <BookMarked size={12} style={{ color: PALETTE.teal }} /> The Stacks
          </span>
          <h1 className={`${display.className} text-4xl italic text-[#F4F1EA] md:text-5xl`}>
            Manage Ebooks
          </h1>
          <p className="mt-1 text-sm text-[#8B90A3]">
            Review the shelf, publish what's ready, retire what isn't.
          </p>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total titles" value={stats.total} icon={BookMarked} accent={PALETTE.gold} />
          <StatCard label="Published" value={stats.published} icon={CheckCircle2} accent={PALETTE.teal} />
          <StatCard label="Unpublished" value={stats.unpublished} icon={CircleSlash} accent="#8B90A3" />
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6070]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or writer…"
              className="w-full rounded-xl border border-white/10 bg-[#161922] py-2.5 pl-10 pr-3 text-sm text-[#F4F1EA] placeholder:text-[#5C6070] outline-none transition focus:border-[#D4A657]/50 focus:ring-2 focus:ring-[#D4A657]/20"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <SlidersHorizontal size={14} className="hidden shrink-0 text-[#5C6070] sm:block" />
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className="shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all"
                style={
                  statusFilter === f.key
                    ? { borderColor: `${PALETTE.gold}66`, backgroundColor: `${PALETTE.gold}18`, color: PALETTE.gold }
                    : { borderColor: "rgba(255,255,255,0.1)", color: "#8B90A3" }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#161922] py-16 text-center">
            <TriangleAlert size={22} style={{ color: PALETTE.rose }} />
            <p className="text-sm text-[#8B90A3]">{error}</p>
            <button
              onClick={fetchEbooks}
              className="mt-2 rounded-lg border border-white/10 px-4 py-1.5 text-xs text-[#F4F1EA] transition hover:border-[#D4A657]/50"
            >
              Retry
            </button>
          </div>
        ) : filteredEbooks.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 bg-[#161922]/60 py-16 text-center">
            <BookMarked size={22} className="text-[#5C6070]" />
            <p className={`${display.className} text-lg italic text-[#8B90A3]`}>Empty shelf</p>
            <p className="text-xs text-[#5C6070]">No ebooks match your filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-white/[0.06] bg-[#161922] md:block">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left text-xs uppercase tracking-wider text-[#8B90A3]">
                      <th className="p-4 font-semibold">Title</th>
                      <th className="p-4 font-semibold">Writer</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {filteredEbooks.map((book) => (
                        <EbookRow
                          key={book._id}
                          book={book}
                          busy={busyId === book._id}
                          onToggle={() => handleToggleStatus(book)}
                          onDelete={() => setDeleteTarget(book)}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
              <AnimatePresence initial={false}>
                {filteredEbooks.map((book) => (
                  <EbookCard
                    key={book._id}
                    book={book}
                    busy={busyId === book._id}
                    onToggle={() => handleToggleStatus(book)}
                    onDelete={() => setDeleteTarget(book)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      <DeleteModal
        book={deleteTarget}
        deleting={deleting}
        onCancel={() => (deleting ? null : setDeleteTarget(null))}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#161922] p-5">
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-[0.12] blur-2xl"
        style={{ background: accent }}
      />
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}1A`, color: accent }}
      >
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div>
        <p className={`${display.className} text-3xl leading-none text-[#F4F1EA]`}>{value}</p>
        <p className="mt-1 text-xs text-[#8B90A3]">{label}</p>
      </div>
    </div>
  );
}

// The spine: a thin colored bar that stands in for a shelf tag —
// teal when the title is out on the shelf, quiet gray when it's in the back room.
function Spine({ status }) {
  const isPublished = status === "Published";
  return (
    <span
      className="inline-block h-8 w-1 rounded-full"
      style={{ backgroundColor: isPublished ? PALETTE.teal : "#3A3D4A" }}
    />
  );
}

function StatusBadge({ status }) {
  const isPublished = status === "Published";
  const color = isPublished ? PALETTE.teal : "#8B90A3";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  );
}

function ActionButtons({ book, busy, onToggle, onDelete }) {
  const isPublished = book.status === "Published";
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={onToggle}
        disabled={busy}
        title={isPublished ? "Unpublish" : "Publish"}
        className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all disabled:cursor-not-allowed disabled:opacity-50"
        style={
          isPublished
            ? { borderColor: "rgba(255,255,255,0.1)", color: "#8B90A3" }
            : { borderColor: `${PALETTE.gold}55`, color: PALETTE.gold, backgroundColor: `${PALETTE.gold}0F` }
        }
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : isPublished ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
      <button
        onClick={onDelete}
        title="Delete"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-all hover:border-[#E2836F]/50 hover:bg-[#E2836F]/10"
        style={{ color: PALETTE.rose }}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function EbookRow({ book, busy, onToggle, onDelete }) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.02]"
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Spine status={book.status} />
          <img
            src={book.coverImage || "/placeholder.jpg"}
            alt={book.title}
            className="h-14 w-10 rounded-md border border-white/10 object-cover"
          />
          <span className="font-medium text-[#F4F1EA]">{book.title}</span>
        </div>
      </td>
      <td className="p-4 text-[#8B90A3]">{book.writerName || "Unknown"}</td>
      <td className="p-4 font-semibold" style={{ color: PALETTE.gold }}>
        ${book.price}
      </td>
      <td className="p-4">
        <StatusBadge status={book.status} />
      </td>
      <td className="p-4">
        <ActionButtons book={book} busy={busy} onToggle={onToggle} onDelete={onDelete} />
      </td>
    </motion.tr>
  );
}

function EbookCard({ book, busy, onToggle, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-white/[0.06] bg-[#161922] p-4"
    >
      <div className="flex gap-3">
        <img
          src={book.coverImage || "/placeholder.jpg"}
          alt={book.title}
          className="h-20 w-14 shrink-0 rounded-md border border-white/10 object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex items-start gap-2">
            <Spine status={book.status} />
            <div className="min-w-0">
              <p className="truncate font-medium text-[#F4F1EA]">{book.title}</p>
              <p className="truncate text-xs text-[#8B90A3]">{book.writerName || "Unknown"}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-semibold" style={{ color: PALETTE.gold }}>${book.price}</span>
            <StatusBadge status={book.status} />
          </div>
        </div>
      </div>
      <div className="mt-3 border-t border-white/[0.05] pt-3">
        <ActionButtons book={book} busy={busy} onToggle={onToggle} onDelete={onDelete} />
      </div>
    </motion.div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-2xl border border-white/[0.06] bg-[#161922]" />
      ))}
    </div>
  );
}

function DeleteModal({ book, deleting, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      {book && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/10 p-6"
            style={{ backgroundColor: PALETTE.card }}
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${PALETTE.rose}1A`, color: PALETTE.rose }}
              >
                <TriangleAlert size={20} />
              </div>
              <button onClick={onCancel} disabled={deleting} className="text-[#5C6070] transition-colors hover:text-[#F4F1EA]">
                <X size={18} />
              </button>
            </div>

            <h2 className={`${display.className} mt-4 text-xl italic text-[#F4F1EA]`}>
              Take this off the shelf?
            </h2>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <img
                src={book.coverImage || "/placeholder.jpg"}
                alt={book.title}
                className="h-14 w-10 shrink-0 rounded-md border border-white/10 object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#F4F1EA]">{book.title}</p>
                <p className="truncate text-xs text-[#8B90A3]">{book.writerName || "Unknown writer"}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#8B90A3]">
              This removes the title from the catalog permanently, including its sales history link. Readers who already bought it keep their copy.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onCancel}
                disabled={deleting}
                className="flex-1 rounded-xl bg-white/5 py-2.5 text-sm font-medium text-[#8B90A3] transition-all hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white shadow-lg transition-all disabled:opacity-60"
                style={{ backgroundColor: PALETTE.rose }}
              >
                {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}