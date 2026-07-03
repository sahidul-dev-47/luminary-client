"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Fraunces, Inter } from "next/font/google";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Users,
  Feather,
  BookOpenCheck,
  Wallet,
  TrendingUp,
  Library,
  Crown,
  Receipt,
  RefreshCw,
  Radio,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { authClient } from "@/lib/auth-client";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

const PALETTE = {
  gold: "#D4A657",
  rose: "#E2836F",
  teal: "#6FBF9A",
  ink: "#12141C",
};

const AUTO_REFRESH_MS = 45000;

const fmtMoney = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ---------- live count-up hook ----------
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const from = prevTarget.current;
    const to = Number(target) || 0;
    const start = performance.now();

    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prevTarget.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function CustomTooltip({ active, payload, label, money }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#1B1E28] px-4 py-3 shadow-xl">
      <p className="text-xs uppercase tracking-wider text-[#8B90A3] mb-1">
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm text-[#F4F1EA] font-medium">
          {p.name}: {money ? fmtMoney(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

function LiveBadge({ syncedSecondsAgo, refreshing, onRefresh }) {
  const label =
    syncedSecondsAgo == null
      ? "Syncing…"
      : syncedSecondsAgo < 5
        ? "Synced just now"
        : `Synced ${syncedSecondsAgo}s ago`;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1B1E28] px-3 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6FBF9A] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6FBF9A]" />
        </span>
        <span className="text-xs text-[#8B90A3]">{label}</span>
      </div>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        title="Refresh now"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#1B1E28] text-[#8B90A3] transition hover:border-[#D4A657]/40 hover:text-[#D4A657] disabled:opacity-50"
      >
        <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
      </button>
    </div>
  );
}

function Sparkline({ data, dataKey, color }) {
  if (!data?.length) return null;
  return (
    <div className="h-9 w-20 opacity-90">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatCard({
  title,
  value,
  isMoney,
  sub,
  icon: Icon,
  accent,
  delay,
  sparkData,
  sparkKey,
}) {
  const animated = useCountUp(isMoney ? Number(value) : value);
  const display_value = isMoney
    ? fmtMoney(animated)
    : Math.round(animated).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1B1E28] p-6 md:p-7"
    >
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.12] blur-2xl"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}1A`, color: accent }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        {sparkData ? (
          <Sparkline data={sparkData} dataKey={sparkKey} color={accent} />
        ) : null}
      </div>
      <p
        className={`${display.className} mt-5 text-4xl md:text-[2.75rem] leading-none text-[#F4F1EA]`}
      >
        {display_value}
      </p>
      <p className="mt-2 text-sm text-[#8B90A3]">{title}</p>
      {sub ? (
        <p className="mt-1 text-xs" style={{ color: accent }}>
          {sub}
        </p>
      ) : null}
    </motion.div>
  );
}

export default function AdminMainDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(null);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchAnalytics = useCallback(
    async (isManual = false) => {
      try {
        if (isManual) setRefreshing(true);
        setError(null);

      
        const session = await authClient.getSession();
        const token = session?.data?.session?.token;

        if (!token) {
          if (isMountedRef.current) {
            setError("Not authenticated");
            if (isManual) toast.error("You are not logged in");
          }
          return;
        }

        const res = await fetch(`${BACKEND_URL}/api/v1/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          if (isMountedRef.current) {
            setError("Session expired. Please log in again.");
            if (isManual) toast.error("Session expired");
          }
          return;
        }

        if (res.status === 403) {
          if (isMountedRef.current) {
            setError("You don't have permission to view this data.");
            if (isManual) toast.error("Forbidden: Admins only");
          }
          return;
        }

        const data = await res.json();

        if (!isMountedRef.current) return;

        if (data.success) {
          setAnalytics(data.analytics);
          setLastSyncedAt(Date.now());
          if (isManual) toast.success("Ledger refreshed");
        } else {
          setError(data.message || "Failed to load analytics");
          if (isManual) toast.error(data.message || "Refresh failed");
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        if (isMountedRef.current) {
          setError("Could not reach the server");
          if (isManual) toast.error("Could not reach the server");
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [BACKEND_URL],
  );

  useEffect(() => {
    fetchAnalytics();
    const poll = setInterval(() => fetchAnalytics(false), AUTO_REFRESH_MS);
    return () => clearInterval(poll);
  }, [fetchAnalytics]);

  useEffect(() => {
    if (!lastSyncedAt) return;
    const tick = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastSyncedAt) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastSyncedAt]);
  if (loading) {
    return (
      <div
        className={`${body.className} flex h-screen items-center justify-center bg-[#12141C] text-[#F4F1EA]`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4A657] border-t-transparent" />
          <p className="text-sm text-[#8B90A3]">Opening the ledger…</p>
        </div>
      </div>
    );
  }

  const revenueTrend = analytics?.revenueTrend?.length
    ? analytics.revenueTrend
    : [];
  const genreDistribution = analytics?.genreDistribution?.length
    ? analytics.genreDistribution
    : [];
  const topWriters = analytics?.topWriters || [];
  const recentTransactions = analytics?.recentTransactions || [];

  return (
    <div
      className={`${display.variable} ${body.variable} ${body.className} flex min-h-screen bg-[#12141C] text-[#F4F1EA]`}
    >
      <DashboardSidebar />
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#8B90A3]">
              <Radio size={12} className="text-[#6FBF9A]" /> Platform Overview
            </p>
            <h1
              className={`${display.className} text-4xl italic text-[#F4F1EA] md:text-5xl`}
            >
              The Ledger
            </h1>
          </div>
          <LiveBadge
            syncedSecondsAgo={secondsAgo}
            refreshing={refreshing}
            onRefresh={() => fetchAnalytics(true)}
          />
        </motion.div>

        {error && (
          <div className="mt-6 rounded-xl border border-[#E2836F]/30 bg-[#E2836F]/10 px-4 py-3 text-sm text-[#E2836F]">
            {error} — check that{" "}
            <code className="text-[#F4F1EA]">/api/v1/admin/analytics</code> is
            running on your backend.
          </div>
        )}

        {/* Stat cards */}
        <div className="mt-8 mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Readers"
            value={analytics?.totalUsers ?? 0}
            icon={Users}
            accent={PALETTE.gold}
            delay={0}
          />
          <StatCard
            title="Writers"
            value={analytics?.totalWriters ?? 0}
            icon={Feather}
            accent={PALETTE.teal}
            delay={0.06}
          />
          <StatCard
            title="Ebooks Sold"
            value={analytics?.totalSold ?? 0}
            sub={`${analytics?.publishedEbooks ?? 0} of ${analytics?.totalEbooks ?? 0} titles live`}
            icon={BookOpenCheck}
            accent={PALETTE.rose}
            delay={0.12}
            sparkData={revenueTrend}
            sparkKey="sales"
          />
          <StatCard
            title="Revenue"
            value={analytics?.totalRevenue ?? 0}
            isMoney
            icon={Wallet}
            accent={PALETTE.gold}
            delay={0.18}
            sparkData={revenueTrend}
            sparkKey="revenue"
          />
        </div>

        {/* Charts */}
        <div className="mb-10 grid grid-cols-1 gap-5 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-[#1B1E28] p-6 md:p-7 lg:col-span-3"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#8B90A3]">
                  Revenue Ledger
                </p>
                <p className="text-sm text-[#8B90A3]">Last six months</p>
              </div>
              <TrendingUp
                className="h-5 w-5 text-[#D4A657]"
                strokeWidth={1.8}
              />
            </div>
            {revenueTrend.length === 0 ? (
              <EmptyChart label="No transactions recorded yet" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueTrend} margin={{ left: -12, right: 8 }}>
                  <defs>
                    <linearGradient id="goldFade" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={PALETTE.gold}
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor={PALETTE.gold}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 6"
                    stroke="#ffffff10"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#8B90A3"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#8B90A3"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip money />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke={PALETTE.gold}
                    strokeWidth={2.5}
                    fill="url(#goldFade)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-[#1B1E28] p-6 md:p-7 lg:col-span-2"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8B90A3]">
                Genre Shelf
              </p>
              <Library className="h-5 w-5 text-[#6FBF9A]" strokeWidth={1.8} />
            </div>
            {genreDistribution.length === 0 ? (
              <EmptyChart label="No ebooks catalogued yet" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={genreDistribution}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 6"
                    stroke="#ffffff10"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke="#8B90A3"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="genre"
                    stroke="#8B90A3"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Titles"
                    fill={PALETTE.teal}
                    radius={[0, 6, 6, 0]}
                    barSize={16}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* Top writers + recent transactions */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-[#1B1E28] p-6 md:p-7 lg:col-span-2"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8B90A3]">
                Top Authors
              </p>
              <Crown className="h-5 w-5 text-[#D4A657]" strokeWidth={1.8} />
            </div>
            {topWriters.length === 0 ? (
              <EmptyChart label="No sales yet" compact />
            ) : (
              <div className="space-y-1">
                <AnimatePresence initial={false}>
                  {topWriters.map((w, i) => (
                    <motion.div
                      key={w.writerId || i}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.03]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`${display.className} w-5 text-sm italic text-[#8B90A3]`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="truncate text-sm text-[#F4F1EA]">
                          {w.writerName}
                        </p>
                      </div>
                      <div className="ml-3 shrink-0 text-right">
                        <p className="text-sm font-medium text-[#D4A657]">
                          {fmtMoney(w.revenue)}
                        </p>
                        <p className="text-xs text-[#8B90A3]">{w.sales} sold</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5 }}
            className="rounded-2xl border border-white/[0.06] bg-[#1B1E28] p-6 md:p-7 lg:col-span-3"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8B90A3]">
                Recent Transactions
              </p>
              <Receipt className="h-5 w-5 text-[#E2836F]" strokeWidth={1.8} />
            </div>
            {recentTransactions.length === 0 ? (
              <EmptyChart label="No transactions yet" compact />
            ) : (
              <div className="space-y-1">
                <AnimatePresence initial={false}>
                  {recentTransactions.map((t) => (
                    <motion.div
                      key={t.transactionId}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.03]"
                    >
                      <div className="min-w-0 pr-3">
                        <p className="truncate text-sm text-[#F4F1EA]">
                          {t.ebookTitle}
                        </p>
                        <p className="truncate text-xs text-[#8B90A3]">
                          {t.buyerEmail}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-[#F4F1EA]">
                        {fmtMoney(t.amount)}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function EmptyChart({ label, compact }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed border-white/10 ${compact ? "h-24" : "h-[260px]"}`}
    >
      <p className="text-sm text-[#8B90A3]">{label}</p>
    </div>
  );
}
