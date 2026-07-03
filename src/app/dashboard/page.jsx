import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
    const user = await getUserSession();

    
    if (!user?.appRole) {
        redirect('/auth/login');
    }

    switch (user.appRole) {
        case "Writer":
            redirect('/dashboard/writer');
        case "Reader":
            redirect('/dashboard/reader');
        case "Admin":
            redirect('/dashboard/admin');
        default:
            redirect('/unauthorized');
    }
}