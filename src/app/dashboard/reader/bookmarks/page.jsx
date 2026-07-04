'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Heart, ArrowUpRight, Bookmark } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { authFetch } from '@/lib/clientFetch';

const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";

export default function BookmarksPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchBookmarks = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      setError(null);
      const res = await authFetch(
        `/api/v1/users/bookmarks?email=${encodeURIComponent(user.email)}`
      );
      const data = await res.json();
      if (data.success) {
        setBookmarks(data.bookmarks || []);
      } else {
        setError(data.message || 'Could not load bookmarks.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while loading bookmarks.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (isPending) return;
    if (user?.email) fetchBookmarks();
    else setLoading(false);
  }, [isPending, user?.email, fetchBookmarks]);

  // Toggle Bookmark (Remove)
  const toggleBookmark = async (ebookId) => {
    if (!user?.email) return;

    try {
      const res = await authFetch(`/api/v1/users/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ebookId }),
      });

      const data = await res.json();

      if (data.success) {
        setBookmarks(bookmarks.filter(b => b.ebookId !== ebookId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const busy = isPending || loading;

  return (
    <div className="max-w-6xl mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
        .bm-card { 
          transition: all .3s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .bm-card:hover { 
          transform: translateY(-6px); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.35);
          border-color: rgba(244,196,48,0.3);
        }
      `}</style>

      {/* Header */}
      <div className="mb-12">
        <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: '#F4C430', marginBottom: 8 }}>
          My Space
        </p>
        <h1 style={{ fontFamily: FD, fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 700, color: '#EDE9E0', letterSpacing: '-.03em' }}>
          Bookmarks
        </h1>
        <p style={{ fontFamily: F, fontSize: 13.5, color: '#475569', marginTop: 6 }}>
          {bookmarks.length > 0
            ? `${bookmarks.length} ebook${bookmarks.length === 1 ? '' : 's'} saved for later`
            : 'Your saved ebooks will appear here'}
        </p>
      </div>

      {/* Loading */}
      {busy ? (
        <div className="flex flex-col items-center justify-center py-28 gap-4">
          <Loader2 size={32} className="animate-spin" style={{ color: '#F4C430' }} />
          <span style={{ fontFamily: F, fontSize: 13, color: '#334155' }}>Loading your bookmarks...</span>
        </div>
      ) : error ? (
        <div className="text-center py-28">
          <p style={{ fontFamily: F, fontSize: 13.5, color: '#F87171', marginBottom: 20 }}>{error}</p>
          <button
            onClick={fetchBookmarks}
            style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#F4C430', background: 'rgba(244,196,48,0.1)', border: '0.5px solid rgba(244,196,48,0.3)', borderRadius: 12, padding: '11px 26px', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      ) : !user ? (
        <div className="text-center py-28">
          <Bookmark size={52} style={{ color: '#1E293B', margin: '0 auto 20px' }} />
          <p style={{ fontFamily: F, fontSize: 13.5, color: '#475569' }}>Please sign in to view your bookmarks.</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-28">
          <Bookmark size={52} style={{ color: '#1E293B', margin: '0 auto 20px' }} />
          <p style={{ fontFamily: FD, fontSize: 20, color: '#94A3B8', marginBottom: 8 }}>No bookmarks yet</p>
          <p style={{ fontFamily: F, fontSize: 13.5, color: '#334155', marginBottom: 28 }}>
            Save ebooks you love to read later.
          </p>
          <Link
            href="/ebooks"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: F, fontSize: 13.5, fontWeight: 600, color: '#07070E', background: '#F4C430', borderRadius: 12, padding: '12px 28px', textDecoration: 'none' }}
          >
            Browse ebooks
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((b) => (
            <div key={b.ebookId} className="relative group">
              <Link
                href={`/ebooks/${b.ebookId}`}
                className="bm-card block"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  borderRadius: 18,
                  overflow: 'hidden',
                  textDecoration: 'none',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                  {b.ebookCover ? (
                    <Image 
                      src={b.ebookCover} 
                      alt={b.ebookTitle} 
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                      <Bookmark size={40} style={{ color: '#333' }} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,14,0.85) 30%, transparent 70%)' }} />
                </div>

                <div style={{ padding: '16px 18px 20px' }}>
                  <h3 style={{
                    fontFamily: FD, 
                    fontSize: 15, 
                    fontWeight: 600, 
                    color: '#E2E8F0',
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {b.ebookTitle}
                  </h3>
                  <p style={{ fontFamily: F, fontSize: 11.5, color: '#64748B', marginTop: 6 }}>
                    {b.writerName}
                  </p>
                </div>
              </Link>

              {/* Love / Remove Button */}
              <button
                onClick={() => toggleBookmark(b.ebookId)}
                className="absolute top-4 right-4 bg-black/80 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                title="Remove from bookmarks"
              >
                <Heart size={18} fill="#ef4444" stroke="#ef4444" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}