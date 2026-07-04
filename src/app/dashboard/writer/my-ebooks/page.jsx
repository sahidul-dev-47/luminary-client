"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import StatusBadge from "@/components/writer/StatusBadge";
import {
  Pencil, Trash2, Loader2, BookX, PlusCircle,
  Clock, CheckCircle2, AlertTriangle, X,
} from "lucide-react";
import { authFetch } from "@/lib/clientFetch";



const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending Approval" },
  { key: "published", label: "Published" },
];

export default function MyEbooksPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [tab, setTab] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchEbooks = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await authFetch(`/api/v1/writer/ebooks?writerId=${user.id}`);
      const data = await res.json();
      if (data.success) setEbooks(data.ebooks);
    } catch (err) {
      console.error("Failed to load ebooks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    setBusyId(id);
    try {
      const res = await authFetch(`/api/v1/writer/ebooks/${id}?writerId=${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setEbooks((prev) => prev.filter((e) => e._id !== id));
      } else {
        console.error("Delete failed:", data.message);
      }
    } catch (err) {
      console.error("Failed to delete ebook", err);
    } finally {
      setBusyId(null);
      setDeleteTarget(null);
    }
  };

  const { pending, published, counts } = useMemo(() => {
    const pending = ebooks.filter((b) => b.status !== "Published");
    const published = ebooks.filter((b) => b.status === "Published");
    return { pending, published, counts: { all: ebooks.length, pending: pending.length, published: published.length } };
  }, [ebooks]);

  const visible = tab === "pending" ? pending : tab === "published" ? published : ebooks;

  return (
    <div>
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#F4C430]/80 font-semibold mb-1">
            Manage
          </p>
          <h1 className="font-serif text-2xl text-[#F8FAFC]">My ebooks</h1>
        </div>
        <Link
          href="/dashboard/writer/add-ebook"
          className="flex items-center gap-2 px-4 py-[10px] rounded-xl text-[13px] font-semibold text-[#0D0D1A] bg-[#F4C430] hover:opacity-90 hover:-translate-y-0.5 transition-all"
        >
          <PlusCircle size={15} /> Add new ebook
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all"
            style={
              tab === t.key
                ? { borderColor: "rgba(244,196,48,0.4)", backgroundColor: "rgba(244,196,48,0.1)", color: "#F4C430" }
                : { borderColor: "rgba(255,255,255,0.08)", color: "#94A3B8" }
            }
          >
            {t.label}
            <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {tab === "pending" && counts.pending > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#F4C430]/20 bg-[#F4C430]/[0.06] px-4 py-3">
          <Clock size={15} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#F4C430]" />
          <p className="text-[12.5px] leading-relaxed text-[#94A3B8]">
            These titles are waiting on an admin to review them. Once approved, they'll move to the
            Published tab and appear in Browse Ebooks automatically — no action needed from you.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-[#94A3B8] text-[13.5px] py-16 justify-center">
          <Loader2 size={16} className="animate-spin" /> Loading your ebooks…
        </div>
      ) : ebooks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center rounded-2xl border border-dashed border-white/10">
          <BookX size={26} className="text-[#4B5563]" strokeWidth={1.5} />
          <p className="text-[#94A3B8] text-[13.5px]">You haven't added anything yet.</p>
          <Link href="/dashboard/writer/add-ebook" className="text-[13px] font-semibold text-[#F4C430] hover:underline">
            Add your first ebook
          </Link>
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center rounded-2xl border border-dashed border-white/10">
          <CheckCircle2 size={22} className="text-[#4B5563]" strokeWidth={1.5} />
          <p className="text-[#94A3B8] text-[13px]">Nothing in this tab right now.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#12121F] text-[11px] uppercase tracking-wider text-[#64748B]">
                  <th className="px-5 py-3.5 font-medium">Ebook</th>
                  <th className="px-5 py-3.5 font-medium">Genre</th>
                  <th className="px-5 py-3.5 font-medium">Price</th>
                  <th className="px-5 py-3.5 font-medium">Sold</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((book) => (
                  <tr key={book._id} className="border-t border-white/6 hover:bg-white/[0.025] transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-12 rounded-md bg-[#1A1A2A] overflow-hidden shrink-0 relative ring-1 ring-white/5 group-hover:ring-[#F4C430]/20 transition-all">
                          {book.coverImage && (
                            <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
                          )}
                        </div>
                        <span className="text-[13.5px] text-[#F8FAFC] font-medium line-clamp-1">
                          {book.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12.5px] text-[#94A3B8]">{book.genre}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#F8FAFC]">${Number(book.price).toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[#94A3B8]">{book.soldCount || 0}</td>
                    <td className="px-5 py-3.5">
                      {book.status === "Published" ? (
                        <StatusBadge status={book.status} />
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4C430]/10 px-3 py-1 text-[11px] font-medium text-[#F4C430]">
                          <Clock size={11} /> Awaiting review
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/writer/edit-ebook/${book._id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#818CF8] hover:bg-[#818CF8]/10 transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(book)}
                          disabled={busyId === book._id}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#F87171] hover:bg-[#F87171]/10 transition-colors disabled:opacity-40"
                        >
                          {busyId === book._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ─────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => busyId ? null : setDeleteTarget(null)}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(7,7,14,0.7)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: "#0F0F1A", border: "0.5px solid rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.25)" }}
                >
                  <AlertTriangle size={19} style={{ color: "#F87171" }} strokeWidth={1.8} />
                </div>
                <button
                  onClick={() => !busyId && setDeleteTarget(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#475569] hover:text-[#94A3B8] hover:bg-white/5 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", color: "#F8FAFC", marginBottom: 8 }}>
                Delete this ebook?
              </h3>
              <p className="text-[13px] leading-relaxed mb-1" style={{ color: "#94A3B8", fontFamily: "'Inter',sans-serif" }}>
                You're about to permanently delete
              </p>
              <p className="text-[13.5px] font-semibold mb-4" style={{ color: "#F4C430", fontFamily: "'Inter',sans-serif" }}>
                "{deleteTarget.title}"
              </p>
              <p className="text-[12px] mb-6" style={{ color: "#64748B", fontFamily: "'Inter',sans-serif" }}>
                This cannot be undone. Sales history for this title will remain, but the listing itself will be gone.
              </p>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={!!busyId}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-colors disabled:opacity-50"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#CBD5E1", fontFamily: "'Inter',sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={!!busyId}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-60"
                  style={{ background: "#EF4444", color: "#FFF", fontFamily: "'Inter',sans-serif" }}
                >
                  {busyId ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}