// app/dashboard/reader/layout.js
import { requireRole } from '@/lib/core/session';

export default async function ReaderDashboardLayout({ children }) {
    await requireRole('reader');
    return children;
}