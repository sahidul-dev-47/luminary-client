"use client";

import { useEffect, useMemo, useState } from "react";
import { Fraunces, Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import {
  Receipt,
  Search,
  Copy,
  Check,
  X,
  Loader2,
  TriangleAlert,
  Wallet,
  Users,
  Hash,
  Calendar,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

// Same tokens used across Ledger / Membership Roll / The Stacks —
// one visual language across the admin panel.
const PALETTE = {
  gold: "#D4A657",
  rose: "#E2836F",
  teal: "#6FBF9A",
  ink: "#0B0D14",
  card: "#161922",
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const fmtMoney = (n) => `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
const fmtDateTime = (d) => new Date(d).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/transactions`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
        setError("");
      } else {
        setError(data.message || "Failed to load");
      }
    } catch (err) {
      console.error(err);
      setError("Cannot connect to server. Check backend URL.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (t) =>
        t.buyerEmail?.toLowerCase().includes(q) ||
        t.writerEmail?.toLowerCase().includes(q) ||
        t.transactionId?.toLowerCase().includes(q)
    );
  }, [transactions, query]);

  const stats = useMemo(() => {
    const total = transactions.length;
    const revenue = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const buyers = new Set(transactions.map((t) => t.buyerEmail)).size;
    return { total, revenue, buyers };
  }, [transactions]);

  return (
    <div
      className={`${display.variable} ${body.variable} ${body.className} flex min-h-screen text-[#F4F1EA]`}
      style={{ backgroundColor: PALETTE.ink }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <DashboardSidebar />

      {/*
        FIX: DashboardSidebar isn't position:fixed, so the flex row already
        reserves its width. The old `md:ml-60` stacked a second offset on
        top of that and pushed everything far right of the sidebar.
      */}
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 md:px-10 md:py-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#8B90A3]">
              <Receipt size={12} style={{ color: PALETTE.rose }} /> The Register
            </span>
            <h1 className={`${display.className} mt-2 text-4xl italic text-[#F4F1EA] md:text-5xl`}>
              All Transactions
            </h1>
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C6070]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search buyer, writer, or ID…"
              className="w-full rounded-xl border border-white/10 bg-[#161922] py-2.5 pl-10 pr-4 text-sm text-[#F4F1EA] placeholder:text-[#5C6070] outline-none transition focus:border-[#D4A657]/50 focus:ring-2 focus:ring-[#D4A657]/20"
            />
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-8 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total transactions" value={stats.total} icon={Receipt} accent={PALETTE.rose} />
          <StatCard label="Total revenue" value={fmtMoney(stats.revenue)} icon={Wallet} accent={PALETTE.gold} />
          <StatCard label="Unique buyers" value={stats.buyers} icon={Users} accent={PALETTE.teal} />
        </div>

        {/* Content */}
        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#161922] py-16 text-center">
            <TriangleAlert size={22} style={{ color: PALETTE.rose }} />
            <p className="text-sm text-[#8B90A3]">{error}</p>
            <button
              onClick={fetchTransactions}
              className="mt-2 rounded-lg border border-white/10 px-4 py-1.5 text-xs text-[#F4F1EA] transition hover:border-[#D4A657]/50"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 bg-[#161922]/60 py-16 text-center">
            <Receipt size={22} className="text-[#5C6070]" />
            <p className={`${display.className} text-lg italic text-[#8B90A3]`}>
              {query ? "No matches" : "No transactions yet"}
            </p>
            <p className="text-xs text-[#5C6070]">
              {query ? "Try a different search term." : "Sales will appear here as they come in."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-2xl border border-white/[0.06] bg-[#161922] md:block">
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left text-xs uppercase tracking-wider text-[#8B90A3]">
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Transaction ID</th>
                      <th className="p-4 font-semibold">Buyer</th>
                      <th className="p-4 font-semibold">Writer</th>
                      <th className="p-4 font-semibold">Amount</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {filtered.map((tx, i) => (
                        <TxRow key={tx.transactionId || i} tx={tx} delay={i * 0.015} onOpen={() => setSelected(tx)} />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              <AnimatePresence initial={false}>
                {filtered.map((tx, i) => (
                  <TxCard key={tx.transactionId || i} tx={tx} delay={i * 0.015} onOpen={() => setSelected(tx)} />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      <DetailModal tx={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#161922] p-5">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-[0.12] blur-2xl" style={{ background: accent }} />
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

function PaidBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium"
      style={{ backgroundColor: `${PALETTE.teal}1A`, color: PALETTE.teal }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: PALETTE.teal }} />
      Paid
    </span>
  );
}

function TxRow({ tx, delay, onOpen }) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, delay }}
      onClick={onOpen}
      className="cursor-pointer border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.02]"
    >
      <td className="p-4 text-[#8B90A3]">{fmtDate(tx.createdAt)}</td>
      <td className="p-4 font-mono text-xs text-[#8B90A3]">{tx.transactionId?.slice(0, 14)}…</td>
      <td className="p-4 text-[#F4F1EA]">{tx.buyerEmail}</td>
      <td className="p-4 text-[#8B90A3]">{tx.writerEmail || "N/A"}</td>
      <td className="p-4 font-semibold" style={{ color: PALETTE.gold }}>{fmtMoney(tx.amount)}</td>
      <td className="p-4">
        <PaidBadge />
      </td>
    </motion.tr>
  );
}

function TxCard({ tx, delay, onOpen }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, delay }}
      onClick={onOpen}
      className="cursor-pointer rounded-2xl border border-white/[0.06] bg-[#161922] p-4"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#F4F1EA]">{tx.buyerEmail}</p>
          <p className="mt-0.5 text-xs text-[#5C6070]">{fmtDate(tx.createdAt)}</p>
        </div>
        <span className="shrink-0 font-semibold" style={{ color: PALETTE.gold }}>{fmtMoney(tx.amount)}</span>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3">
        <p className="truncate text-xs text-[#8B90A3]">Writer: {tx.writerEmail || "N/A"}</p>
        <PaidBadge />
      </div>
    </motion.div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-2xl border border-white/[0.06] bg-[#161922]" />
      ))}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value, mono, copyable }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy");
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="flex items-center gap-2 text-xs text-[#8B90A3]">
        <Icon size={13} />
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-2">
        <span className={`truncate text-sm text-[#F4F1EA] ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
        {copyable && (
          <button onClick={handleCopy} className="shrink-0 text-[#5C6070] transition-colors hover:text-[#D4A657]">
            {copied ? <Check size={13} style={{ color: PALETTE.teal }} /> : <Copy size={13} />}
          </button>
        )}
      </span>
    </div>
  );
}

function DetailModal({ tx, onClose }) {
  return (
    <AnimatePresence>
      {tx && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
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
                style={{ backgroundColor: `${PALETTE.gold}1A`, color: PALETTE.gold }}
              >
                <Receipt size={20} />
              </div>
              <button onClick={onClose} className="text-[#5C6070] transition-colors hover:text-[#F4F1EA]">
                <X size={18} />
              </button>
            </div>

            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#8B90A3]">Receipt</p>
            <p className={`${display.className} mt-1 text-3xl italic text-[#F4F1EA]`}>{fmtMoney(tx.amount)}</p>

            <div className="mt-4 divide-y divide-white/[0.05] border-y border-white/[0.05]">
              <DetailRow icon={Calendar} label="Date" value={fmtDateTime(tx.createdAt)} />
              <DetailRow icon={Hash} label="Transaction ID" value={tx.transactionId} mono copyable />
              <DetailRow icon={Users} label="Buyer" value={tx.buyerEmail} />
              <DetailRow icon={Users} label="Writer" value={tx.writerEmail || "N/A"} />
            </div>

            <div className="mt-5 flex justify-end">
              <PaidBadge />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}