"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  ShoppingCart, BookOpen, Bookmark, Wallet,
  ArrowUpRight, Settings, Library
} from "lucide-react";
import { authFetch } from "@/lib/clientFetch";

const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";

const GOLD   = "#F4C430";
const INDIGO = "#818CF8";
const ROSE   = "#D4537E";
const BG     = "#07070E";
const HAIR   = "rgba(255,255,255,0.08)";
const TEXT   = "#F0EDE6";
const MUTED  = "#6B7394";

export default function ReaderDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;

  const [purchases, setPurchases] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading]     = useState(true);

  

  const fetchAll = useCallback(async (email) => {
    try {
      setLoading(true);
      const [purchasesRes, bookmarksRes] = await Promise.all([
        authFetch(`/api/v1/users/purchases?email=${encodeURIComponent(email)}`),
        authFetch(`/api/v1/users/bookmarks?email=${encodeURIComponent(email)}`),
      ]);

      const purchasesData = await purchasesRes.json();
      if (purchasesData.success) setPurchases(purchasesData.purchases || []);

      const bookmarksData = await bookmarksRes.json();
      if (bookmarksData.success) setBookmarks(bookmarksData.bookmarks || []);
    } catch (err) {
      console.error("Failed to load reader data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.email) fetchAll(user.email);
  }, [isPending, user, router, fetchAll]);

  if (isPending || loading) {
    return (
      <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
          <div style={{
            width:34, height:34, borderRadius:"50%",
            borderWidth:1.5, borderStyle:"solid",
            borderColor:`${GOLD}33`, borderTopColor:GOLD,
            animation:"lu-spin .9s linear infinite",
          }} />
          <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:15, color:MUTED, letterSpacing:".02em" }}>
            Opening your shelf…
          </p>
        </div>
        <style>{`@keyframes lu-spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!user) return null;

  const paidPurchases = purchases.filter(p => p.paymentStatus === "paid");
  const totalSpent = paidPurchases.reduce((sum, p) => sum + (p.amount || 0), 0);

  // Dedupe purchases into a library of unique owned books
  const libraryMap = new Map();
  paidPurchases.forEach((p) => {
    if (!libraryMap.has(p.ebookId)) libraryMap.set(p.ebookId, p);
  });
  const libraryBooks = Array.from(libraryMap.values());

  const stats = [
    { label: "Books Owned",  value: libraryBooks.length,    Icon: Library,      accent: INDIGO },
    { label: "Purchases",    value: purchases.length,       Icon: ShoppingCart, accent: GOLD  },
    { label: "Bookmarked",   value: bookmarks.length,       Icon: Bookmark,     accent: ROSE   },
    { label: "Total Spent",  value: `$${totalSpent.toFixed(2)}`, Icon: Wallet,  accent: INDIGO },
  ];

  const drawers = [
    { href: "/dashboard/purchase",        title: "Purchase History", sub: "Every book you've bought",  Icon: ShoppingCart },
    { href: "/dashboard/reader/library",  title: "My Library",       sub: "Read what you own",          Icon: BookOpen     },
    { href: "/dashboard/reader/bookmarks",title: "Bookmarks",        sub: "Saved for later",            Icon: Bookmark     },
    { href: "/dashboard/reader/profile",  title: "Profile",          sub: "Manage your account",        Icon: Settings     },
  ];

  const recent = paidPurchases.slice(0, 5);

  return (
    <div className="lu-reader-dash" style={{ minHeight:"100%", background:BG, color:TEXT, fontFamily:F, position:"relative" }}>
      <style>{`
        .lu-reader-dash { padding: 32px 16px 56px; }
        @media (min-width: 640px)  { .lu-reader-dash { padding: 44px 28px 64px; } }
        @media (min-width: 1024px) { .lu-reader-dash { padding: 56px 32px 80px; } }

        .lu-inner { max-width: 1400px; margin: 0; width: 100%; position: relative; z-index: 1; }

        .lu-stats-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 640px) { .lu-stats-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; } }

        .lu-drawer-grid { display:grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 540px)  { .lu-drawer-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .lu-drawer-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; } }

        .lu-library-grid { display:grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 480px)  { .lu-library-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 768px)  { .lu-library-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; } }
        @media (min-width: 1024px) { .lu-library-grid { grid-template-columns: repeat(5, 1fr); } }

        .lu-stat-card { border: 1px solid ${HAIR}; border-radius: 14px; padding: 20px; background: rgba(255,255,255,0.015); }
        @media (min-width: 640px) { .lu-stat-card { padding: 24px; } }

        .lu-drawer { transition: border-color .18s, background .18s, transform .18s; }
        .lu-drawer:hover { border-color: var(--dc); background: rgba(255,255,255,0.03); transform: translateY(-2px); }
        .lu-drawer:hover .lu-arrow { opacity: 1; transform: translate(2px,-2px); }
        .lu-arrow { opacity: 0; transition: opacity .18s, transform .18s; }

        .lu-row { transition: background .15s; }
        .lu-row:hover { background: rgba(255,255,255,0.025); }

        .lu-book-card { transition: transform .18s, border-color .18s; }
        .lu-book-card:hover { transform: translateY(-3px); border-color: rgba(244,196,48,0.35); }
      `}</style>

      {/* ambient wash */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:260, pointerEvents:"none",
        background:"radial-gradient(ellipse 70% 60% at 20% 0%, rgba(244,196,48,0.06) 0%, transparent 70%)" }} />

      <div className="lu-inner">

        {/* ── Masthead ─────────────────────────────── */}
        <div style={{ borderBottom:`1px solid ${HAIR}`, paddingBottom:24, marginBottom:32 }}>
          <p style={{ fontSize:11, fontWeight:600, letterSpacing:".18em", textTransform:"uppercase", color:GOLD, marginBottom:10 }}>
            My Space
          </p>
          <h1 style={{ fontFamily:FD, fontSize:"clamp(28px,4.5vw,44px)", fontWeight:700, lineHeight:1.05, letterSpacing:"-0.01em" }}>
            Reader Dashboard
          </h1>
          <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:15, color:MUTED, marginTop:8 }}>
            Welcome back, {user.name}.
          </p>
        </div>

        {/* ── Stat row ─────────────────────────────── */}
        <div className="lu-stats-grid" style={{ marginBottom:40 }}>
          {stats.map(({ label, value, Icon, accent }) => (
            <div key={label} className="lu-stat-card" style={{ borderTop:`2px solid ${accent}55` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <Icon size={15} strokeWidth={1.8} style={{ color:accent, flexShrink:0 }} />
                <p style={{ fontSize:10, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:MUTED }}>
                  {label}
                </p>
              </div>
              <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:28, fontWeight:700, color:TEXT, letterSpacing:"-0.01em" }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Quick nav ────────────────────────────── */}
        <div className="lu-drawer-grid" style={{ marginBottom:48 }}>
          {drawers.map(({ href, title, sub, Icon }) => (
            <Link
              key={href}
              href={href}
              className="lu-drawer"
              style={{
                "--dc": GOLD,
                display:"block", padding:"20px", borderRadius:14,
                border:`1px solid ${HAIR}`, textDecoration:"none", color:TEXT,
              }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <Icon size={20} strokeWidth={1.6} style={{ color:GOLD }} />
                <ArrowUpRight size={16} className="lu-arrow" style={{ color:GOLD }} />
              </div>
              <h3 style={{ fontFamily:FD, fontSize:17, fontWeight:700, marginTop:16 }}>{title}</h3>
              <p style={{ fontSize:12, color:MUTED, marginTop:4 }}>{sub}</p>
            </Link>
          ))}
        </div>

        {/* ── My Library ───────────────────────────── */}
        <div style={{ marginBottom:48 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:18 }}>
            <h2 style={{ fontFamily:FD, fontSize:21, fontWeight:700 }}>My Library</h2>
            <Link href="/dashboard/reader/library" style={{ fontSize:12.5, color:GOLD, textDecoration:"none", fontWeight:600 }}>
              View full library →
            </Link>
          </div>

          {libraryBooks.length === 0 ? (
            <div style={{ border:`1px dashed ${HAIR}`, borderRadius:14, padding:"48px 20px", textAlign:"center" }}>
              <Library size={24} strokeWidth={1.3} style={{ color:MUTED, marginBottom:12 }} />
              <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:16, color:TEXT, marginBottom:4 }}>
                Your library is empty.
              </p>
              <p style={{ fontSize:12.5, color:MUTED }}>
                Books you buy will show up here, ready to read.
              </p>
            </div>
          ) : (
            <div className="lu-library-grid">
              {libraryBooks.slice(0, 10).map((book) => (
                <Link
                  key={book.ebookId}
                  href={`/ebooks/${book.ebookId}`}
                  className="lu-book-card"
                  style={{
                    display:"block", borderRadius:10, overflow:"hidden",
                    border:`1px solid ${HAIR}`, textDecoration:"none", color:TEXT,
                    background:"rgba(255,255,255,0.015)",
                  }}
                >
                  <div style={{ width:"100%", aspectRatio:"3 / 4", background:"rgba(255,255,255,0.05)" }}>
                    {book.ebookCover ? (
                      <img src={book.ebookCover} alt={book.ebookTitle} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    ) : (
                      <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <BookOpen size={20} style={{ color:MUTED }} />
                      </div>
                    )}
                  </div>
                  <p style={{
                    fontSize:12.5, fontWeight:600, padding:"10px 10px 12px",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                  }}>
                    {book.ebookTitle}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Recent purchases ─────────────────────── */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:18 }}>
            <h2 style={{ fontFamily:FD, fontSize:21, fontWeight:700 }}>Recently Purchased</h2>
            <Link href="/dashboard/purchase" style={{ fontSize:12.5, color:GOLD, textDecoration:"none", fontWeight:600 }}>
              View full history →
            </Link>
          </div>

          {recent.length === 0 ? (
            <div style={{ border:`1px dashed ${HAIR}`, borderRadius:14, padding:"48px 20px", textAlign:"center" }}>
              <ShoppingCart size={24} strokeWidth={1.3} style={{ color:MUTED, marginBottom:12 }} />
              <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:16, color:TEXT, marginBottom:4 }}>
                Your shelf is empty.
              </p>
              <p style={{ fontSize:12.5, color:MUTED, marginBottom:18 }}>
                Buy your first ebook and it will appear here.
              </p>
              <Link
                href="/ebooks"
                style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:13, fontWeight:600,
                  color:"#07070E", background:GOLD, borderRadius:10, padding:"10px 22px", textDecoration:"none" }}
              >
                Browse ebooks <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          ) : (
            <div style={{ border:`1px solid ${HAIR}`, borderRadius:14, overflow:"hidden" }}>
              {recent.map((p, i) => (
                <Link
                  key={p.transactionId}
                  href={`/ebooks/${p.ebookId}`}
                  className="lu-row"
                  style={{
                    display:"flex", alignItems:"center", gap:14, padding:"14px 16px",
                    borderTop: i === 0 ? "none" : `1px solid ${HAIR}`,
                    textDecoration:"none", color:TEXT,
                  }}
                >
                  <div style={{ width:38, height:50, borderRadius:4, overflow:"hidden", flexShrink:0, background:"rgba(255,255,255,0.05)" }}>
                    {p.ebookCover ? (
                      <img src={p.ebookCover} alt={p.ebookTitle} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    ) : (
                      <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <BookOpen size={14} style={{ color:MUTED }} />
                      </div>
                    )}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13.5, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {p.ebookTitle}
                    </p>
                    <p style={{ fontSize:11, color:MUTED, marginTop:2 }}>
                      {new Date(p.createdAt).toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" })}
                    </p>
                  </div>

                  <span style={{ fontFamily:FD, fontStyle:"italic", fontSize:15, fontWeight:700, color:GOLD, flexShrink:0 }}>
                    ${(p.amount || 0).toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
