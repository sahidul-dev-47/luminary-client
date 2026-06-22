"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, Loader2 } from "lucide-react";

const F  = { fontFamily: "'Inter','system-ui',sans-serif" };
const FD = { fontFamily: "'Playfair Display',Georgia,serif" };
const ACC = "#F4C430";

// ── Left panel book stack ──────────────────────────────────
function BookStack() {
  const books = [
    { title: "Glass\nMeridian",   bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.2)",  spine: "rgba(129,140,248,0.22)", c: "rgba(129,140,248,0.5)", rot: "rotate(6deg)",  l: 30, t: 20 },
    { title: "Echoes\nof Silence",bg: "rgba(212,83,126,0.1)",  border: "rgba(212,83,126,0.2)",   spine: "rgba(212,83,126,0.2)",  c: "rgba(212,83,126,0.5)", rot: "rotate(-3deg)", l: 14, t: 12 },
    { title: "The Silent\nArchive",bg: "rgba(244,196,48,0.1)", border: "rgba(244,196,48,0.22)",  spine: "rgba(244,196,48,0.2)",  c: "rgba(244,196,48,0.55)",rot: "rotate(0deg)",   l: 0,  t: 0, front: true },
  ];
  return (
    <div style={{ position: "relative", width: 120, height: 140, margin: "0 auto 20px" }}>
      {books.map((b, i) => (
        <div key={i} style={{ position: "absolute", width: 82, height: 118, left: b.l, top: b.t, transform: b.rot, background: b.bg, border: `0.5px solid ${b.border}`, borderRadius: "3px 8px 8px 3px", zIndex: i + 1, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 7, background: b.spine, borderRadius: "1px 0 0 1px" }} />
          {b.front && (
            <div style={{ position: "absolute", top: 12, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 38 38" fill="none">
                <circle cx="19" cy="19" r="17" fill="rgba(244,196,48,0.08)" stroke="rgba(244,196,48,0.25)" strokeWidth=".8"/>
                <path d="M19 9L22 17L19 15L16 17Z" fill="#F4C430"/>
                <path d="M19 15L19 26" stroke="#F4C430" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="19" cy="9" r="2" fill="#F4C430"/>
              </svg>
            </div>
          )}
          <div style={{ position: "absolute", bottom: 10, left: 14, right: 6, ...FD, fontSize: 9, color: b.c, lineHeight: 1.3, whiteSpace: "pre-line" }}>{b.title}</div>
        </div>
      ))}
      <div style={{ position: "absolute", bottom: -8, left: 4, right: 4, height: 6, background: "rgba(0,0,0,0.3)", borderRadius: "50%", filter: "blur(5px)" }} />
    </div>
  );
}

// ── Field component ────────────────────────────────────────
function Field({ label, id, type = "text", value, onChange, placeholder, error, icon: Icon, rightSlot }) {
  return (
    <div className="mb-3.5">
      <label className="block mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider" style={{ color: "#334155", ...F }}>{label}</label>
      <div className="relative flex items-center">
        <Icon size={14} className="absolute left-3 pointer-events-none" style={{ color: "#334155" }} />
        <input
          id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
          autoComplete={type === "password" ? "new-password" : id}
          className={`w-full rounded-[9px] py-2.5 pl-9 pr-${rightSlot ? "9" : "3"} text-[13px] outline-none transition-all duration-150 ${error ? "border-red-500/40" : "border-white/8 focus:border-yellow-400/40"}`}
          style={{ background: "rgba(255,255,255,0.025)", border: `0.5px solid ${error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)"}`, color: "#EDE9E0", ...F }}
          onFocus={e => { if (!error) e.target.style.borderColor = "rgba(244,196,48,0.38)"; }}
          onBlur={e => { if (!error) e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />
        {rightSlot}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-[10px] mt-1" style={{ color: "#F87171", ...F }}>{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "", role: "user" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [status, setStatus]   = useState("idle"); // idle | loading | success

  const set = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: "" })); };
  const setRole = (r) => setForm(p => ({ ...p, role: r }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())                         e.fullName = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password || form.password.length < 6)   e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)        e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res  = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { setStatus("success"); setTimeout(() => router.push("/login"), 1600); }
      else { setErrors({ api: data.message || "Registration failed" }); setStatus("idle"); }
    } catch { setErrors({ api: "Something went wrong. Please try again." }); setStatus("idle"); }
  };

  const features = [
    { icon: "✦", label: "12,000+ original ebooks",      c: "#C9A227", bg: "rgba(244,196,48,0.1)" },
    { icon: "✒", label: "Writers earn from every sale", c: "#818CF8", bg: "rgba(129,140,248,0.1)" },
    { icon: "★", label: "Rated 4.9 by verified readers",c: "#10B981", bg: "rgba(16,185,129,0.1)"  },
  ];

  const eyeBtn = (show, toggle, id) => (
    <button type="button" onClick={toggle} aria-label={show ? "Hide password" : "Show password"}
      className="absolute right-2.5 transition-colors duration-150"
      style={{ color: "#334155", background: "none", border: "none" }}
      onMouseEnter={e => e.currentTarget.style.color = "#94A3B8"}
      onMouseLeave={e => e.currentTarget.style.color = "#334155"}>
      {show ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-5"
      style={{ background: "#07070E", position: "relative", overflow: "hidden" }}>

      {/* dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

      <style>{`@keyframes lp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.6)}} @media(max-width:700px){.reg-grid{grid-template-columns:1fr!important} .reg-left{display:none!important}}`}</style>

      <div className="reg-grid relative z-10 w-full max-w-[860px] overflow-hidden rounded-[20px]"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "0.5px solid rgba(244,196,48,0.12)" }}>

        {/* ── LEFT PANEL ── */}
        <div className="reg-left flex flex-col justify-between p-10 relative"
          style={{ background: "linear-gradient(145deg,#0E0D1F 0%,#12101E 60%,#0A0918 100%)", overflow: "hidden" }}>
          {/* glows */}
          <div style={{ position: "absolute", top: -60, left: -40, width: 260, height: 260, background: "radial-gradient(ellipse,rgba(244,196,48,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, right: -40, width: 200, height: 200, background: "radial-gradient(ellipse,rgba(129,140,248,0.06) 0%,transparent 65%)", pointerEvents: "none" }} />

          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 38 38" fill="none">
              <circle cx="19" cy="19" r="17" fill="rgba(244,196,48,0.1)" stroke="rgba(244,196,48,0.28)" strokeWidth=".8"/>
              <path d="M19 9L22 17L19 15L16 17Z" fill="#F4C430"/>
              <path d="M19 15L19 26" stroke="#F4C430" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="19" cy="9" r="2" fill="#F4C430"/>
              <path d="M13 11L9 9" stroke="rgba(244,196,48,0.45)" strokeWidth="1" strokeLinecap="round"/>
              <path d="M25 11L29 9" stroke="rgba(244,196,48,0.45)" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span style={{ ...FD, fontSize: 17, fontWeight: 700, color: "#F0EDE6", letterSpacing: ".02em" }}>Luminary</span>
          </div>

          {/* Art + Tagline */}
          <div className="flex flex-col items-center text-center">
            <BookStack />
            <h2 style={{ ...FD, fontSize: 20, fontWeight: 700, color: "#F0EDE6", lineHeight: 1.2, marginBottom: 10 }}>
              Read. Write.<br /><em style={{ fontStyle: "italic", fontWeight: 400, color: ACC }}>Illuminate.</em>
            </h2>
            <p className="text-[12px] leading-relaxed mb-5 max-w-[190px]" style={{ color: "#334155", ...F }}>
              Join 50,000 readers and writers building the future of independent publishing.
            </p>
            <div className="flex flex-col gap-2 w-full">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[11px]" style={{ color: "#334155", ...F }}>
                  <div className="flex-shrink-0 flex items-center justify-center rounded-[6px] w-5 h-5 text-[11px]"
                    style={{ background: f.bg, color: f.c }}>{f.icon}</div>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-[11px]" style={{ color: "#1E293B", ...F }}>
            Already have an account?{" "}
            <Link href="/login" className="transition-opacity hover:opacity-75" style={{ color: ACC }}>Sign in</Link>
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex flex-col justify-center p-9" style={{ background: "#0C0B1A" }}>
          <h1 style={{ ...FD, fontSize: 22, fontWeight: 700, color: "#EDE9E0", marginBottom: 4 }}>Create your account</h1>
          <p className="text-[12px] mb-6" style={{ color: "#334155", ...F }}>Free to join. Start reading or publishing today.</p>

          {errors.api && (
            <div className="mb-4 px-3 py-2 rounded-[9px] text-[12px]" style={{ background: "rgba(248,113,113,0.08)", border: "0.5px solid rgba(248,113,113,0.25)", color: "#F87171", ...F }}>
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Field label="Full name" id="fullName" value={form.fullName} onChange={set("fullName")} placeholder="Rafi Ahmed" error={errors.fullName} icon={User} />
            <Field label="Email address" id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" error={errors.email} icon={Mail} />
            <Field label="Password" id="password" type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Min. 6 characters" error={errors.password} icon={Lock}
              rightSlot={eyeBtn(showPw, () => setShowPw(p => !p), "password")} />
            <Field label="Confirm password" id="confirmPw" type={showCpw ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat password" error={errors.confirmPassword} icon={Lock}
              rightSlot={eyeBtn(showCpw, () => setShowCpw(p => !p), "confirmPw")} />

            {/* Role selector */}
            <p className="text-[10.5px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#334155", ...F }}>I want to join as</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { r: "user",   icon: "◎", label: "Reader",  hint: "Browse & collect", ic: ACC },
                { r: "writer", icon: "✒", label: "Writer",  hint: "Publish & earn",   ic: "#818CF8" },
              ].map(({ r, icon, label, hint, ic }) => {
                const active = form.role === r;
                return (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className="flex flex-col items-center gap-1 py-3 px-2 rounded-[10px] transition-all duration-200"
                    style={{ border: `0.5px solid ${active ? "rgba(244,196,48,0.35)" : "rgba(255,255,255,0.07)"}`, background: active ? "rgba(244,196,48,0.07)" : "rgba(255,255,255,0.02)" }}>
                    <span style={{ fontSize: 16, color: active ? ic : "#334155", transition: "color .2s" }}>{icon}</span>
                    <span className="text-[12px] font-semibold" style={{ color: active ? ACC : "#475569", ...F, transition: "color .2s" }}>{label}</span>
                    <span className="text-[10px]" style={{ color: "#1E293B", ...F }}>{hint}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={status !== "idle"}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[13px] font-bold transition-all duration-300"
              style={{ background: status === "success" ? "#10B981" : ACC, color: "#07070E", ...F, opacity: status === "loading" ? 0.7 : 1 }}>
              {status === "idle"    && <><span>Create account</span><ArrowRight size={14} strokeWidth={2.5} /></>}
              {status === "loading" && <><Loader2 size={14} className="animate-spin" /><span>Creating account…</span></>}
              {status === "success" && <><Check size={14} strokeWidth={2.5} /><span>Account created!</span></>}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2.5 my-4">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            <span className="text-[10px] tracking-wider" style={{ color: "#1E293B", ...F }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12.5px] font-medium transition-all duration-200"
            style={{ border: "0.5px solid rgba(255,255,255,0.08)", background: "transparent", color: "#475569", ...F }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#94A3B8"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#475569"; }}>
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.27 12A6.73 6.73 0 0 1 12 5.27c1.7 0 3.23.63 4.41 1.66l3.29-3.29A11.25 11.25 0 0 0 12 .75 11.27 11.27 0 0 0 1.1 7.55l4.17 3.24V12Z"/>
              <path fill="#34A853" d="M12 23.25c3.04 0 5.6-1 7.46-2.72l-3.65-2.83a6.73 6.73 0 0 1-9.37-3.53L2.28 17.4A11.27 11.27 0 0 0 12 23.25Z"/>
              <path fill="#FBBC05" d="M18.98 12c0-.73-.1-1.5-.26-2.25H12v4.27h3.92a3.84 3.84 0 0 1-1.55 2.43l3.65 2.83C19.78 17.45 20.98 15 18.98 12Z"/>
              <path fill="#4285F4" d="M6.44 14.17A6.67 6.67 0 0 1 5.27 12v-.42L1.1 8.55C.74 9.56.5 10.75.5 12s.24 2.44.6 3.45l4.2-3.08.14.08Z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-[11px] mt-3.5" style={{ color: "#1E293B", ...F }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium hover:opacity-80" style={{ color: ACC }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
