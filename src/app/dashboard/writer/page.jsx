"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Plus, TrendingUp, Users, DollarSign,
  ArrowUpRight, PackageCheck, Clock, Award, Receipt,
  ChevronUp, ChevronDown,
} from "lucide-react";
import { authFetch } from "@/lib/clientFetch";

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

export default function WriterDashboard() {
  const router = useRouter();
  const { data: session, isLoading: isSessionLoading } = authClient.useSession();

  const [ebooks, setEbooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  

  const fetchWriterData = useCallback(async (writerId, writerEmail) => {
  try {
    setLoading(true);
    const [ebooksRes, salesRes, analyticsRes] = await Promise.all([
      authFetch(`/api/v1/writer/ebooks?writerId=${writerId}`),
      authFetch(`/api/v1/writer/sales?writerEmail=${writerEmail}`),
      authFetch(`/api/v1/writer/analytics?writerId=${writerId}`)
    ]);

    const ebooksData = await ebooksRes.json();
    if (ebooksData.success) setEbooks(ebooksData.ebooks || []);

    const salesData = await salesRes.json();
    if (salesData.success) setSales(salesData.sales || []);

    const analyticsData = await analyticsRes.json();
    if (analyticsData.success) setAnalytics(analyticsData.analytics);
  } catch (err) {
    console.error("Failed to load writer data", err);
  } finally {
    setLoading(false);
  }
}, []); 
 useEffect(() => {
  if (isSessionLoading) return;

  if (!session?.user) {
    router.push("/auth/login");
    return;
  }

  if (session.user.id && session.user.email) {
    fetchWriterData(session.user.id, session.user.email);
  }
}, [session, isSessionLoading, router, fetchWriterData]);

  // ── Monthly revenue trend, last 6 months ──
  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleDateString(undefined, { month: "short" }),
        revenue: 0,
      });
    }
    const map = new Map(months.map((m) => [m.key, m]));
    for (const sale of sales) {
      const d = new Date(sale.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const m = map.get(key);
      if (m) m.revenue += sale.amount || 0;
    }
    return months;
  }, [sales]);

  const maxMonthRevenue = Math.max(...monthlyTrend.map((m) => m.revenue), 1);

  const trendDelta = useMemo(() => {
    const last = monthlyTrend[monthlyTrend.length - 1]?.revenue || 0;
    const prev = monthlyTrend[monthlyTrend.length - 2]?.revenue || 0;
    if (prev === 0) return null;
    return ((last - prev) / prev) * 100;
  }, [monthlyTrend]);

  const topEbook = useMemo(() => {
    if (!ebooks.length) return null;
    return [...ebooks].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))[0];
  }, [ebooks]);

  const recentSales = useMemo(() => sales.slice(0, 5), [sales]);

  if (isSessionLoading || loading) {
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
            Turning to your desk…
          </p>
        </div>
        <style>{`@keyframes lu-spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!session?.user) return null;

  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);
  const publishedBooks = ebooks.filter(b => b.status === "Published").length;
  const pendingBooks = ebooks.filter(b => b.status !== "Published").length;
  const avgSaleValue = sales.length ? totalRevenue / sales.length : 0;

  const dateline = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const stats = [
    { label: "Manuscripts",      value: ebooks.length,                    Icon: BookOpen,     accent: INDIGO },
    { label: "In Print",         value: publishedBooks,                   Icon: PackageCheck, accent: GOLD   },
    { label: "Awaiting Review",  value: pendingBooks,                     Icon: Clock,        accent: ROSE   },
    { label: "Copies Sold",      value: sales.length,                     Icon: Users,        accent: GREEN  },
    { label: "Royalties Earned", value: `$${totalRevenue.toFixed(2)}`,    Icon: DollarSign,   accent: GOLD   },
    { label: "Avg. Per Sale",    value: `$${avgSaleValue.toFixed(2)}`,    Icon: TrendingUp,   accent: INDIGO },
  ];

  const drawers = [
    { href: "/dashboard/writer/my-ebooks", title: "My Ebooks",     sub: "Manage & publish",     Icon: BookOpen   },
    { href: "/dashboard/writer/sales",     title: "Sales History", sub: "View your earnings",   Icon: Receipt    },
    { href: "/dashboard/writer/analytics", title: "Analytics",     sub: "Performance overview", Icon: TrendingUp },
  ];

  return (
    <div style={{ minHeight:"100vh", background:BG, color:TEXT, fontFamily:F, position:"relative", overflow:"hidden" }}>
      <style>{`
        .lu-drawer { transition: border-color .18s, background .18s, transform .18s; }
        .lu-drawer:hover { border-color: var(--dc); background: rgba(255,255,255,0.03); transform: translateY(-2px); }
        .lu-drawer:hover .lu-arrow { opacity: 1; transform: translate(2px,-2px); }
        .lu-arrow { opacity: 0; transition: opacity .18s, transform .18s; }
        .lu-row { transition: background .15s, border-color .15s; }
        .lu-row:hover { background: rgba(255,255,255,0.025); border-color: rgba(255,255,255,0.12); }
        .lu-cta { transition: filter .18s, transform .18s; }
        .lu-cta:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .lu-sale-row { transition: background .15s; }
        .lu-sale-row:hover { background: rgba(255,255,255,0.02); }
        .lu-trend-bar { transition: filter .15s; }
        .lu-trend-bar:hover { filter: brightness(1.2); }

        .lu-container { padding: 56px 24px 80px; }
        .lu-grid-2a { grid-template-columns: 1.6fr 1fr; }
        .lu-grid-2b { grid-template-columns: 1.4fr 1fr; }
        .lu-cta-link { width: auto; text-align: center; justify-content: center; }

        @media (max-width: 860px) {
          .lu-grid-2a { grid-template-columns: 1fr !important; }
          .lu-grid-2b { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .lu-container { padding: 32px 16px 56px !important; }
          .lu-cta-link { width: 100%; }
        }
      `}</style>

      <div style={{ position:"absolute", top:0, left:0, right:0, height:280, pointerEvents:"none",
        background:"radial-gradient(ellipse 70% 60% at 20% 0%, rgba(244,196,48,0.07) 0%, transparent 70%)" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize:"22px 22px" }} />

      <div className="lu-container" style={{ position:"relative", zIndex:1, maxWidth:1160, margin:"0 auto" }}>

        {/* ── Masthead ─────────────────────────────── */}
        <div style={{ borderBottom:`1px solid ${HAIR}`, paddingBottom:28, marginBottom:40,
          display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:20 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:600, letterSpacing:".18em", textTransform:"uppercase", color:GOLD, marginBottom:10 }}>
              {dateline}
            </p>
            <h1 style={{ fontFamily:FD, fontSize:"clamp(32px,4.5vw,48px)", fontWeight:700, lineHeight:1.05, letterSpacing:"-0.01em" }}>
              The Writer&rsquo;s Desk
            </h1>
            <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:16, color:MUTED, marginTop:8 }}>
              Welcome back, {session.user.name}.
            </p>
          </div>

          <Link
            href="/dashboard/writer/add-ebook"
            className="lu-cta lu-cta-link"
            style={{
              display:"flex", alignItems:"center", gap:9,
              padding:"13px 22px", borderRadius:11,
              background:`linear-gradient(135deg, ${GOLD}, ${ROSE})`,
              color:"#1A1206", fontWeight:700, fontSize:13.5,
              textDecoration:"none", letterSpacing:".01em",
            }}
          >
            <Plus size={17} strokeWidth={2.4} /> Publish New Ebook
          </Link>
        </div>

        {/* ── Ledger stat row ──────────────────────── */}
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(170px, 1fr))",
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
                padding:"24px 22px",
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

        {/* ── Revenue trend + Top performer ────────── */}
        <div className="lu-grid-2a" style={{ display:"grid", gap:20, marginBottom:40 }}>

          {/* Revenue trend chart */}
          <div style={{ border:`1px solid ${HAIR}`, borderRadius:16, padding:"22px 24px 16px", background:"rgba(255,255,255,0.015)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:20 }}>
              <p style={{ fontSize:10.5, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:MUTED }}>
                Revenue, last 6 months
              </p>
              {trendDelta !== null && (
                <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:600,
                  color: trendDelta >= 0 ? GREEN : ROSE }}>
                  {trendDelta >= 0 ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  {Math.abs(trendDelta).toFixed(0)}%
                </div>
              )}
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:130 }}>
              {monthlyTrend.map((m, i) => {
                const barHeight = maxMonthRevenue ? Math.max((m.revenue / maxMonthRevenue) * 100, m.revenue > 0 ? 4 : 0) : 0;
                const isCurrent = i === monthlyTrend.length - 1;
                return (
                  <div key={m.key} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", height:"100%" }}>
                    <div style={{ flex:1, display:"flex", alignItems:"flex-end", width:"100%" }}>
                      <motion.div
                        className="lu-trend-bar"
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeight}%` }}
                        transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        title={`${m.label}: $${m.revenue.toFixed(2)}`}
                        style={{
                          width:"100%", minHeight:3, borderRadius:"5px 5px 0 0",
                          background: isCurrent ? GOLD : "rgba(244,196,48,0.35)",
                        }}
                      />
                    </div>
                    <p style={{ fontSize:10.5, color: isCurrent ? TEXT : MUTED, fontWeight: isCurrent ? 700 : 500, marginTop:8 }}>
                      {m.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top performer */}
          <div style={{ border:`1px solid ${HAIR}`, borderRadius:16, padding:"22px 20px", background:"rgba(255,255,255,0.015)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <Award size={14} style={{ color:GOLD }} />
              <p style={{ fontSize:10.5, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:MUTED }}>
                Top performer
              </p>
            </div>
            {topEbook ? (
              <div style={{ display:"flex", gap:14 }}>
                <div style={{ width:52, height:70, borderRadius:6, overflow:"hidden", flexShrink:0, background:"rgba(255,255,255,0.05)" }}>
                  {topEbook.coverImage && (
                    <img src={topEbook.coverImage} alt={topEbook.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  )}
                </div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:13.5, fontWeight:600, color:TEXT, lineHeight:1.3, marginBottom:6,
                    display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                    {topEbook.title}
                  </p>
                  <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:18, fontWeight:700, color:GOLD }}>
                    {topEbook.soldCount || 0} sold
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ fontSize:12.5, color:MUTED }}>No sales yet.</p>
            )}
          </div>
        </div>

        {/* ── Desk drawers (quick nav) ─────────────── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:16, marginBottom:56 }}>
          {drawers.map(({ href, title, sub, Icon }) => (
            <Link
              key={href}
              href={href}
              className="lu-drawer"
              style={{
                "--dc": INDIGO,
                display:"block", padding:"24px 22px", borderRadius:14,
                border:`1px solid ${HAIR}`, textDecoration:"none", color:TEXT,
              }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <Icon size={22} strokeWidth={1.6} style={{ color:INDIGO }} />
                <ArrowUpRight size={16} className="lu-arrow" style={{ color:INDIGO }} />
              </div>
              <h3 style={{ fontFamily:FD, fontSize:19, fontWeight:700, marginTop:18 }}>{title}</h3>
              <p style={{ fontSize:12.5, color:MUTED, marginTop:4 }}>{sub}</p>
            </Link>
          ))}
        </div>

        {/* ── Manuscripts + Recent sales, side by side ── */}
        <div className="lu-grid-2b" style={{ display:"grid", gap:24 }}>

          {/* Recent manuscripts shelf */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:20 }}>
              <h2 style={{ fontFamily:FD, fontSize:23, fontWeight:700 }}>Recent Manuscripts</h2>
              <Link href="/dashboard/writer/my-ebooks" style={{ fontSize:12.5, color:GOLD, textDecoration:"none", fontWeight:600 }}>
                View full shelf →
              </Link>
            </div>

            {ebooks.length === 0 ? (
              <div style={{ border:`1px dashed ${HAIR}`, borderRadius:14, padding:"56px 24px", textAlign:"center" }}>
                <BookOpen size={26} strokeWidth={1.3} style={{ color:MUTED, marginBottom:14 }} />
                <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:17, color:TEXT, marginBottom:6 }}>
                  The shelf is empty.
                </p>
                <p style={{ fontSize:13, color:MUTED }}>
                  Publish your first ebook and it will appear here.
                </p>
              </div>
            ) : (
              <div style={{ border:`1px solid ${HAIR}`, borderRadius:14, overflow:"hidden" }}>
                {ebooks.slice(0, 6).map((book, i) => {
                  const isPublished = book.status?.toLowerCase() === "published";
                  return (
                    <div
                      key={book._id || book.id}
                      className="lu-row"
                      style={{
                        display:"flex", alignItems:"center", gap:16, padding:"16px 20px",
                        borderTop: i === 0 ? "none" : `1px solid ${HAIR}`,
                        borderLeft: `3px solid ${isPublished ? GOLD : "rgba(255,255,255,0.12)"}`,
                      }}
                    >
                      <div style={{ width:42, height:56, borderRadius:4, overflow:"hidden", flexShrink:0, background:"rgba(255,255,255,0.05)" }}>
                        {book.coverImage ? (
                          <img src={book.coverImage} alt={book.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        ) : (
                          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <BookOpen size={16} style={{ color:MUTED }} />
                          </div>
                        )}
                      </div>

                      <div style={{ flex:1, minWidth:0 }}>
                        <h3 style={{ fontSize:14, fontWeight:600, color:TEXT, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                          {book.title}
                        </h3>
                        <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:13, color:GOLD, marginTop:2 }}>
                          ${book.price}
                        </p>
                      </div>

                      <span style={{
                        fontSize:10, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase",
                        padding:"5px 10px", borderRadius:999, flexShrink:0,
                        color: isPublished ? GOLD : MUTED,
                        background: isPublished ? "rgba(244,196,48,0.1)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isPublished ? "rgba(244,196,48,0.25)" : HAIR}`,
                      }}>
                        {book.status || "Draft"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent sales feed */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:20 }}>
              <h2 style={{ fontFamily:FD, fontSize:23, fontWeight:700 }}>Recent Sales</h2>
              <Link href="/dashboard/writer/sales" style={{ fontSize:12.5, color:GOLD, textDecoration:"none", fontWeight:600 }}>
                View all →
              </Link>
            </div>

            {recentSales.length === 0 ? (
              <div style={{ border:`1px dashed ${HAIR}`, borderRadius:14, padding:"48px 20px", textAlign:"center" }}>
                <Receipt size={22} strokeWidth={1.3} style={{ color:MUTED, marginBottom:10 }} />
                <p style={{ fontSize:12.5, color:MUTED }}>No sales yet.</p>
              </div>
            ) : (
              <div style={{ border:`1px solid ${HAIR}`, borderRadius:14, overflow:"hidden" }}>
                {recentSales.map((sale, i) => (
                  <div
                    key={sale._id}
                    className="lu-sale-row"
                    style={{
                      display:"flex", alignItems:"center", justifyContent:"space-between", gap:12,
                      padding:"14px 18px", borderTop: i === 0 ? "none" : `1px solid ${HAIR}`,
                    }}
                  >
                    <div style={{ minWidth:0 }}>
                      <p style={{ fontSize:12.5, fontWeight:600, color:TEXT, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {sale.ebookTitle}
                      </p>
                      <p style={{ fontSize:11, color:MUTED, marginTop:2 }}>
                        {new Date(sale.createdAt).toLocaleDateString(undefined, { month:"short", day:"numeric" })}
                      </p>
                    </div>
                    <span style={{ fontFamily:FD, fontStyle:"italic", fontSize:14.5, fontWeight:700, color:GREEN, flexShrink:0 }}>
                      +${Number(sale.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}