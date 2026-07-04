'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, BookOpen, ArrowUpRight } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { authFetch } from '@/lib/clientFetch';

const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";

export default function MyLibrary() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchLibrary = useCallback(async () => {
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
        setError(data.message || 'Could not load your library.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while loading your library.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (isPending) return;
    if (user?.email) fetchLibrary();
    else setLoading(false);
  }, [isPending, user, fetchLibrary]);

  const busy = isPending || loading;

  return (
    <div className="max-w-6xl mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
        .lb-card { transition: border-color .2s, transform .2s, box-shadow .2s; }
        .lb-card:hover { transform: translateY(-3px); }
      `}</style>

      {/* Header */}
      <div className="mb-10">
        <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: '#F4C430', marginBottom: 8 }}>
          My Space
        </p>
        <h1 style={{ fontFamily: FD, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, color: '#EDE9E0', letterSpacing: '-.02em' }}>
          My Library
        </h1>
        <p style={{ fontFamily: F, fontSize: 13.5, color: '#475569', marginTop: 6 }}>
          {purchases.length > 0
            ? `${purchases.length} ebook${purchases.length === 1 ? '' : 's'} you've purchased`
            : 'Your purchased ebooks will appear here'}
        </p>
      </div>

      {/* Loading */}
      {busy ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 size={26} className="animate-spin" style={{ color: '#F4C430' }} />
          <span style={{ fontFamily: F, fontSize: 12.5, color: '#334155' }}>Fetching your books…</span>
        </div>
      ) : error ? (
        // Error state
        <div className="text-center py-24">
          <p style={{ fontFamily: F, fontSize: 13.5, color: '#F87171', marginBottom: 16 }}>{error}</p>
          <button
            onClick={fetchLibrary}
            style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#F4C430', background: 'rgba(244,196,48,0.1)', border: '0.5px solid rgba(244,196,48,0.25)', borderRadius: 10, padding: '9px 22px', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      ) : !user ? (
        // Not logged in
        <div className="text-center py-24">
          <BookOpen size={44} style={{ color: '#1E293B', margin: '0 auto 18px' }} />
          <p style={{ fontFamily: F, fontSize: 13.5, color: '#475569' }}>Please sign in to view your library.</p>
        </div>
      ) : purchases.length === 0 ? (
        // Empty state
        <div className="text-center py-24">
          <BookOpen size={44} style={{ color: '#1E293B', margin: '0 auto 18px' }} />
          <p style={{ fontFamily: FD, fontSize: 19, color: '#94A3B8', marginBottom: 6 }}>Your shelf is empty</p>
          <p style={{ fontFamily: F, fontSize: 13, color: '#334155', marginBottom: 22 }}>
            Browse the library and find your next read.
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
        // Grid of purchased books
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {purchases.map((p) => (
            <Link
              key={p.transactionId}
              href={`/ebooks/${p.ebookId}`}
              className="lb-card group"
              style={{
                display: 'block',
                background: 'rgba(255,255,255,0.025)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                overflow: 'hidden',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(244,196,48,0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                {p.ebookCover ? (
                  <img src={p.ebookCover} alt={p.ebookTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={32} style={{ color: '#1E293B' }} />
                  </div>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,14,0.75) 0%, transparent 55%)' }} />
              </div>

              <div style={{ padding: '14px 16px 16px' }}>
                <h3 style={{
                  fontFamily: FD, fontSize: 14.5, fontWeight: 600, color: '#CBD5E1',
                  lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {p.ebookTitle}
                </h3>
                <p style={{ fontFamily: F, fontSize: 11, color: '#334155', marginTop: 5 }}>
                  {p.writerId}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}