'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, ShoppingCart, ArrowUpRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { authFetch } from '@/lib/clientFetch';

const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";

// Status → visual treatment
const STATUS_META = {
  paid:    { label: 'Paid',    color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)',  Icon: CheckCircle2 },
  pending: { label: 'Pending', color: '#F4C430', bg: 'rgba(244,196,48,0.1)', border: 'rgba(244,196,48,0.25)', Icon: Clock },
  failed:  { label: 'Failed',  color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', Icon: XCircle },
};
const getStatus = (s) => STATUS_META[s] || STATUS_META.pending;

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PurchaseHistoryPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchPurchases = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      setError(null);
      const res = await authFetch(
        `/api/v1/users/purchases?email=${encodeURIComponent(user.email)}`
      );
      const data = await res.json();
      if (data.success) {
        setPurchases(data.purchases || []);
      } else {
        setError(data.message || 'Could not load purchase history.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while loading your history.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (isPending) return;
    if (user?.email) fetchPurchases();
    else setLoading(false);
  }, [isPending, user, fetchPurchases]);

  const busy = isPending || loading;

  // Total spent
  const totalSpent = purchases
    .filter(p => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="ph-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

        .ph-wrap {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px 14px 48px;
          width: 100%;
        }
        @media (min-width: 640px)  { .ph-wrap { padding: 32px 24px 56px; } }
        @media (min-width: 1024px) { .ph-wrap { padding: 40px 32px 64px; } }

        /* Header */
        .ph-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (min-width: 640px) {
          .ph-header {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            margin-bottom: 32px;
          }
        }

        .ph-eyebrow { font-family: ${F}; font-size: 10.5px; font-weight: 600; letter-spacing: .2em; text-transform: uppercase; color: #F4C430; margin-bottom: 8px; }
        .ph-title   { font-family: ${FD}; font-size: clamp(1.5rem, 6vw, 2.6rem); font-weight: 700; color: #EDE9E0; letter-spacing: -.02em; line-height: 1.1; }
        .ph-sub     { font-family: ${F}; font-size: 12.5px; color: #475569; margin-top: 6px; }

        @media (min-width: 640px) { .ph-sub { font-size: 13.5px; } }

        /* Total spent badge */
        .ph-total {
          background: rgba(244,196,48,0.06);
          border: 0.5px solid rgba(244,196,48,0.2);
          border-radius: 14px;
          padding: 12px 18px;
          text-align: left;
          align-self: flex-start;
        }
        @media (min-width: 640px) {
          .ph-total { padding: 14px 22px; text-align: right; align-self: auto; }
        }
        .ph-total-label { font-family: ${F}; font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: #334155; margin-bottom: 4px; }
        .ph-total-value { font-family: ${FD}; font-size: 20px; font-weight: 700; color: #F4C430; }
        @media (min-width: 640px) { .ph-total-value { font-size: 22px; } }

        /* List container */
        .ph-list {
          background: rgba(255,255,255,0.02);
          border: 0.5px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
        }
        @media (min-width: 640px) { .ph-list { border-radius: 18px; } }

        /* Row — single line always, only sizes shrink on smaller screens */
        .ph-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          text-decoration: none;
          transition: background .2s, border-color .2s;
        }
        @media (min-width: 400px) { .ph-row { gap: 12px; padding: 12px 16px; } }
        @media (min-width: 640px) { .ph-row { gap: 16px; padding: 16px 20px; } }

        .ph-row:not(:last-child) { border-bottom: 0.5px solid rgba(255,255,255,0.05); }
        .ph-row:hover { background: rgba(255,255,255,0.025); }

        .ph-cover {
          position: relative;
          width: 30px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 3px 6px 6px 3px;
          overflow: hidden;
          background: rgba(255,255,255,0.04);
        }
        @media (min-width: 400px) { .ph-cover { width: 36px; height: 50px; } }
        @media (min-width: 640px) { .ph-cover { width: 42px; height: 58px; } }
        .ph-cover img { width: 100%; height: 100%; object-fit: cover; }
        .ph-cover-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }

        /* Title + subtitle — always takes remaining space, always shrinks first */
        .ph-meta {
          flex: 1 1 0%;
          min-width: 0;
        }
        .ph-book-title {
          font-family: ${FD};
          font-size: 12.5px;
          font-weight: 600;
          color: #CBD5E1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        @media (min-width: 400px) { .ph-book-title { font-size: 14px; } }
        @media (min-width: 640px) { .ph-book-title { font-size: 15px; } }

        .ph-book-sub {
          font-family: ${F};
          font-size: 9.5px;
          color: #334155;
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        @media (min-width: 400px) { .ph-book-sub { font-size: 11px; margin-top: 3px; } }

        /* Right side — status + amount, grouped, never shrinks, never hides */
        .ph-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        @media (min-width: 400px) { .ph-right { gap: 12px; } }
        @media (min-width: 640px) { .ph-right { gap: 16px; } }

        /* Status badge — always visible, just smaller on mobile */
        .ph-status {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
          padding: 3px 7px;
          border-radius: 999px;
        }
        @media (min-width: 400px) { .ph-status { gap: 5px; padding: 5px 10px; } }

        .ph-status-text {
          display: none;
          font-family: ${F};
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .04em;
          white-space: nowrap;
        }
        @media (min-width: 400px) { .ph-status-text { display: inline; } }

        /* Amount */
        .ph-amount {
          flex-shrink: 0;
          text-align: right;
          min-width: 44px;
        }
        @media (min-width: 400px) { .ph-amount { min-width: 60px; } }
        .ph-amount span {
          font-family: ${FD};
          font-size: 13px;
          font-weight: 700;
          color: #F4C430;
          white-space: nowrap;
        }
        @media (min-width: 400px) { .ph-amount span { font-size: 15px; } }
        @media (min-width: 640px) { .ph-amount span { font-size: 16px; } }

        /* Empty / loading / error states */
        .ph-state {
          text-align: center;
          padding: 64px 16px;
        }
        @media (min-width: 640px) { .ph-state { padding: 96px 16px; } }
      `}</style>

      {/* Header */}
      <div className="ph-header">
        <div>
          <p className="ph-eyebrow">My Space</p>
          <h1 className="ph-title">Purchase History</h1>
          <p className="ph-sub">
            {purchases.length > 0
              ? `${purchases.length} transaction${purchases.length === 1 ? '' : 's'} on record`
              : 'Your transaction history will appear here'}
          </p>
        </div>

        {/* Total spent badge */}
        {!busy && !error && purchases.length > 0 && (
          <div className="ph-total">
            <p className="ph-total-label">Total spent</p>
            <p className="ph-total-value">${totalSpent.toFixed(2)}</p>
          </div>
        )}
      </div>

      {/* Loading */}
      {busy ? (
        <div className="ph-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Loader2 size={24} className="animate-spin" style={{ color: '#F4C430' }} />
          <span style={{ fontFamily: F, fontSize: 12, color: '#334155' }}>Fetching transactions…</span>
        </div>
      ) : error ? (
        <div className="ph-state">
          <p style={{ fontFamily: F, fontSize: 13, color: '#F87171', marginBottom: 16 }}>{error}</p>
          <button
            onClick={fetchPurchases}
            style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#F4C430', background: 'rgba(244,196,48,0.1)', border: '0.5px solid rgba(244,196,48,0.25)', borderRadius: 10, padding: '9px 22px', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      ) : !user ? (
        <div className="ph-state">
          <ShoppingCart size={40} style={{ color: '#1E293B', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: F, fontSize: 13, color: '#475569' }}>Please sign in to view your purchase history.</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="ph-state">
          <ShoppingCart size={40} style={{ color: '#1E293B', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: FD, fontSize: 18, color: '#94A3B8', marginBottom: 6 }}>No purchases yet</p>
          <p style={{ fontFamily: F, fontSize: 12.5, color: '#334155', marginBottom: 20 }}>
            Your transactions will show up here once you buy an ebook.
          </p>
          <Link
            href="/ebooks"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: F, fontSize: 13, fontWeight: 600, color: '#07070E', background: '#F4C430', borderRadius: 10, padding: '10px 24px', textDecoration: 'none' }}
          >
            Browse ebooks
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      ) : (
        // Transaction list
        <div className="ph-list">
          {purchases.map((p) => {
            const status = getStatus(p.paymentStatus);
            const StatusIcon = status.Icon;
            return (
              <Link key={p.transactionId} href={`/ebooks/${p.ebookId}`} className="ph-row">
                {/* Cover thumb */}
                <div className="ph-cover">
                  {p.ebookCover ? (
                    <img src={p.ebookCover} alt={p.ebookTitle} />
                  ) : (
                    <div className="ph-cover-fallback">
                      <ShoppingCart size={14} style={{ color: '#1E293B' }} />
                    </div>
                  )}
                </div>

                {/* Title + writer */}
                <div className="ph-meta">
                  <p className="ph-book-title">{p.ebookTitle}</p>
                  <p className="ph-book-sub">{p.writerId} · {formatDate(p.createdAt)}</p>
                </div>

                {/* Status + amount — grouped, always visible, sizes shrink on mobile */}
                <div className="ph-right">
                  <div className="ph-status" style={{ background: status.bg, border: `0.5px solid ${status.border}` }}>
                    <StatusIcon size={11} strokeWidth={2} style={{ color: status.color }} />
                    <span className="ph-status-text" style={{ color: status.color }}>{status.label}</span>
                  </div>

                  <div className="ph-amount">
                    <span>${(p.amount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
