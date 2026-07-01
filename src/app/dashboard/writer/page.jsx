"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen, Plus, TrendingUp, Users, DollarSign,
  ArrowUpRight
} from "lucide-react";

const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";

const GOLD   = "#F4C430";
const INDIGO = "#818CF8";
const ROSE   = "#D4537E";
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

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchWriterData = useCallback(async (writerEmail) => {
    try {
      setLoading(true);

      const [ebooksRes, salesRes, analyticsRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/writer/ebooks?writerId=${writerEmail}`),
        fetch(`${API_URL}/api/v1/writer/sales?writerEmail=${writerEmail}`),
        fetch(`${API_URL}/api/v1/writer/analytics?writerId=${writerEmail}`)
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
  }, [API_URL]);

  useEffect(() => {
    if (isSessionLoading) return;

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role?.toLowerCase() !== "writer") {
      router.push("/dashboard/reader");
      return;
    }

    if (session.user.email) {
      fetchWriterData(session.user.email);
    }
  }, [session, isSessionLoading, router, fetchWriterData]);

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
  const publishedBooks = ebooks.filter(b => b.status === "Published" || b.status === "published").length;

  const dateline = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const stats = [
    { label: "Manuscripts",     value: ebooks.length,             Icon: BookOpen,   accent: INDIGO },
    { label: "In Print",        value: publishedBooks,            Icon: TrendingUp, accent: GOLD   },
    { label: "Royalties Earned",value: `$${totalRevenue.toFixed(2)}`, Icon: DollarSign, accent: ROSE },
    { label: "Copies Sold",     value: sales.length,              Icon: Users,      accent: INDIGO },
  ];

  const drawers = [
    { href: "/dashboard/writer/my-ebooks", title: "My Ebooks",     sub: "Manage & publish",     Icon: BookOpen   },
    { href: "/dashboard/writer/sales",     title: "Sales History", sub: "View your earnings",   Icon: TrendingUp },
    { href: "/dashboard/writer/analytics", title: "Analytics",     sub: "Performance overview",  Icon: Users      },
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
      `}</style>

      {/* ambient wash, matches sidebar's decorators */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:280, pointerEvents:"none",
        background:"radial-gradient(ellipse 70% 60% at 20% 0%, rgba(244,196,48,0.07) 0%, transparent 70%)" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize:"22px 22px" }} />

      <div style={{ position:"relative", zIndex:1, maxWidth:1120, margin:"0 auto", padding:"56px 24px 80px" }}>

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
            className="lu-cta"
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

        {/* ── Recent manuscripts shelf ─────────────── */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:20 }}>
            <h2 style={{ fontFamily:FD, fontSize:23, fontWeight:700 }}>Recent Manuscripts</h2>
            <Link href="/dashboard/writer/my-ebooks" style={{ fontSize:12.5, color:GOLD, textDecoration:"none", fontWeight:600 }}>
              View full shelf →
            </Link>
          </div>

          {ebooks.length === 0 ? (
            <div style={{
              border:`1px dashed ${HAIR}`, borderRadius:14, padding:"56px 24px",
              textAlign:"center",
            }}>
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
      </div>
    </div>
  );
}
