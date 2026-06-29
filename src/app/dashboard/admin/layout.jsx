// app/dashboard/admin/layout.js
import { requireRole } from '@/lib/core/session';

export default async function AdminDashboardLayout({ children }) {
    await requireRole('admin');
    return children;
}