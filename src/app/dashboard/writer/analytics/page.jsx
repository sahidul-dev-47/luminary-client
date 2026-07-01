"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { BookOpen, TrendingUp, DollarSign } from "lucide-react";

const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";

const GOLD   = "#F4C430";
const INDIGO = "#818CF8";
const ROSE   = "#D4537E";
const BG     = "#0A0918";
const HAIR   = "rgba(255,255,255,0.08)";
const TEXT   = "#F0EDE6";
const MUTED  = "#6B7394";

const BAR_COLORS = [GOLD, INDIGO, ROSE, "#4ADE80", "#38BDF8", "#F97316"];

export default function WriterAnalytics() {
  const { data: session } = authClient.useSession();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/writer/analytics?writerId=${session.user.email}`);
        const data = await res.json();
        if (data.success) setAnalytics(data.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [session]);

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
    { label: "Manuscripts",      value: analytics.totalEbooks,               Icon: BookOpen,   accent: INDIGO },
    { label: "In Print",         value: analytics.publishedCount,            Icon: TrendingUp, accent: GOLD   },
    { label: "Royalties Earned", value: `$${analytics.totalRevenue}`,        Icon: DollarSign, accent: ROSE   },
  ];

  const genreEntries = Object.entries(analytics.genreBreakdown || {}).sort((a, b) => b[1] - a[1]);
  const maxCount = genreEntries.length ? Math.max(...genreEntries.map(([, c]) => c)) : 0;

  return (
    <div style={{ minHeight:"100vh", background:BG, color:TEXT, fontFamily:F, position:"relative", overflow:"hidden" }}>
      <style>{`
        .lu-bar-fill { transition: width .5s ease; }
        .lu-genre-row:hover .lu-bar-fill { filter: brightness(1.15); }
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
          display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(190px, 1fr))",
          border:`1px solid ${HAIR}`, borderRadius:16, marginBottom:48, overflow:"hidden",
          background:"rgba(255,255,255,0.015)",
        }}>
          {stats.map(({ label, value, Icon, accent }, i) => (
            <div key={label} style={{
              padding:"26px 24px",
              borderRight: i < stats.length - 1 ? `1px solid ${HAIR}` : "none",
              borderTop: `2px solid ${accent}55`,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <Icon size={15} strokeWidth={1.8} style={{ color:accent }} />
                <p style={{ fontSize:10.5, fontWeight:600, letterSpacing:".12em", textTransform:"uppercase", color:MUTED }}>
                  {label}
                </p>
              </div>
              <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:34, fontWeight:700, color:TEXT, letterSpacing:"-0.01em" }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Genre tally ──────────────────────────── */}
        <div>
          <h2 style={{ fontFamily:FD, fontSize:23, fontWeight:700, marginBottom:20 }}>Ebooks by Genre</h2>

          {genreEntries.length === 0 ? (
            <div style={{ border:`1px dashed ${HAIR}`, borderRadius:14, padding:"56px 24px", textAlign:"center" }}>
              <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:17, color:TEXT, marginBottom:6 }}>
                No genres on record yet.
              </p>
              <p style={{ fontSize:13, color:MUTED }}>
                Publish an ebook to see its genre tallied here.
              </p>
            </div>
          ) : (
            <div style={{ border:`1px solid ${HAIR}`, borderRadius:14, overflow:"hidden" }}>
              {genreEntries.map(([genre, count], i) => {
                const color = BAR_COLORS[i % BAR_COLORS.length];
                const pct = maxCount ? Math.max((count / maxCount) * 100, 6) : 0;
                return (
                  <div
                    key={genre}
                    className="lu-genre-row"
                    style={{
                      display:"flex", alignItems:"center", gap:18, padding:"16px 22px",
                      borderTop: i === 0 ? "none" : `1px solid ${HAIR}`,
                    }}
                  >
                    <p style={{ width:150, flexShrink:0, fontSize:13.5, fontWeight:600, color:TEXT,
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {genre}
                    </p>

                    <div style={{ flex:1, height:8, borderRadius:999, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
                      <div
                        className="lu-bar-fill"
                        style={{ width:`${pct}%`, height:"100%", borderRadius:999, background:color }}
                      />
                    </div>

                    <p style={{
                      width:34, flexShrink:0, textAlign:"right",
                      fontFamily:FD, fontStyle:"italic", fontSize:18, fontWeight:700, color,
                    }}>
                      {count}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
