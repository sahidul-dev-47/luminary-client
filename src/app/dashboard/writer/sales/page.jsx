"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Loader2, Receipt, TrendingUp, Calendar } from "lucide-react";
import { authFetch } from "@/lib/clientFetch";



const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";

const GOLD   = "#F4C430";
const GREEN  = "#4ADE80";
const INDIGO = "#818CF8";
const HAIR   = "rgba(255,255,255,0.08)";
const TEXT   = "#F8FAFC";
const MUTED  = "#94A3B8";
const DIM    = "#64748B";

export default function SalesHistoryPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchSales = async () => {
      setLoading(true);
      try {
        const res = await authFetch(
          `/api/v1/writer/sales?writerId=${user.id}&writerEmail=${user.email}`,
        );
        const data = await res.json();
        if (data.success) setSales(data.sales || []);
      } catch (err) {
        console.error("Failed to load sales", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [user?.id, user?.email]);

  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);

  // ── Group sales by calendar month, most recent first ──────────
  const monthGroups = useMemo(() => {
    const map = new Map();
    for (const sale of sales) {
      const d = new Date(sale.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString(undefined, { year: "numeric", month: "long" });
      if (!map.has(key)) map.set(key, { key, label, sales: [], total: 0 });
      const group = map.get(key);
      group.sales.push(sale);
      group.total += sale.amount || 0;
    }
    return Array.from(map.values()).sort((a, b) => (a.key < b.key ? 1 : -1));
  }, [sales]);

  return (
    <div style={{ fontFamily: F, color: TEXT }}>
      <style>{`
        .lu-sale-row { transition: background .15s; }
        .lu-sale-row:hover { background: rgba(255,255,255,0.025); }
        .lu-month-head { position: sticky; top: 0; z-index: 1; backdrop-filter: blur(6px); }
      `}</style>

      {/* ── Masthead ─────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:16, marginBottom:32 }}>
        <div>
          <p style={{ fontSize:11, fontWeight:600, letterSpacing:".16em", textTransform:"uppercase",
            color:`${GOLD}CC`, marginBottom:4 }}>
            Earnings
          </p>
          <h1 style={{ fontFamily:FD, fontSize:26, color:TEXT }}>Sales history</h1>
        </div>
      </div>

      {/* ── Grand total banner ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16,
          padding:"26px 28px", borderRadius:16, marginBottom:36,
          background:`linear-gradient(135deg, rgba(244,196,48,0.1), rgba(129,140,248,0.06))`,
          border:`1px solid rgba(244,196,48,0.25)`,
        }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{
            width:44, height:44, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center",
            background:"rgba(244,196,48,0.14)", border:"1px solid rgba(244,196,48,0.3)",
          }}>
            <TrendingUp size={20} style={{ color:GOLD }} />
          </div>
          <div>
            <p style={{ fontSize:11, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:MUTED }}>
              Total earned · all time
            </p>
            <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:32, fontWeight:700, color:TEXT, marginTop:2 }}>
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
        <div style={{ fontSize:13, color:MUTED }}>
          {sales.length} {sales.length === 1 ? "sale" : "sales"} across {monthGroups.length} {monthGroups.length === 1 ? "month" : "months"}
        </div>
      </motion.div>

      {loading ? (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          color:MUTED, fontSize:13.5, padding:"64px 0" }}>
          <Loader2 size={16} className="animate-spin" /> Loading sales…
        </div>
      ) : sales.length === 0 ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12,
          padding:"80px 24px", textAlign:"center", borderRadius:16,
          border:`1px dashed ${HAIR}` }}>
          <Receipt size={26} strokeWidth={1.5} style={{ color:"#4B5563" }} />
          <p style={{ fontFamily:FD, fontStyle:"italic", fontSize:16, color:TEXT }}>
            The ledger is blank.
          </p>
          <p style={{ fontSize:13.5, color:MUTED }}>
            No sales yet — publish an ebook to start earning.
          </p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
          {monthGroups.map((group, gi) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: gi * 0.04 }}
              style={{ borderRadius:16, border:`1px solid ${HAIR}`, overflow:"hidden" }}
            >
              {/* Month header */}
              <div className="lu-month-head" style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"14px 20px", background:"#12121F", borderBottom:`1px solid ${HAIR}`,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <Calendar size={14} style={{ color:INDIGO }} />
                  <span style={{ fontSize:13.5, fontWeight:600, color:TEXT }}>{group.label}</span>
                  <span style={{
                    fontSize:10.5, fontWeight:600, color:MUTED, padding:"2px 8px",
                    borderRadius:999, background:"rgba(255,255,255,0.06)",
                  }}>
                    {group.sales.length} {group.sales.length === 1 ? "sale" : "sales"}
                  </span>
                </div>
                <span style={{ fontFamily:FD, fontStyle:"italic", fontSize:16, fontWeight:700, color:GREEN }}>
                  +${group.total.toFixed(2)}
                </span>
              </div>

              {/* Rows */}
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", textAlign:"left", borderCollapse:"collapse" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Ebook</th>
                      <th style={thStyle}>Buyer</th>
                      <th style={thStyle}>Date</th>
                      <th style={{ ...thStyle, textAlign:"right" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.sales.map((sale, i) => (
                      <tr
                        key={sale._id}
                        className="lu-sale-row"
                        style={{ borderTop: i === 0 ? "none" : `1px solid ${HAIR}` }}
                      >
                        <td style={{ ...tdStyle, fontWeight:500, color:TEXT }}>
                          {sale.ebookTitle}
                        </td>
                        <td style={{ ...tdStyle, fontSize:12.5, color:MUTED }}>
                          {sale.buyerEmail}
                        </td>
                        <td style={{ ...tdStyle, fontSize:12.5, color:MUTED }}>
                          {new Date(sale.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td style={{ ...tdStyle, textAlign:"right", fontFamily:FD, fontStyle:"italic",
                          fontSize:14.5, fontWeight:700, color:GREEN }}>
                          +${Number(sale.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "12px 20px",
  fontSize: 10.5,
  fontWeight: 500,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: DIM,
};

const tdStyle = {
  padding: "13px 20px",
  fontSize: 13.5,
};