"use client";
import { useEffect, useMemo, useState } from "react";
import { Fraunces, Inter } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  ShieldAlert,
  Loader2,
  ExternalLink,
  Search,
  X,
  Check,
  BookOpen,
  Feather,
  Crown,
  Users as UsersIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { authFetch } from "@/lib/clientFetch";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

const PALETTE = {
  gold: "#D4A657",
  rose: "#E2836F",
  teal: "#6FBF9A",
  ink: "#0B0D14",
  card: "#161922",
};


const ROLES = {
  user: { label: "Reader", icon: BookOpen, color: PALETTE.teal, blurb: "Browses & purchases ebooks" },
  writer: { label: "Writer", icon: Feather, color: PALETTE.gold, blurb: "Publishes & sells ebooks" },
  admin: { label: "Admin", icon: Crown, color: PALETTE.rose, blurb: "Full platform control" },
};
const ROLE_ORDER = ["user", "writer", "admin"];

function initialsOf(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

function RoleBadge({ role }) {
  const r = ROLES[role] || ROLES.user;
  const Icon = r.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      style={{ backgroundColor: `${r.color}1A`, color: r.color }}
    >
      <Icon size={12} strokeWidth={2} />
      {r.label}
    </span>
  );
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [deleteTarget, setDeleteTarget] = useState(null); 
  const [roleTarget, setRoleTarget] = useState(null); 
  const [updatingId, setUpdatingId] = useState(null);

  

  const fetchUsers = async () => {
    try {
      const res = await authFetch(`/api/v1/admin/users`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || "Failed to load users");
      }
    } catch (err) {
      setError("Cannot connect to server");
      toast.error("Database connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const counts = useMemo(() => {
    const c = { all: users.length, user: 0, writer: 0, admin: 0 };
    users.forEach((u) => {
      const r = (u.role || "user").toLowerCase();
      if (c[r] !== undefined) c[r] += 1;
    });
    return c;
  }, [users]);

  const visibleUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const role = (u.role || "user").toLowerCase();
      if (roleFilter !== "all" && role !== roleFilter) return false;
      if (!q) return true;
      return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
    });
  }, [users, query, roleFilter]);

  const confirmRoleChange = async () => {
    if (!roleTarget?.picked) return;
    const { user, picked } = roleTarget;
    setUpdatingId(user._id);
    try {
      const res = await authFetch(`/api/v1/admin/users/${user._id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: picked }),
      });

      if (res.ok) {
        toast.success(`${user.name} is now ${ROLES[picked].label}`);
        setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: picked } : u)));
      } else {
        toast.error("Failed to update role");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
      setRoleTarget(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const userId = deleteTarget._id;
    setUpdatingId(userId);
    try {
      const res = await authFetch(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("User removed from the platform");
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        toast.error("Failed to delete user");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className={`${body.className} flex min-h-screen items-center justify-center`} style={{ backgroundColor: PALETTE.ink }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: PALETTE.gold }} />
          <p className="text-sm text-[#8B90A3]">Opening the member roll…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${body.className} flex min-h-screen items-center justify-center p-6`} style={{ backgroundColor: PALETTE.ink }}>
        <div className="max-w-md rounded-2xl border border-[#E2836F]/30 bg-[#E2836F]/10 p-6 text-center">
          <ShieldAlert className="mx-auto mb-3 h-10 w-10" style={{ color: PALETTE.rose }} />
          <p className="font-semibold" style={{ color: PALETTE.rose }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${display.variable} ${body.variable} ${body.className} relative flex min-h-screen text-[#F4F1EA]`}
      style={{ backgroundColor: PALETTE.ink }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <DashboardSidebar />

      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#8B90A3]">
              <UsersIcon size={12} style={{ color: PALETTE.teal }} /> Membership Roll
            </p>
            <h1 className={`${display.className} text-4xl italic md:text-5xl`}>Manage Users</h1>
            <p className="mt-1 text-sm text-[#8B90A3]">
              {counts.all} member{counts.all === 1 ? "" : "s"} · {counts.writer} writer{counts.writer === 1 ? "" : "s"} · {counts.admin} admin{counts.admin === 1 ? "" : "s"}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B90A3]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or email…"
              className="w-full rounded-xl border border-white/10 bg-[#161922] py-2.5 pl-10 pr-4 text-sm text-[#F4F1EA] placeholder:text-[#5C6070] focus:outline-none focus:ring-2 focus:ring-[#D4A657]/40"
            />
          </div>
        </div>

        {/* Role filter chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          <FilterChip
            active={roleFilter === "all"}
            label={`All (${counts.all})`}
            color={PALETTE.gold}
            onClick={() => setRoleFilter("all")}
          />
          {ROLE_ORDER.map((r) => (
            <FilterChip
              key={r}
              active={roleFilter === r}
              label={`${ROLES[r].label} (${counts[r]})`}
              color={ROLES[r].color}
              icon={ROLES[r].icon}
              onClick={() => setRoleFilter(r)}
            />
          ))}
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#161922] shadow-2xl">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-[#8B90A3]">
                  <th className="px-5 py-4">Member</th>
                  <th className="hidden px-5 py-4 sm:table-cell">Email</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-sm">
                {visibleUsers.map((user, i) => {
                  const role = (user.role || "user").toLowerCase();
                  const roleInfo = ROLES[role] || ROLES.user;
                  const isBusy = updatingId === user._id;
                  return (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="group transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/users/${user._id}`}
                          className="flex items-center gap-3"
                        >
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                            style={{ backgroundColor: `${roleInfo.color}22`, color: roleInfo.color }}
                          >
                            {initialsOf(user.name)}
                          </span>
                          <span>
                            <span className="inline-flex items-center gap-1.5 font-semibold text-[#F4F1EA] group-hover:text-[#D4A657] transition-colors">
                              {user.name}
                              <ExternalLink size={11} className="opacity-0 transition-opacity group-hover:opacity-100" style={{ color: PALETTE.gold }} />
                            </span>
                            <span className="block text-xs text-[#5C6070] sm:hidden">{user.email}</span>
                          </span>
                        </Link>
                      </td>

                      <td className="hidden px-5 py-4 font-mono text-xs text-[#8B90A3] sm:table-cell">
                        {user.email}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setRoleTarget({ user, picked: role })}
                          disabled={isBusy}
                          className="transition-opacity hover:opacity-80 disabled:opacity-50"
                          title="Change role"
                        >
                          <RoleBadge role={role} />
                        </button>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setDeleteTarget(user)}
                          disabled={isBusy}
                          className="rounded-xl p-2 text-[#E2836F] transition-all hover:bg-[#E2836F]/15 disabled:opacity-50"
                        >
                          {isBusy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {visibleUsers.length === 0 && (
            <div className="p-14 text-center">
              <p className={`${display.className} text-lg italic text-[#8B90A3]`}>No members here</p>
              <p className="mt-1 text-xs text-[#5C6070]">
                {query ? "Try a different search term." : "No one holds this role yet."}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ---------- MODALS ---------- */}
      <AnimatePresence>
        {roleTarget && (
          <RoleModal
            key="role-modal"
            data={roleTarget}
            onPick={(role) => setRoleTarget((prev) => ({ ...prev, picked: role }))}
            onCancel={() => setRoleTarget(null)}
            onConfirm={confirmRoleChange}
            busy={updatingId === roleTarget.user._id}
          />
        )}

        {deleteTarget && (
          <DeleteModal
            key="delete-modal"
            user={deleteTarget}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={confirmDelete}
            busy={updatingId === deleteTarget._id}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({ active, label, color, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all"
      style={
        active
          ? { backgroundColor: `${color}22`, borderColor: `${color}55`, color }
          : { backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "#8B90A3" }
      }
    >
      {Icon && <Icon size={12} />}
      {label}
    </button>
  );
}

function ModalShell({ onCancel, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 p-6 shadow-2xl"
        style={{ backgroundColor: PALETTE.card }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function RoleModal({ data, onPick, onCancel, onConfirm, busy }) {
  const { user, picked } = data;
  const currentRole = (user.role || "user").toLowerCase();
  const changed = picked !== currentRole;

  return (
    <ModalShell onCancel={onCancel}>
      <button
        onClick={onCancel}
        className="absolute right-4 top-4 text-[#5C6070] transition-colors hover:text-[#F4F1EA]"
      >
        <X size={16} />
      </button>

      <p className="text-xs uppercase tracking-[0.2em] text-[#8B90A3]">Change Role</p>
      <h3 className={`${display.className} mt-1 text-2xl italic text-[#F4F1EA]`}>{user.name}</h3>
      <p className="mt-1 text-xs text-[#5C6070]">{user.email}</p>

      <div className="mt-5 space-y-2">
        {ROLE_ORDER.map((r) => {
          const info = ROLES[r];
          const Icon = info.icon;
          const isCurrent = r === currentRole;
          const isPicked = r === picked;
          return (
            <button
              key={r}
              onClick={() => onPick(r)}
              className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all"
              style={
                isPicked
                  ? { borderColor: `${info.color}66`, backgroundColor: `${info.color}14` }
                  : { borderColor: "rgba(255,255,255,0.08)", backgroundColor: "transparent" }
              }
            >
              <span className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${info.color}22`, color: info.color }}
                >
                  <Icon size={14} />
                </span>
                <span>
                  <span className="flex items-center gap-2 text-sm font-medium text-[#F4F1EA]">
                    {info.label}
                    {isCurrent && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-normal uppercase tracking-wide text-[#8B90A3]">
                        Current
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-[#5C6070]">{info.blurb}</span>
                </span>
              </span>
              {isPicked && <Check size={16} style={{ color: info.color }} />}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-xl bg-white/5 px-4 py-2 text-xs font-medium text-[#8B90A3] transition-all hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={!changed || busy}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-[#0B0D14] shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: PALETTE.gold }}
        >
          {busy && <Loader2 size={12} className="animate-spin" />}
          {changed ? `Make ${ROLES[picked].label}` : "Choose a different role"}
        </button>
      </div>
    </ModalShell>
  );
}

function DeleteModal({ user, onCancel, onConfirm, busy }) {
  const role = (user.role || "user").toLowerCase();
  return (
    <ModalShell onCancel={onCancel}>
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl p-2" style={{ backgroundColor: `${PALETTE.rose}1A`, color: PALETTE.rose }}>
          <ShieldAlert size={20} />
        </div>
        <h3 className="text-lg font-bold text-[#F4F1EA]">Remove this member?</h3>
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
          style={{ backgroundColor: `${ROLES[role].color}22`, color: ROLES[role].color }}
        >
          {initialsOf(user.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[#F4F1EA]">{user.name}</p>
          <p className="truncate text-xs text-[#5C6070]">{user.email}</p>
        </div>
      </div>

      <p className="mb-6 text-sm leading-relaxed text-[#8B90A3]">
        This can't be undone. {user.name} will lose access immediately, and their profile,
        {role === "writer" ? " published ebooks, and sales history " : " purchases, and bookmarks "}
        will no longer be reachable from the admin panel.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-xl bg-white/5 px-4 py-2 text-xs font-medium text-[#8B90A3] transition-all hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={busy}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-white shadow-lg transition-all disabled:opacity-50"
          style={{ backgroundColor: PALETTE.rose }}
        >
          {busy && <Loader2 size={12} className="animate-spin" />}
          Delete User
        </button>
      </div>
    </ModalShell>
  );
}