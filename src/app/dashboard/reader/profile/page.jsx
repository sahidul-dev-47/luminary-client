'use client';

import { useState } from 'react';
import { Loader2, LogOut, Mail, Calendar, Shield } from 'lucide-react';
import { authClient, signOut } from '@/lib/auth-client';

const FD = "'Playfair Display',Georgia,serif";
const F  = "'Inter',system-ui,sans-serif";

export default function ReaderProfile() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user || null;
  const [signingOut, setSigningOut] = useState(false);

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

  const memberSince = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="max-w-2xl mx-auto">
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

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.025)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: 'clamp(24px,5vw,40px)',
      }}>

        {/* Avatar + name */}
        <div className="flex flex-col items-center text-center mb-10">
          <div style={{
            width: 88, height: 88, borderRadius: 22,
            background: 'linear-gradient(135deg,#F4C430,#818CF8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FD, fontSize: 34, fontWeight: 700, color: '#07070E',
            marginBottom: 18,
          }}>
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h2 style={{ fontFamily: FD, fontSize: 24, fontWeight: 700, color: '#EDE9E0' }}>
            {user.name || 'Reader'}
          </h2>
          <p style={{ fontFamily: F, fontSize: 13, color: '#475569', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Mail size={13} strokeWidth={1.8} />
            {user.email}
          </p>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 18px' }}>
            <p style={{ fontFamily: F, fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#1E293B', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={11} strokeWidth={1.8} />
              Role
            </p>
            <p style={{ fontFamily: FD, fontSize: 17, fontWeight: 600, color: '#F4C430' }}>
              Reader
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 18px' }}>
            <p style={{ fontFamily: F, fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: '#1E293B', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={11} strokeWidth={1.8} />
              Member Since
            </p>
            <p style={{ fontFamily: FD, fontSize: 17, fontWeight: 600, color: '#CBD5E1' }}>
              {memberSince}
            </p>
          </div>
        </div>

        {/* Sign out */}
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