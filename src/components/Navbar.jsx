"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BookOpen, LayoutDashboard,
  LogIn, UserPlus, Menu, X, LogOut,
} from "lucide-react";

const LuminaryIcon = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
    <circle cx="19" cy="19" r="18" fill="rgba(244,196,48,0.12)" stroke="rgba(244,196,48,0.3)" strokeWidth="0.8" />
    <path d="M19 8 L22.5 16 L19 13.5 L15.5 16 Z" fill="#F4C430" />
    <path d="M19 13.5 L19 27" stroke="#F4C430" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M13.5 30 L24.5 30" stroke="rgba(244,196,48,0.45)" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="19" cy="8" r="2.2" fill="#F4C430" />
    <path d="M13 10.5 L8.5 8.5" stroke="rgba(244,196,48,0.5)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M25 10.5 L29.5 8.5" stroke="rgba(244,196,48,0.5)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M10.5 17 L7 19" stroke="rgba(244,196,48,0.25)" strokeWidth="1" strokeLinecap="round" />
    <path d="M27.5 17 L31 19" stroke="rgba(244,196,48,0.25)" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const PUBLIC_LINKS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/browse", label: "Browse", Icon: BookOpen },
];
const PRIVATE_LINKS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenu] = useState(false);
  const [scrolled, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  const login = () => setUser({ name: "Rafi", role: "user" });
  const logout = () => { setUser(null); setMenu(false); };

  const links = user ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS;

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999]">
      <nav
        className={`flex items-center justify-between h-16 px-10 border-b transition-all duration-300
          ${scrolled 
            ? "bg-[#080812]/98 backdrop-blur-[18px] shadow-[0_4px_28px_rgb(0,0,0,0.55)]" 
            : "bg-[#0D0D1A]/92 backdrop-blur-[18px]"
          } border-[#F4C430]/13`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
            <LuminaryIcon size={34} />
          </motion.div>
          <div className="flex flex-col leading-none select-none">
            <span className="font-serif text-[20px] font-bold text-[#F8FAFC] tracking-[0.02em]">
              Luminary
            </span>
            <span className="text-[8.5px] font-semibold tracking-[0.18em] uppercase text-[#F4C430] mt-[3px]">
              Read · Discover · Shine
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(({ href, label, Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-[6px] px-[14px] py-[7px] rounded-[9px] text-[13.5px] font-medium transition-all ${
                    active
                      ? "text-[#F4C430] bg-[#F4C430]/10 border border-[#F4C430]/20"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
                  }`}
                >
                  <Icon size={14} strokeWidth={1.8} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div
                key="out"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <button
                  onClick={login}
                  className="flex items-center gap-[6px] px-4 py-[7px] rounded-[9px] text-[13.5px] font-medium text-[#F4C430] border border-[#F4C430]/30 hover:bg-[#F4C430]/10 transition-all"
                >
                  <LogIn size={13} strokeWidth={2} />
                  Login
                </button>

                <Link
                  href="/register"
                  className="flex items-center gap-[6px] px-4 py-[7px] rounded-[9px] text-[13.5px] font-semibold text-[#0D0D1A] bg-[#F4C430] hover:opacity-90 active:translate-y-[-1px] transition-all"
                >
                  <UserPlus size={13} strokeWidth={2.2} />
                  Get Started
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="in"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3"
              >
                <span className="text-sm text-[#94A3B8]">
                  Hi, <span className="text-[#F8FAFC] font-medium">{user.name}</span>
                </span>

                <motion.div
                  whileHover={{ scale: 1.07 }}
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold cursor-pointer bg-gradient-to-br from-[#F4C430] to-[#818CF8] text-[#0D0D1A] border-[1.5px] border-[#F4C430]/40"
                >
                  {user.name[0]}
                </motion.div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-[#64748B] hover:text-[#F87171] hover:bg-[#F87171]/10 transition-all"
                >
                  <LogOut size={13} strokeWidth={1.8} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenu((p) => !p)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-[9px] text-[#94A3B8] hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? "x" : "m"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            className="md:hidden bg-[#080814]/98 border-b border-[#F4C430]/12 backdrop-blur-lg"
          >
            <div className="px-6 py-5">
              <ul className="space-y-1 mb-6">
                {links.map(({ href, label, Icon }) => {
                  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[14px] font-medium transition-all ${
                          active
                            ? "text-[#F4C430] bg-[#F4C430]/10"
                            : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon size={17} strokeWidth={1.8} />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-white/10 pt-5 flex gap-3">
                {!user ? (
                  <>
                    <button
                      onClick={() => { login(); setMenu(false); }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[13.5px] font-medium text-[#F4C430] border border-[#F4C430]/28 hover:bg-[#F4C430]/10"
                    >
                      <LogIn size={15} /> Login
                    </button>
                    <Link
                      href="/register"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[13.5px] font-semibold text-[#0D0D1A] bg-[#F4C430]"
                    >
                      <UserPlus size={15} /> Get Started
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={logout}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[13.5px] font-medium text-[#F87171] border border-red-500/25 hover:bg-red-500/10"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}