'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, ShoppingCart, ArrowUpRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/purchases?email=${encodeURIComponent(user.email)}`
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
    <div className="max-w-5xl mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
        .ph-row { transition: border-color .2s, background .2s; }
      `}</style>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: '#F4C430', marginBottom: 8 }}>
            My Space
          </p>
          <h1 style={{ fontFamily: FD, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, color: '#EDE9E0', letterSpacing: '-.02em' }}>
            Purchase History
          </h1>
          <p style={{ fontFamily: F, fontSize: 13.5, color: '#475569', marginTop: 6 }}>
            {purchases.length > 0
              ? `${purchases.length} transaction${purchases.length === 1 ? '' : 's'} on record`
              : 'Your transaction history will appear here'}
          </p>
        </div>

        {/* Total spent badge */}
        {!busy && !error && purchases.length > 0 && (
          <div style={{ background: 'rgba(244,196,48,0.06)', border: '0.5px solid rgba(244,196,48,0.2)', borderRadius: 14, padding: '14px 22px', textAlign: 'right' }}>
            <p style={{ fontFamily: F, fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#334155', marginBottom: 4 }}>
              Total spent
            </p>
            <p style={{ fontFamily: FD, fontSize: 22, fontWeight: 700, color: '#F4C430' }}>
              ${totalSpent.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Loading */}
      {busy ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 size={26} className="animate-spin" style={{ color: '#F4C430' }} />
          <span style={{ fontFamily: F, fontSize: 12.5, color: '#334155' }}>Fetching transactions…</span>
        </div>
      ) : error ? (
        <div className="text-center py-24">
          <p style={{ fontFamily: F, fontSize: 13.5, color: '#F87171', marginBottom: 16 }}>{error}</p>
          <button
            onClick={fetchPurchases}
            style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#F4C430', background: 'rgba(244,196,48,0.1)', border: '0.5px solid rgba(244,196,48,0.25)', borderRadius: 10, padding: '9px 22px', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      ) : !user ? (
        <div className="text-center py-24">
          <ShoppingCart size={44} style={{ color: '#1E293B', margin: '0 auto 18px' }} />
          <p style={{ fontFamily: F, fontSize: 13.5, color: '#475569' }}>Please sign in to view your purchase history.</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="text-center py-24">
          <ShoppingCart size={44} style={{ color: '#1E293B', margin: '0 auto 18px' }} />
          <p style={{ fontFamily: FD, fontSize: 19, color: '#94A3B8', marginBottom: 6 }}>No purchases yet</p>
          <p style={{ fontFamily: F, fontSize: 13, color: '#334155', marginBottom: 22 }}>
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
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
          {purchases.map((p, i) => {
            const status = getStatus(p.paymentStatus);
            const StatusIcon = status.Icon;
            return (
              <Link
                key={p.transactionId}
                href={`/ebooks/${p.ebookId}`}
                className="ph-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '16px 20px',
                  borderBottom: i < purchases.length - 1 ? '0.5px solid rgba(255,255,255,0.05)' : 'none',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Cover thumb */}
                <div style={{ position: 'relative', width: 42, height: 58, flexShrink: 0, borderRadius: '3px 6px 6px 3px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
                  {p.ebookCover ? (
                    <img src={p.ebookCover} alt={p.ebookTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShoppingCart size={16} style={{ color: '#1E293B' }} />
                    </div>
                  )}
                </div>

                {/* Title + writer */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: FD, fontSize: 15, fontWeight: 600, color: '#CBD5E1',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {p.ebookTitle}
                  </p>
                  <p style={{ fontFamily: F, fontSize: 11, color: '#334155', marginTop: 3 }}>
                    {p.writerId} · {formatDate(p.createdAt)}
                  </p>
                </div>

                {/* Status badge — hidden on very small screens */}
                <div
                  className="hidden sm:flex"
                  style={{
                    alignItems: 'center', gap: 5, flexShrink: 0,
                    padding: '5px 11px', borderRadius: 999,
                    background: status.bg, border: `0.5px solid ${status.border}`,
                  }}
                >
                  <StatusIcon size={11} strokeWidth={2} style={{ color: status.color }} />
                  <span style={{ fontFamily: F, fontSize: 10.5, fontWeight: 600, color: status.color, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                    {status.label}
                  </span>
                </div>

                {/* Amount */}
                <div style={{ flexShrink: 0, textAlign: 'right', minWidth: 64 }}>
                  <span style={{ fontFamily: FD, fontSize: 16, fontWeight: 700, color: '#F4C430' }}>
                    ${(p.amount || 0).toFixed(2)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}