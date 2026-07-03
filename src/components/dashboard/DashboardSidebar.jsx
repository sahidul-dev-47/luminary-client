"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authClient, signOut } from "@/lib/auth-client";
import {
  LogOut,
  Home,
  BookOpen,
  Bookmark,
  BarChart3,
  Users,
  PlusCircle,
  ShoppingCart,
  CreditCard,
  ChevronRight,
  Settings,
  Menu,
  X,
  TrendingUp,
  LayoutDashboard,
  LayoutDashboardIcon,
} from "lucide-react";

const FD = "'Playfair Display',Georgia,serif";
const F = "'Inter',system-ui,sans-serif";

const NAV = {
  Reader: [
    { href: "/dashboard/reader", label: "Dashboard", Icon: LayoutDashboard },
    {
      href: "/dashboard/reader/purchase",
      label: "Purchase History",
      Icon: ShoppingCart,
    },
    { href: "/dashboard/reader/library", label: "My Library", Icon: BookOpen },
    { href: "/dashboard/reader/bookmarks", label: "Bookmarks", Icon: Bookmark },
    { href: "/dashboard/reader/profile", label: "Profile", Icon: Settings },
  ],
  Writer: [
    { href: "/dashboard/writer", label: "Dashboard", Icon: LayoutDashboard },
    { href: "/dashboard/writer/my-ebooks", label: "My Ebooks", Icon: BookOpen },
    {
      href: "/dashboard/writer/add-ebook",
      label: "Add New Ebook",
      Icon: PlusCircle,
      accent: true,
    },
    {
      href: "/dashboard/writer/sales",
      label: "Sales History",
      Icon: BarChart3,
    },
    { href: "/dashboard/writer/bookmarks", label: "Bookmarks", Icon: Bookmark },
    {
      href: "/dashboard/writer/analytics",
      label: "Analytics",
      Icon: TrendingUp,
    },
    { href: "/dashboard/writer/profile", label: "Profile", Icon: Settings },
  ],
  Admin: [
    { href: "/dashboard/admin", label: "Dashboard", Icon: LayoutDashboardIcon },
    { href: "/dashboard/admin/users", label: "Manage Users", Icon: Users },
    { href: "/dashboard/admin/ebooks", label: "All Ebooks", Icon: BookOpen },
    {
      href: "/dashboard/admin/transactions",
      label: "Transactions",
      Icon: CreditCard,
    },
    {
      href: "/dashboard/admin/analytics",
      label: "Analytics",
      Icon: TrendingUp,
    },
  ],
};

const ROLE_META = {
  Reader: {
    label: "Reader Dashboard",
    section: "My Space",
    color: "#F4C430",
    bg: "rgba(244,196,48,0.12)",
    borderColor: "rgba(244,196,48,0.28)",
    grad: "linear-gradient(135deg,#F4C430,#818CF8)",
  },
  Writer: {
    label: "Writer Dashboard",
    section: "My Space",
    color: "#818CF8",
    bg: "rgba(129,140,248,0.12)",
    borderColor: "rgba(129,140,248,0.28)",
    grad: "linear-gradient(135deg,#818CF8,#D4537E)",
  },
  Admin: {
    label: "Admin Dashboard",
    section: "Management",
    color: "#F97316",
    bg: "rgba(249,115,22,0.12)",
    borderColor: "rgba(249,115,22,0.28)",
    grad: "linear-gradient(135deg,#F97316,#F4C430)",
  },
};

// Logo Component
function Logo() {
  return (
    <Link
      href="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        textDecoration: "none",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 38 38" fill="none">
        <circle
          cx="19"
          cy="19"
          r="17"
          fill="rgba(244,196,48,0.1)"
          stroke="rgba(244,196,48,0.28)"
          strokeWidth=".8"
        />
        <path d="M19 9L22 17L19 15L16 17Z" fill="#F4C430" />
        <path
          d="M19 15L19 26"
          stroke="#F4C430"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="19" cy="9" r="2" fill="#F4C430" />
        <path
          d="M13 11L9 9"
          stroke="rgba(244,196,48,0.45)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M25 11L29 9"
          stroke="rgba(244,196,48,0.45)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        <span
          style={{
            fontFamily: FD,
            fontSize: 17,
            fontWeight: 700,
            color: "#F0EDE6",
            letterSpacing: ".02em",
          }}
        >
          Luminary
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "#F4C430",
            marginTop: 2,
            fontFamily: F,
          }}
        >
          Dashboard
        </span>
      </div>
    </Link>
  );
}

// NavLink Component
function NavLink({ href, label, Icon, active, accent, roleColor, onClick }) {
  const base = {
    fontFamily: F,
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    marginBottom: 2,
    borderWidth: "0.5px",
    borderStyle: "solid",
    transition: "color .15s, background .15s, border-color .15s",
    cursor: "pointer",
    textDecoration: "none",
  };

  let extraStyle;
  if (accent) {
    extraStyle = {
      color: "#10B981",
      background: "rgba(16,185,129,0.08)",
      borderColor: "rgba(16,185,129,0.2)",
    };
  } else if (active) {
    extraStyle = {
      color: roleColor,
      background: `${roleColor}14`,
      borderColor: `${roleColor}33`,
    };
  } else {
    extraStyle = {
      color: "#334155",
      background: "transparent",
      borderColor: "transparent",
    };
  }

  const handleMouseEnter = (e) => {
    if (!active && !accent) {
      e.currentTarget.style.color = "#94A3B8";
      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
    }
  };

  const handleMouseLeave = (e) => {
    if (!active && !accent) {
      e.currentTarget.style.color = "#334155";
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.borderColor = "transparent";
    }
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      style={{ ...base, ...extraStyle }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Icon
        size={15}
        strokeWidth={active ? 2.2 : 1.8}
        style={{ flexShrink: 0 }}
      />
      <span style={{ flex: 1 }}>{label}</span>
      {active && (
        <ChevronRight
          size={13}
          strokeWidth={2}
          style={{ color: roleColor, opacity: 0.7, flexShrink: 0 }}
        />
      )}
    </Link>
  );
}

// Sidebar Content
function SidebarContent({
  role,
  rm,
  links,
  pathname,
  session,
  onLinkClick,
  onLogout,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        }}
      >
        <Logo />
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 9,
            background: rm.bg,
            borderWidth: "0.5px",
            borderStyle: "solid",
            borderColor: rm.borderColor,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: rm.color,
              flexShrink: 0,
              animation: "lp 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: rm.color,
              fontFamily: F,
              whiteSpace: "nowrap",
            }}
          >
            {rm.label}
          </span>
        </div>
      </div>

      <nav
        className="lum-nav"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 12px 16px",
          scrollbarWidth: "none",
        }}
      >
        <NavLink
          href="/"
          label="Home"
          Icon={Home}
          active={pathname === "/"}
          roleColor={rm.color}
          onClick={onLinkClick}
        />

        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "#1E293B",
            padding: "12px 12px 6px",
            fontFamily: F,
          }}
        >
          {rm.section}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {links.map(({ href, label, Icon, accent }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                Icon={Icon}
                active={pathname === href}
                accent={accent}
                roleColor={rm.color}
                onClick={onLinkClick}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </nav>

      <div
        style={{
          padding: "12px",
          borderTop: "0.5px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.025)",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: rm.grad,
              color: "#07070E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 12.5,
                fontWeight: 500,
                color: "#CBD5E1",
                fontFamily: F,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {session?.user?.name || "User"}
            </p>
            <p
              style={{
                fontSize: 10,
                color: "#334155",
                fontFamily: F,
                textTransform: "capitalize",
              }}
            >
              {role}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            fontFamily: F,
            color: "#334155",
            background: "transparent",
            borderWidth: "0.5px",
            borderStyle: "solid",
            borderColor: "transparent",
            cursor: "pointer",
            transition: "color .15s, background .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#F87171";
            e.currentTarget.style.background = "rgba(248,113,113,0.07)";
            e.currentTarget.style.borderColor = "rgba(248,113,113,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#334155";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <LogOut size={14} strokeWidth={1.8} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
const SIDEBAR_STYLE = {
  background: '#0A0918',
  width: '240px',
  flexShrink: 0,
  
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    authClient.getSession({ query: { disableCookieCache: true } });
  }, []);

  const role = session?.user?.appRole ?? "Reader";
  const rm = ROLE_META[role] ?? ROLE_META.Reader;
  const links = NAV[role] ?? NAV.Reader;

  

  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const mql = window.matchMedia("(min-width: 768px)");
    const handleChange = (e) => {
      if (e.matches) setMobileOpen(false);
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [mobileOpen]);

  return (
    <>
      <style>{`
        @keyframes lp { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.65)} }
        .lum-nav::-webkit-scrollbar { display:none }
      `}</style>

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:block"
        style={{
          ...SIDEBAR_STYLE,
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          zIndex: 40,
          boxSizing: "border-box",
        }}
      >
        <div style={{ position: "relative", zIndex: 10, height: "100%" }}>
          <SidebarContent
            role={role}
            rm={rm}
            links={links}
            pathname={pathname}
            session={session}
            onLinkClick={undefined}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header
        className="md:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          background: "rgba(10,9,24,0.97)",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Logo />
        <button
          onClick={() => setMobileOpen((p) => !p)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#475569",
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            cursor: "pointer",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mobileOpen ? "x" : "m"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="md:hidden"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 40,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />
            <motion.aside
              className="md:hidden"
              style={{
                ...SIDEBAR_STYLE,
                position: "fixed",
                left: 0,
                top: 0,
                width: 260,
                maxWidth: "86vw",
                height: "100vh",
                zIndex: 50,
                overflow: "hidden",
              }}
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <SidebarContent
                role={role}
                rm={rm}
                links={links}
                pathname={pathname}
                session={session}
                onLinkClick={closeMobile}
                onLogout={async () => {
                  closeMobile();
                  await handleLogout();
                }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
