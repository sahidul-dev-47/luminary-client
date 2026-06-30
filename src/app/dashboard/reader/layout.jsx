'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

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

  // Loading state 
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

  return (
    <div className="flex min-h-screen" style={{ background: '#07070E' }}>
      <DashboardSidebar />

      <main className="flex-1 md:ml-60 pt-14 md:pt-0">
        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}