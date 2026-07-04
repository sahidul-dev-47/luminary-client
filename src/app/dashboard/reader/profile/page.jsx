'use client';

import { useState, useEffect } from 'react';
import { Loader2, LogOut, Mail, Calendar, Shield, BookOpen, Bookmark, Wallet, Sparkles } from 'lucide-react';
import { authClient, signOut } from '@/lib/auth-client';
import { authFetch } from '@/lib/clientFetch';

const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";


function StatCard({ Icon, label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '0.5px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      padding: '16px 18px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -18, right: -18, width: 60, height: 60,
        borderRadius: '50%', background: `${color}12`,
      }} />
      <p style={{ fontFamily: F, fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#1E293B', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={11} strokeWidth={1.8} style={{ color }} />
        {label}
      </p>
      <p style={{ fontFamily: FD, fontSize: 22, fontWeight: 700, color: '#EDE9E0' }}>
        {value}
      </p>
    </div>
  );
}

export default function ReaderProfile() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;
  const [signingOut, setSigningOut] = useState(false);
  const [stats, setStats] = useState({ purchases: [], bookmarks: [], loading: true });

  useEffect(() => {
    if (!user?.email) return;
    (async () => {
      try {
        const [purchaseRes, bookmarkRes] = await Promise.all([
          authFetch(`/api/v1/users/purchases?email=${encodeURIComponent(user.email)}`).then(r => r.json()),
          authFetch(`/api/v1/users/bookmarks?email=${encodeURIComponent(user.email)}`).then(r => r.json()),
        ]);
        setStats({
          purchases: purchaseRes?.purchases || [],
          bookmarks: bookmarkRes?.bookmarks || [],
          loading: false,
        });
      } catch (err) {
        console.error('Profile stats fetch failed:', err);
        setStats(s => ({ ...s, loading: false }));
      }
    })();
  }, [user?.email]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error(err);
      setSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-3">
        <Loader2 size={26} className="animate-spin" style={{ color: '#F4C430' }} />
        <span style={{ fontFamily: F, fontSize: 12.5, color: '#334155' }}>Loading profile…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-28">
        <p style={{ fontFamily: F, fontSize: 13.5, color: '#475569' }}>Please sign in to view your profile.</p>
      </div>
    );
  }

  const memberSince = user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();
  const totalSpent = stats.purchases.reduce((sum, p) => sum + (p.amount || 0), 0);

  
  const genreCounts = {};
  stats.purchases.forEach(p => {
    if (p.genre) genreCounts[p.genre] = (genreCounts[p.genre] || 0) + 1;
  });
  const favoriteGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="max-w-3xl mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <div className="mb-10">
        <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: '#F4C430', marginBottom: 8 }}>
          My Space
        </p>
        <h1 style={{ fontFamily: FD, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, color: '#EDE9E0', letterSpacing: '-.02em' }}>
          My Profile
        </h1>
      </div>

      {/* Hero card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(244,196,48,0.06), rgba(129,140,248,0.04))',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 'clamp(24px,5vw,40px)',
        marginBottom: 20,
      }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div style={{
            width: 88, height: 88, borderRadius: 22, flexShrink: 0,
            background: 'linear-gradient(135deg,#F4C430,#818CF8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FD, fontSize: 34, fontWeight: 700, color: '#07070E',
          }}>
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <h2 style={{ fontFamily: FD, fontSize: 24, fontWeight: 700, color: '#EDE9E0' }}>
                {user.name || 'Reader'}
              </h2>
              <span style={{
                fontFamily: F, fontSize: 9.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                color: '#F4C430', background: 'rgba(244,196,48,0.12)', border: '0.5px solid rgba(244,196,48,0.28)',
                padding: '3px 9px', borderRadius: 20,
              }}>
                Reader
              </span>
            </div>
            <p style={{ fontFamily: F, fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 4 }}>
              <Mail size={13} strokeWidth={1.8} /> {user.email}
            </p>
            <p style={{ fontFamily: F, fontSize: 12, color: '#334155', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <Calendar size={12} strokeWidth={1.8} /> Member since {memberSince}
            </p>
            {favoriteGenre && (
              <p style={{ fontFamily: F, fontSize: 12, color: '#818CF8', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 6 }}>
                <Sparkles size={12} strokeWidth={1.8} /> Mostly reads {favoriteGenre}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <StatCard Icon={BookOpen} label="Books Owned" color="#F4C430" value={stats.loading ? '—' : stats.purchases.length} />
        <StatCard Icon={Bookmark} label="Bookmarks" color="#818CF8" value={stats.loading ? '—' : stats.bookmarks.length} />
        <StatCard Icon={Wallet} label="Total Spent" color="#10B981" value={stats.loading ? '—' : `$${totalSpent.toFixed(2)}`} />
      </div>

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.025)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 'clamp(24px,5vw,32px)',
      }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 18px' }}>
            <p style={{ fontFamily: F, fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#1E293B', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={11} strokeWidth={1.8} /> Role
            </p>
            <p style={{ fontFamily: FD, fontSize: 17, fontWeight: 600, color: '#F4C430' }}>Reader</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 18px' }}>
            <p style={{ fontFamily: F, fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#1E293B', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={11} strokeWidth={1.8} /> Member Since
            </p>
            <p style={{ fontFamily: FD, fontSize: 17, fontWeight: 600, color: '#CBD5E1' }}>{memberSince}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
            padding: '13px', borderRadius: 14,
            fontFamily: F, fontSize: 13.5, fontWeight: 600,
            color: '#F87171', background: 'rgba(248,113,113,0.06)',
            border: '0.5px solid rgba(248,113,113,0.16)',
            cursor: signingOut ? 'not-allowed' : 'pointer',
            opacity: signingOut ? 0.6 : 1,
            transition: 'background .15s, border-color .15s',
          }}
          onMouseEnter={(e) => { if (!signingOut) { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.28)'; } }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(248,113,113,0.06)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.16)'; }}
        >
          {signingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} strokeWidth={1.8} />}
          {signingOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}