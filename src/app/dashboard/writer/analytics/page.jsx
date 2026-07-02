"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import {
  BookOpen, TrendingUp, DollarSign, PackageCheck,
  PackageX, ShoppingBag, Award, ChevronUp, ChevronDown,
} from "lucide-react";

const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";

const GOLD   = "#F4C430";
const INDIGO = "#818CF8";
const ROSE   = "#D4537E";
const GREEN  = "#4ADE80";
const BG     = "#0A0918";
const HAIR   = "rgba(255,255,255,0.08)";
const TEXT   = "#F0EDE6";
const MUTED  = "#6B7394";

const BAR_COLORS = [GOLD, INDIGO, ROSE, GREEN, "#38BDF8", "#F97316"];

export default function WriterAnalytics() {
  const { data: session } = authClient.useSession();
  const [analytics, setAnalytics] = useState(null);
  const [sales, setSales] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const user = session?.user;

  useEffect(() => {
    if (!user?.id) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        const [analyticsRes, salesRes, ebooksRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/writer/analytics?writerId=${user.id}`),
          fetch(`${API_URL}/api/v1/writer/sales?writerId=${user.id}&writerEmail=${user.email}`),
          fetch(`${API_URL}/api/v1/writer/ebooks?writerId=${user.id}`),
        ]);

        const analyticsData = await analyticsRes.json();
        if (analyticsData.success) setAnalytics(analyticsData.analytics);

        const salesData = await salesRes.json();
        if (salesData.success) setSales(salesData.sales || []);

        const ebooksData = await ebooksRes.json();
        if (ebooksData.success) setEbooks(ebooksData.ebooks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user?.id, user?.email]);

  // ── Monthly revenue trend, last 6 months (oldest → newest) ──
  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleDateString(undefined, { month: "short" }),
        fullLabel: d.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
        revenue: 0,
        count: 0,
      });
    }
    const map = new Map(months.map((m) => [m.key, m]));
    for (const sale of sales) {
      const d = new Date(sale.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const m = map.get(key);
      if (m) {
        m.revenue += sale.amount || 0;
        m.count += 1;
      }
    }
    return months;
  }, [sales]);

  const maxMonthRevenue = Math.max(...monthlyTrend.map((m) => m.revenue), 1);

  // ── Trend direction: this month vs last month ──
  const trendDelta = useMemo(() => {
    const last = monthlyTrend[monthlyTrend.length - 1]?.revenue || 0;
    const prev = monthlyTrend[monthlyTrend.length - 2]?.revenue || 0;
    if (prev === 0) return null;
    return ((last - prev) / prev) * 100;
  }, [monthlyTrend]);

  // ── Top performing ebook by units sold ──
  const topEbook = useMemo(() => {
    if (!ebooks.length) return null;
    return [...ebooks].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))[0];
  }, [ebooks]);

  // ── Average revenue per sale ──
  const avgSaleValue = sales.length
    ? sales.reduce((sum, s) => sum + (s.amount || 0), 0) / sales.length
    : 0;

  if (loading) {
    return (
      <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
          <div style={{
            width:34, height:34, borderRadius:"50%",
            borderWidth:1.5, borderStyle:"solid",
            borderColor: `${GOLD}33`, borderTopColor: GOLD,
            animation:"lu-spin .9s linear infinite",
          }} />
          <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:15, color:MUTED, letterSpacing:".02em" }}>
            Tallying the ledger…
          </p>
        </div>
        <style>{`@keyframes lu-spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F }}>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:19, color:TEXT, marginBottom:6 }}>
            The ledger couldn&rsquo;t be read.
          </p>
          <p style={{ fontSize:13, color:ROSE }}>Failed to load analytics.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Manuscripts",      value: analytics.totalEbooks,                Icon: BookOpen,      accent: INDIGO },
    { label: "In Print",         value: analytics.publishedCount,             Icon: PackageCheck,  accent: GOLD   },
    { label: "Awaiting Review",  value: analytics.unpublishedCount,           Icon: PackageX,      accent: ROSE   },
    { label: "Copies Sold",      value: analytics.totalSold,                  Icon: ShoppingBag,   accent: GREEN  },
    { label: "Royalties Earned", value: `$${Number(analytics.totalRevenue).toFixed(2)}`, Icon: DollarSign, accent: GOLD },
    { label: "Avg. Per Sale",    value: `$${avgSaleValue.toFixed(2)}`,        Icon: TrendingUp,    accent: INDIGO },
  ];

  const genreEntries = Object.entries(analytics.genreBreakdown || {}).sort((a, b) => b[1] - a[1]);
  const maxCount = genreEntries.length ? Math.max(...genreEntries.map(([, c]) => c)) : 0;

  return (
    <div style={{ minHeight:"100vh", background:BG, color:TEXT, fontFamily:F, position:"relative", overflow:"hidden" }}>
      <style>{`
        .lu-bar-fill { transition: width .5s ease; }
        .lu-genre-row:hover .lu-bar-fill { filter: brightness(1.15); }
        .lu-trend-bar:hover { filter: brightness(1.2); }
      `}</style>

      <div style={{ position:"absolute", top:0, left:0, right:0, height:280, pointerEvents:"none",
        background:"radial-gradient(ellipse 70% 60% at 20% 0%, rgba(129,140,248,0.07) 0%, transparent 70%)" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize:"22px 22px" }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:1120, margin:"0 auto", padding:"56px 24px 80px" }}>

        {/* ── Masthead ─────────────────────────────── */}
        <div style={{ borderBottom:`1px solid ${HAIR}`, paddingBottom:28, marginBottom:40 }}>
          <p style={{ fontSize:11, fontWeight:600, letterSpacing:".18em", textTransform:"uppercase", color:INDIGO, marginBottom:10 }}>
            Performance Overview
          </p>
          <h1 style={{ fontFamily:FD, fontSize:"clamp(32px,4.5vw,48px)", fontWeight:700, lineHeight:1.05, letterSpacing:"-0.01em" }}>
            Analytics
          </h1>
          <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:16, color:MUTED, marginTop:8 }}>
            How your catalog is reading with the world.
          </p>
        </div>

        {/* ── Ledger stat row ──────────────────────── */}
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))",
          border:`1px solid ${HAIR}`, borderRadius:16, marginBottom:40, overflow:"hidden",
          background:"rgba(255,255,255,0.015)",
        }}>
          {stats.map(({ label, value, Icon, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              style={{
                padding:"24px 20px",
                borderRight: (i + 1) % 3 !== 0 ? `1px solid ${HAIR}` : "none",
                borderTop: `2px solid ${accent}55`,
              }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <Icon size={14} strokeWidth={1.8} style={{ color:accent }} />
                <p style={{ fontSize:10, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:MUTED }}>
                  {label}
                </p>
              </div>
              <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:28, fontWeight:700, color:TEXT, letterSpacing:"-0.01em" }}>
                {value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Monthly revenue trend ────────────────── */}
        <div style={{ marginBottom:40 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", flexWrap:"wrap", gap:12, marginBottom:20 }}>
            <h2 style={{ fontFamily:FD, fontSize:23, fontWeight:700 }}>Revenue, last 6 months</h2>
            {trendDelta !== null && (
              <div style={{
                display:"flex", alignItems:"center", gap:5, fontSize:12.5, fontWeight:600,
                color: trendDelta >= 0 ? GREEN : ROSE,
              }}>
                {trendDelta >= 0 ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {Math.abs(trendDelta).toFixed(0)}% vs last month
              </div>
            )}
          </div>

          <div style={{
            border:`1px solid ${HAIR}`, borderRadius:16, padding:"28px 24px 16px",
            background:"rgba(255,255,255,0.015)",
          }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:14, height:180 }}>
              {monthlyTrend.map((m, i) => {
                const barHeight = maxMonthRevenue ? Math.max((m.revenue / maxMonthRevenue) * 100, m.revenue > 0 ? 4 : 0) : 0;
                const isCurrent = i === monthlyTrend.length - 1;
                return (
                  <div key={m.key} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", height:"100%" }}>
                    <div style={{ flex:1, display:"flex", alignItems:"flex-end", width:"100%", position:"relative" }}>
                      <span style={{
                        position:"absolute", top:-20, left:"50%", transform:"translateX(-50%)",
                        fontSize:10.5, fontWeight:600, color: m.revenue > 0 ? GOLD : MUTED, whiteSpace:"nowrap",
                      }}>
                        {m.revenue > 0 ? `$${m.revenue.toFixed(0)}` : ""}
                      </span>
                      <motion.div
                        className="lu-trend-bar"
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeight}%` }}
                        transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        title={`${m.fullLabel}: $${m.revenue.toFixed(2)} · ${m.count} sale${m.count === 1 ? "" : "s"}`}
                        style={{
                          width:"100%", minHeight: 3, borderRadius:"6px 6px 0 0",
                          background: isCurrent ? GOLD : "rgba(244,196,48,0.35)",
                          border: isCurrent ? "none" : `1px solid rgba(244,196,48,0.15)`,
                        }}
                      />
                    </div>
                    <p style={{ fontSize:11, color: isCurrent ? TEXT : MUTED, fontWeight: isCurrent ? 700 : 500, marginTop:10 }}>
                      {m.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Top performer + Genre tally, side by side ── */}
        <div style={{ display:"grid", gridTemplateColumns:"minmax(220px, 320px) 1fr", gap:24, marginBottom:16 }}>

          {/* Top performer card */}
          <div style={{
            border:`1px solid ${HAIR}`, borderRadius:16, padding:"22px 20px",
            background:"rgba(255,255,255,0.015)", display:"flex", flexDirection:"column",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
              <Award size={15} style={{ color:GOLD }} />
              <p style={{ fontSize:10.5, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:MUTED }}>
                Top performer
              </p>
            </div>
            {topEbook ? (
              <>
                <div style={{ width:56, height:76, borderRadius:6, overflow:"hidden", background:"rgba(255,255,255,0.05)", marginBottom:14 }}>
                  {topEbook.coverImage && (
                    <img src={topEbook.coverImage} alt={topEbook.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  )}
                </div>
                <p style={{ fontSize:15, fontWeight:600, color:TEXT, marginBottom:4, lineHeight:1.3 }}>
                  {topEbook.title}
                </p>
                <p style={{ fontSize:12.5, color:MUTED, marginBottom:14 }}>{topEbook.genre}</p>
                <div style={{ display:"flex", gap:16, marginTop:"auto", paddingTop:14, borderTop:`1px solid ${HAIR}` }}>
                  <div>
                    <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:20, fontWeight:700, color:GOLD }}>
                      {topEbook.soldCount || 0}
                    </p>
                    <p style={{ fontSize:10.5, color:MUTED, marginTop:2 }}>copies sold</p>
                  </div>
                  <div>
                    <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:20, fontWeight:700, color:TEXT }}>
                      ${Number(topEbook.price).toFixed(2)}
                    </p>
                    <p style={{ fontSize:10.5, color:MUTED, marginTop:2 }}>price</p>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ fontSize:13, color:MUTED, margin:"auto 0" }}>No ebooks yet.</p>
            )}
          </div>

          {/* Genre tally */}
          <div style={{ border:`1px solid ${HAIR}`, borderRadius:16, padding:"22px 22px 8px", background:"rgba(255,255,255,0.015)" }}>
            <p style={{ fontSize:10.5, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:MUTED, marginBottom:18 }}>
              Ebooks by genre
            </p>

            {genreEntries.length === 0 ? (
              <p style={{ fontSize:13, color:MUTED, padding:"20px 0" }}>No genres on record yet.</p>
            ) : (
              genreEntries.map(([genre, count], i) => {
                const color = BAR_COLORS[i % BAR_COLORS.length];
                const pct = maxCount ? Math.max((count / maxCount) * 100, 6) : 0;
                return (
                  <div
                    key={genre}
                    className="lu-genre-row"
                    style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 0" }}
                  >
                    <p style={{ width:110, flexShrink:0, fontSize:12.5, fontWeight:600, color:TEXT,
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {genre}
                    </p>
                    <div style={{ flex:1, height:7, borderRadius:999, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
                      <div className="lu-bar-fill" style={{ width:`${pct}%`, height:"100%", borderRadius:999, background:color }} />
                    </div>
                    <p style={{ width:24, flexShrink:0, textAlign:"right", fontFamily:FD, fontStyle:"italic", fontSize:15, fontWeight:700, color }}>
                      {count}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Monthly breakdown table ──────────────── */}
        <div>
          <h2 style={{ fontFamily:FD, fontSize:23, fontWeight:700, marginBottom:20 }}>Monthly breakdown</h2>
          <div style={{ border:`1px solid ${HAIR}`, borderRadius:14, overflow:"hidden" }}>
            <table style={{ width:"100%", textAlign:"left", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"rgba(255,255,255,0.02)" }}>
                  <th style={thStyle}>Month</th>
                  <th style={thStyle}>Sales</th>
                  <th style={{ ...thStyle, textAlign:"right" }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {[...monthlyTrend].reverse().map((m, i) => (
                  <tr key={m.key} style={{ borderTop: i === 0 ? "none" : `1px solid ${HAIR}` }}>
                    <td style={{ ...tdStyle, fontWeight:500, color:TEXT }}>{m.fullLabel}</td>
                    <td style={{ ...tdStyle, color:MUTED }}>{m.count}</td>
                    <td style={{ ...tdStyle, textAlign:"right", fontFamily:FD, fontStyle:"italic", fontWeight:700, color: m.revenue > 0 ? GREEN : MUTED }}>
                      {m.revenue > 0 ? `$${m.revenue.toFixed(2)}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "12px 20px",
  fontSize: 10.5,
  fontWeight: 500,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: MUTED,
};

const tdStyle = {
  padding: "13px 20px",
  fontSize: 13.5,
};