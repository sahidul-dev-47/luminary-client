"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, Receipt, TrendingUp } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";

const GOLD   = "#F4C430";
const GREEN  = "#4ADE80";
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
    if (!user?.email) return;

    const fetchSales = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/v1/writer/sales?writerId=${user.email}&writerEmail=${user.email}`,
        );
        const data = await res.json();
        if (data.success) setSales(data.sales);
      } catch (err) {
        console.error("Failed to load sales", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [user?.email]);

  const totalRevenue = sales.reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div style={{ fontFamily: F, color: TEXT }}>
      <style>{`
        .lu-sale-row { transition: background .15s; }
        .lu-sale-row:hover { background: rgba(255,255,255,0.02); }
      `}</style>

      {/* ── Masthead ─────────────────────────────── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:16, marginBottom:28 }}>
        <div>
          <p style={{ fontSize:11, fontWeight:600, letterSpacing:".16em", textTransform:"uppercase",
            color:`${GOLD}CC`, marginBottom:4 }}>
            Earnings
          </p>
          <h1 style={{ fontFamily:FD, fontSize:26, color:TEXT }}>Sales history</h1>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px",
          borderRadius:12, background:"#12121F", border:`1px solid ${HAIR}` }}>
          <TrendingUp size={15} style={{ color:GREEN }} />
          <span style={{ fontSize:13, color:MUTED }}>Total earned</span>
          <span style={{ fontSize:14, fontWeight:600, color:TEXT }}>
            ${totalRevenue.toFixed(2)}
          </span>
        </div>
      </div>

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
        <div style={{ borderRadius:16, border:`1px solid ${HAIR}`, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", textAlign:"left", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#12121F" }}>
                  <th style={thStyle}>Ebook</th>
                  <th style={thStyle}>Buyer</th>
                  <th style={thStyle}>Date</th>
                  <th style={{ ...thStyle, textAlign:"right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale, i) => (
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
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td style={{ ...tdStyle, textAlign:"right", fontFamily:FD, fontStyle:"italic",
                      fontSize:15, fontWeight:700, color:GREEN }}>
                      +${Number(sale.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "14px 20px",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  color: DIM,
};

const tdStyle = {
  padding: "14px 20px",
  fontSize: 13.5,
};
