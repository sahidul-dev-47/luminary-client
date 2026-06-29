// app/dashboard/writer/layout.js
import { requireRole } from '@/lib/core/session';

export default async function WriterDashboardLayout({ children }) {
    await requireRole('writer');
    return children;
}