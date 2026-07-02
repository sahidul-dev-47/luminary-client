"use client";
import { useEffect, useState } from "react";
import { Fraunces, Inter } from "next/font/google";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { motion } from "framer-motion";
import { Users, Feather, BookOpenCheck, Wallet, Library, Crown } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

const COLORS = ["#D4A657", "#6FBF9A", "#E2836F", "#7C9BD4", "#B693D4", "#D4C267"];

const fmtMoney = (n) =>
  `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function CustomTooltip({ active, payload, label, money }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#1B1E28] px-4 py-3 shadow-xl">
      {label ? <p className="text-xs uppercase tracking-wider text-[#8B90A3] mb-1">{label}</p> : null}
      {payload.map((p, i) => (
        <p key={i} className="text-sm text-[#F4F1EA] font-medium">
          {p.name}: {money ? fmtMoney(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

// Replaces the old bordered-list summary: four cards you can scan at a
// glance, matching the stat-card language used on the other admin pages
// instead of reading like a table of label/value rows.
function SummaryCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#12141C] p-5">
      <div
        className="absolute -right-5 -top-5 h-16 w-16 rounded-full opacity-[0.15] blur-2xl"
        style={{ background: accent }}
      />
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent}1A`, color: accent }}
      >
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </div>
      <p className={`${display.className} mt-3 text-2xl text-[#F4F1EA]`}>{value}</p>
      <p className="mt-1 text-xs text-[#8B90A3]">{label}</p>
    </div>
  );
}

// Static legend rendered outside the spinning wheel, so the labels
// stay upright and readable no matter how the donut itself is turning.
function GenreLegend({ data }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-2">
      {data.map((g, i) => (
        <span key={g.genre} className="flex items-center gap-2 text-xs text-[#8B90A3]">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
          {g.genre} <span className="text-[#5C6070]">· {g.count}</span>
        </span>
      ))}
    </div>
  );
}

function EmptyChart({ label }) {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center rounded-xl border border-dashed border-white/10">
      <p className="text-sm text-[#8B90A3]">{label}</p>
    </div>
  );
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const fetchData = async () => {
    try {
      setError(null);
      const res = await fetch(`${BACKEND_URL}/api/v1/admin/analytics`);
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
      else setError(data.message || "Failed to load analytics");
    } catch (err) {
      console.error(err);
      setError("Could not reach the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`${body.className} flex h-screen items-center justify-center bg-[#12141C] text-[#F4F1EA]`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4A657] border-t-transparent" />
          <p className="text-sm text-[#8B90A3]">Reading the shelves…</p>
        </div>
      </div>
    );
  }

  const genreDistribution = analytics?.genreDistribution?.length ? analytics.genreDistribution : [];
  const revenueTrend = analytics?.revenueTrend?.length ? analytics.revenueTrend : [];
  const topWriters = analytics?.topWriters || [];
  const totalGenreCount = genreDistribution.reduce((sum, g) => sum + g.count, 0);

  return (
    <div className={`${display.variable} ${body.variable} ${body.className} flex min-h-screen bg-[#12141C] text-[#F4F1EA]`}>
      <DashboardSidebar />

      {/*
        FIX: DashboardSidebar isn't position:fixed, so the flex row already
        reserves its width — the old `md:ml-60` added a second offset on
        top of that and pushed all content far right of the sidebar.
      */}
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8B90A3] mb-2">Deeper Read</p>
          <h1 className={`${display.className} text-4xl md:text-5xl italic text-[#F4F1EA]`}>Detailed Analytics</h1>
        </motion.div>

        {error && (
          <div className="mt-6 rounded-xl border border-[#E2836F]/30 bg-[#E2836F]/10 px-4 py-3 text-sm text-[#E2836F]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-8">
          {/* Collection wheel — genre donut, now an actual wheel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-[#1B1E28] p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8B90A3]">Collection by Genre</p>
              <Library className="h-5 w-5 text-[#6FBF9A]" strokeWidth={1.8} />
            </div>

            {genreDistribution.length === 0 ? (
              <EmptyChart label="No ebooks catalogued yet" />
            ) : (
              <>
                <div className="relative">
                  {/* Spins continuously like a record; pauses on hover so the
                      tooltip and segments are readable while you inspect it. */}
                  <div className="wheel-spin">
                    <ResponsiveContainer width="100%" height={340}>
                      <PieChart>
                        <Pie
                          data={genreDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={90}
                          outerRadius={140}
                          paddingAngle={3}
                          dataKey="count"
                          nameKey="genre"
                          stroke="#1B1E28"
                          strokeWidth={3}
                          isAnimationActive
                          animationDuration={800}
                        >
                          {genreDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Center label lives outside the spinning layer, so it
                      never rotates — the number always reads upright. */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className={`${display.className} text-4xl text-[#F4F1EA]`}>{totalGenreCount}</p>
                    <p className="text-xs uppercase tracking-wider text-[#8B90A3] mt-1">Titles</p>
                  </div>
                </div>

                <GenreLegend data={genreDistribution} />

                <style jsx>{`
                  .wheel-spin {
                    animation: spin 50s linear infinite;
                    transform-origin: 50% 50%;
                  }
                  .wheel-spin:hover {
                    animation-play-state: paused;
                  }
                  @keyframes spin {
                    from {
                      transform: rotate(0deg);
                    }
                    to {
                      transform: rotate(360deg);
                    }
                  }
                  @media (prefers-reduced-motion: reduce) {
                    .wheel-spin {
                      animation: none;
                    }
                  }
                `}</style>
              </>
            )}
          </motion.div>

          {/* Summary — now cards, not a list of rows */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5 }}
            className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#1B1E28] p-6 md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#8B90A3] mb-4">Summary</p>
            <div className="grid grid-cols-2 gap-3">
              <SummaryCard icon={Users} label="Total Readers" value={analytics?.totalUsers ?? 0} accent="#7C9BD4" />
              <SummaryCard icon={Feather} label="Total Writers" value={analytics?.totalWriters ?? 0} accent="#6FBF9A" />
              <SummaryCard icon={BookOpenCheck} label="Ebooks Sold" value={analytics?.totalSold ?? 0} accent="#E2836F" />
              <SummaryCard icon={Wallet} label="Total Revenue" value={fmtMoney(analytics?.totalRevenue)} accent="#D4A657" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5">
          {/* Revenue trend */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.5 }}
            className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-[#1B1E28] p-6 md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#8B90A3] mb-6">Revenue, Last 6 Months</p>
            {revenueTrend.length === 0 ? (
              <EmptyChart label="No transactions recorded yet" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueTrend} margin={{ left: -12, right: 8 }}>
                  <defs>
                    <linearGradient id="goldFade2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4A657" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#D4A657" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="month" stroke="#8B90A3" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8B90A3" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip money />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#D4A657" strokeWidth={2.5} fill="url(#goldFade2)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Top writers */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#1B1E28] p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#8B90A3]">Top Authors by Revenue</p>
              <Crown className="h-5 w-5 text-[#D4A657]" strokeWidth={1.8} />
            </div>
            {topWriters.length === 0 ? (
              <EmptyChart label="No sales yet" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topWriters} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#8B90A3" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="writerName"
                    stroke="#8B90A3"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip content={<CustomTooltip money />} />
                  <Bar dataKey="revenue" name="Revenue" fill="#E2836F" radius={[0, 6, 6, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}