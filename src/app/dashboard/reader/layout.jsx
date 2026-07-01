'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

const F = "'Inter',system-ui,sans-serif";

export default function ReaderDashboardLayout({ children }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user || null;
  const role = user?.role ?? 'Reader';

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (role !== 'Reader') {
      router.replace(`/dashboard/${role.toLowerCase()}`);
    }
  }, [isPending, user, role, router]);

  if (isPending) {
    return (
      <div style={{ minHeight: '100vh', background: '#07070E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <Loader2 size={28} className="animate-spin" style={{ color: '#F4C430' }} />
          <p style={{ fontFamily: F, fontSize: 12.5, letterSpacing: '.06em', color: '#334155' }}>
            Loading your library…
          </p>
        </div>
      </div>
    );
  }

  if (!user || role !== 'Reader') {
    return (
      <div style={{ minHeight: '100vh', background: '#07070E' }} />
    );
  }

  return <>{children}</>;
}