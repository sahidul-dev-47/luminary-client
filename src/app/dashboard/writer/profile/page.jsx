'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Loader2, LogOut, Mail, Calendar, Shield, BookOpen, DollarSign,
  TrendingUp, CheckCircle2, Circle, PenLine, ImageOff,
} from 'lucide-react';
import { authClient, signOut } from '@/lib/auth-client';

const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

function EbookCard({ book }) {
  const isPublished = book.status === 'Published';
  return (
    <Link
      href={`/dashboard/writer/my-ebooks`}
      style={{
        display: 'block',
        background: 'rgba(255,255,255,0.02)',
        border: '0.5px solid rgba(255,255,255,0.07)',
        borderRadius: 18,
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'border-color .15s, transform .15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{
        width: '100%', aspectRatio: '3/4', background: '#12111F',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <ImageOff size={22} strokeWidth={1.5} style={{ color: '#1E293B' }} />
        )}
        <span style={{
          position: 'absolute', top: 8, right: 8,
          display: 'flex', alignItems: 'center', gap: 4,
          fontFamily: F, fontSize: 9.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: 20,
          color: isPublished ? '#10B981' : '#F97316',
          background: isPublished ? 'rgba(16,185,129,0.15)' : 'rgba(249,115,22,0.15)',
          backdropFilter: 'blur(4px)',
        }}>
          {isPublished ? <CheckCircle2 size={10} /> : <Circle size={10} />}
          {book.status}
        </span>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <p style={{
          fontFamily: FD, fontSize: 14.5, fontWeight: 700, color: '#EDE9E0',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4,
        }}>
          {book.title}
        </p>
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: F, fontSize: 12, color: '#818CF8' }}>${Number(book.price).toFixed(2)}</span>
          <span style={{ fontFamily: F, fontSize: 11, color: '#475569' }}>{book.soldCount || 0} sold</span>
        </div>
      </div>
    </Link>
  );
}

export default function WriterProfile() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;
  const [signingOut, setSigningOut] = useState(false);
  const [data, setData] = useState({ ebooks: [], sales: [], loading: true });

  useEffect(() => {
    if (!user?.id && !user?.email) return;
    (async () => {
      try {
        const writerId = user.id || user.email;
        const [ebooksRes, salesRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/writer/ebooks?writerId=${encodeURIComponent(writerId)}`).then(r => r.json()),
          fetch(`${API_URL}/api/v1/writer/sales?writerEmail=${encodeURIComponent(user.email)}`).then(r => r.json()),
        ]);
        setData({
          ebooks: ebooksRes?.ebooks || [],
          sales: salesRes?.sales || [],
          loading: false,
        });
      } catch (err) {
        console.error('Writer profile fetch failed:', err);
        setData(d => ({ ...d, loading: false }));
      }
    })();
  }, [user?.id, user?.email]);

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
        <Loader2 size={26} className="animate-spin" style={{ color: '#818CF8' }} />
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
  const publishedCount = data.ebooks.filter(b => b.status === 'Published').length;
  const totalRevenue = data.sales.reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <div className="mb-10">
        <p style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: '#818CF8', marginBottom: 8 }}>
          My Space
        </p>
        <h1 style={{ fontFamily: FD, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 700, color: '#EDE9E0', letterSpacing: '-.02em' }}>
          Writer Profile
        </h1>
      </div>

      {/* Hero card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(129,140,248,0.07), rgba(212,83,126,0.04))',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 'clamp(24px,5vw,40px)',
        marginBottom: 20,
      }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div style={{
            width: 88, height: 88, borderRadius: 22, flexShrink: 0,
            background: 'linear-gradient(135deg,#818CF8,#D4537E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FD, fontSize: 34, fontWeight: 700, color: '#07070E',
          }}>
            {user.name?.charAt(0)?.toUpperCase() || 'W'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <h2 style={{ fontFamily: FD, fontSize: 24, fontWeight: 700, color: '#EDE9E0' }}>
                {user.name || 'Writer'}
              </h2>
              <span style={{
                fontFamily: F, fontSize: 9.5, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase',
                color: '#818CF8', background: 'rgba(129,140,248,0.12)', border: '0.5px solid rgba(129,140,248,0.28)',
                padding: '3px 9px', borderRadius: 20,
              }}>
                Writer
              </span>
            </div>
            <p style={{ fontFamily: F, fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 4 }}>
              <Mail size={13} strokeWidth={1.8} /> {user.email}
            </p>
            <p style={{ fontFamily: F, fontSize: 12, color: '#334155', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              <Calendar size={12} strokeWidth={1.8} /> Writing since {memberSince}
            </p>
          </div>
          <Link
            href="/dashboard/writer/add-ebook"
            className="flex-shrink-0"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: F, fontSize: 13, fontWeight: 600, color: '#10B981',
              background: 'rgba(16,185,129,0.1)', border: '0.5px solid rgba(16,185,129,0.25)',
              padding: '10px 16px', borderRadius: 12, textDecoration: 'none',
            }}
          >
            <PenLine size={14} strokeWidth={2} /> New Ebook
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard Icon={BookOpen} label="Total Ebooks" color="#818CF8" value={data.loading ? '—' : data.ebooks.length} />
        <StatCard Icon={CheckCircle2} label="Published" color="#10B981" value={data.loading ? '—' : publishedCount} />
        <StatCard Icon={TrendingUp} label="Total Sales" color="#F4C430" value={data.loading ? '—' : data.sales.length} />
        <StatCard Icon={DollarSign} label="Revenue" color="#D4537E" value={data.loading ? '—' : `$${totalRevenue.toFixed(2)}`} />
      </div>

      {/* All ebooks by this writer */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontFamily: FD, fontSize: 20, fontWeight: 700, color: '#EDE9E0' }}>
            All Ebooks by {user.name || 'this Writer'}
          </h3>
          <span style={{ fontFamily: F, fontSize: 12, color: '#475569' }}>
            {data.loading ? '' : `${data.ebooks.length} total`}
          </span>
        </div>

        {data.loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={22} className="animate-spin" style={{ color: '#818CF8' }} />
          </div>
        ) : data.ebooks.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px', borderRadius: 20,
            background: 'rgba(255,255,255,0.02)', border: '0.5px dashed rgba(255,255,255,0.1)',
          }}>
            <BookOpen size={26} strokeWidth={1.5} style={{ color: '#1E293B', margin: '0 auto 12px' }} />
            <p style={{ fontFamily: F, fontSize: 13, color: '#475569' }}>No ebooks published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.ebooks.map((book) => (
              <EbookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* Account card */}
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
            <p style={{ fontFamily: FD, fontSize: 17, fontWeight: 600, color: '#818CF8' }}>Writer</p>
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