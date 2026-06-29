

import { getUserSession } from '@/lib/core/session';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const user = await getUserSession();

    if (!user?.role) {
        redirect('/auth/login');
    }

    
    switch (user.role) {
        case "Writer":
            redirect('/dashboard/writer');
            break;
        case "Reader":
            redirect('/dashboard/reader');
            break;
        case "Admin":
            redirect('/dashboard/admin');
            break;
        default:
            redirect('/unauthorized');
    }
}