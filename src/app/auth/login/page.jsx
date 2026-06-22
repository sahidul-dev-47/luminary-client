"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, Loader2 } from "lucide-react";

const F  = { fontFamily: "'Inter','system-ui',sans-serif" };
const FD = { fontFamily: "'Playfair Display',Georgia,serif" };
const ACC = "#F4C430";

// ── Left panel illustration ────────────────────────────────
function LeftIllustration() {
  const quotes = [
    { text: "A reader lives a thousand lives.", author: "George R.R. Martin" },
    { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
    { text: "So many books, so little time.",    author: "Frank Zappa" },
  ];
  const [q] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="flex flex-col justify-between p-10 relative"
      style={{ background: "linear-gradient(145deg,#0E0D1F 0%,#12101E 60%,#0A0918 100%)", overflow: "hidden", minHeight: "100%" }}>

      {/* ambient glows */}
      <div style={{ position:"absolute", top:-60, left:-40, width:260, height:260, background:"radial-gradient(ellipse,rgba(244,196,48,0.07) 0%,transparent 65%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-40, right:-40, width:200, height:200, background:"radial-gradient(ellipse,rgba(129,140,248,0.06) 0%,transparent 65%)", pointerEvents:"none" }} />

      {/* Logo */}
      <div className="flex items-center gap-2">
        <svg width="26" height="26" viewBox="0 0 38 38" fill="none">
          <circle cx="19" cy="19" r="17" fill="rgba(244,196,48,0.1)" stroke="rgba(244,196,48,0.28)" strokeWidth=".8"/>
          <path d="M19 9L22 17L19 15L16 17Z" fill="#F4C430"/>
          <path d="M19 15L19 26" stroke="#F4C430" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="19" cy="9" r="2" fill="#F4C430"/>
          <path d="M13 11L9 9"  stroke="rgba(244,196,48,0.45)" strokeWidth="1" strokeLinecap="round"/>
          <path d="M25 11L29 9" stroke="rgba(244,196,48,0.45)" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        <span style={{ ...FD, fontSize:17, fontWeight:700, color:"#F0EDE6", letterSpacing:".02em" }}>Luminary</span>
      </div>

      {/* Centre art */}
      <div className="flex flex-col items-center text-center">
        {/* Open book SVG */}
        <svg width="140" height="110" viewBox="0 0 140 110" fill="none" style={{ marginBottom:20 }}>
          {/* left page */}
          <path d="M10 12 Q10 8 14 8 L66 10 Q70 10 70 14 L70 96 Q70 100 66 100 L14 98 Q10 98 10 94 Z"
            fill="rgba(244,196,48,0.07)" stroke="rgba(244,196,48,0.18)" strokeWidth=".6"/>
          <path d="M14 8 L14 98" stroke="rgba(244,196,48,0.12)" strokeWidth=".5"/>
          {[22,32,42,52,62,72,82].map((y,i)=>(
            <line key={i} x1="20" y1={y} x2={50+Math.sin(i)*6} y2={y}
              stroke="rgba(244,196,48,0.18)" strokeWidth=".8" strokeLinecap="round"/>
          ))}
          {/* right page */}
          <path d="M130 12 Q130 8 126 8 L74 10 Q70 10 70 14 L70 96 Q70 100 74 100 L126 98 Q130 98 130 94 Z"
            fill="rgba(129,140,248,0.06)" stroke="rgba(129,140,248,0.15)" strokeWidth=".6"/>
          <path d="M126 8 L126 98" stroke="rgba(129,140,248,0.1)" strokeWidth=".5"/>
          {[22,32,42,52,62,72,82].map((y,i)=>(
            <line key={i} x1="120" y1={y} x2={90-Math.sin(i)*6} y2={y}
              stroke="rgba(129,140,248,0.15)" strokeWidth=".8" strokeLinecap="round"/>
          ))}
          {/* spine */}
          <path d="M70 10 Q70 14 70 96" stroke="rgba(244,196,48,0.25)" strokeWidth="1.5"/>
          {/* Luminary icon centre */}
          <g transform="translate(58,44)">
            <circle cx="12" cy="12" r="11" fill="rgba(244,196,48,0.08)" stroke="rgba(244,196,48,0.25)" strokeWidth=".6"/>
            <path d="M12 5L14 11L12 9.5L10 11Z" fill="#F4C430"/>
            <path d="M12 9.5L12 17" stroke="#F4C430" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="12" cy="5" r="1.4" fill="#F4C430"/>
          </g>
          {/* shadow */}
          <ellipse cx="70" cy="105" rx="46" ry="4" fill="rgba(0,0,0,0.3)"/>
        </svg>

        <h2 style={{ ...FD, fontSize:21, fontWeight:700, color:"#F0EDE6", lineHeight:1.2, marginBottom:10 }}>
          Welcome <em style={{ fontStyle:"italic", fontWeight:400, color:ACC }}>back</em>
        </h2>
        <p className="text-[12px] leading-relaxed mb-6 max-w-[190px]" style={{ color:"#334155", ...F }}>
          Your library is waiting. Pick up where you left off.
        </p>

        {/* Floating quote card */}
        <div className="w-full rounded-[12px] p-3.5 text-left"
          style={{ background:"rgba(255,255,255,0.02)", border:"0.5px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[11px] italic leading-relaxed mb-2" style={{ color:"#475569", ...F }}>"{q.text}"</p>
          <p className="text-[10px]" style={{ color:"#1E293B", ...F }}>— {q.author}</p>
        </div>

        {/* Stats mini row */}
        <div className="flex items-center gap-0 mt-5 w-full">
          {[{ n:"12K+", l:"Ebooks" },{ n:"50K", l:"Readers" },{ n:"4.9★", l:"Rating" }].map((s,i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex-1 text-center">
                <div style={{ ...FD, fontSize:16, fontWeight:700, color:ACC, lineHeight:1 }}>{s.n}</div>
                <div className="text-[10px] mt-0.5" style={{ color:"#1E293B", ...F }}>{s.l}</div>
              </div>
              {i < 2 && <div className="w-px h-6" style={{ background:"rgba(255,255,255,0.07)" }} />}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px]" style={{ color:"#1E293B", ...F }}>
        Don't have an account?{" "}
        <Link href="/auth/register" className="transition-opacity hover:opacity-75" style={{ color:ACC }}>
          Create one
        </Link>
      </p>
    </div>
  );
}

// ── Field component ────────────────────────────────────────
function Field({ label, id, type, value, onChange, placeholder, error, icon: Icon, rightSlot }) {
  return (
    <div className="mb-3.5">
      <label className="block mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider"
        style={{ color:"#334155", ...F }}>{label}</label>
      <div className="relative flex items-center">
        <Icon size={14} className="absolute left-3 pointer-events-none" style={{ color:"#334155" }} />
        <input
          id={id} type={type} value={value} onChange={onChange}
          placeholder={placeholder} autoComplete={id}
          className="w-full rounded-[9px] py-2.5 pl-9 text-[13px] outline-none transition-all duration-150"
          style={{
            paddingRight: rightSlot ? 36 : 12,
            background: "rgba(255,255,255,0.025)",
            border: `0.5px solid ${error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)"}`,
            color: "#EDE9E0", ...F,
          }}
          onFocus={e => { if (!error) e.target.style.borderColor = "rgba(244,196,48,0.38)"; }}
          onBlur={e  => { if (!error) e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />
        {rightSlot}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="text-[10px] mt-1" style={{ color:"#F87171", ...F }}>{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]     = useState({ email:"", password:"" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success

  const set = k => e => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]:"" })); };

  const validate = () => {
    const e = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setTimeout(() => router.push("/"), 1400);
      } else {
        setErrors({ api: data.message || "Invalid email or password" });
        setStatus("idle");
      }
    } catch {
      setErrors({ api: "Something went wrong. Please try again." });
      setStatus("idle");
    }
  };

  const handleGoogle = () => {
    // TODO: connect BetterAuth / NextAuth Google provider
    console.log("Google login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5"
      style={{ background:"#07070E", position:"relative", overflow:"hidden" }}>

      {/* dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage:"radial-gradient(rgba(255,255,255,0.045) 1px,transparent 1px)", backgroundSize:"24px 24px" }} />

      <style>{`
        @media(max-width:700px){ .login-grid{ grid-template-columns:1fr!important } .login-left{ display:none!important } }
      `}</style>

      <div className="login-grid relative z-10 w-full max-w-[860px] overflow-hidden rounded-[20px]"
        style={{ display:"grid", gridTemplateColumns:"1fr 1fr", border:"0.5px solid rgba(244,196,48,0.12)" }}>

        {/* LEFT */}
        <div className="login-left">
          <LeftIllustration />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-center p-9" style={{ background:"#0C0B1A" }}>

          <h1 style={{ ...FD, fontSize:22, fontWeight:700, color:"#EDE9E0", marginBottom:4 }}>Sign in</h1>
          <p className="text-[12px] mb-6" style={{ color:"#334155", ...F }}>
            Access your library and dashboard.
          </p>

          {/* API error */}
          <AnimatePresence>
            {errors.api && (
              <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="mb-4 px-3 py-2 rounded-[9px] text-[12px]"
                style={{ background:"rgba(248,113,113,0.08)", border:"0.5px solid rgba(248,113,113,0.25)", color:"#F87171", ...F }}>
                {errors.api}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate>

            <Field
              label="Email address" id="email" type="email"
              value={form.email} onChange={set("email")}
              placeholder="you@example.com" error={errors.email}
              icon={Mail}
            />

            <Field
              label="Password" id="password" type={showPw ? "text" : "password"}
              value={form.password} onChange={set("password")}
              placeholder="Your password" error={errors.password}
              icon={Lock}
              rightSlot={
                <button type="button" onClick={() => setShowPw(p => !p)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-2.5 transition-colors duration-150"
                  style={{ color:"#334155", background:"none", border:"none" }}
                  onMouseEnter={e => e.currentTarget.style.color="#94A3B8"}
                  onMouseLeave={e => e.currentTarget.style.color="#334155"}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            {/* Forgot password */}
            <div className="flex justify-end mb-5 -mt-1">
              <Link href="/forgot-password"
                className="text-[11px] transition-opacity hover:opacity-75"
                style={{ color:ACC, ...F }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
              type="submit" disabled={status !== "idle"}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[13px] font-bold transition-all duration-300"
              style={{
                background: status === "success" ? "#10B981" : ACC,
                color: "#07070E", ...F,
                opacity: status === "loading" ? 0.7 : 1,
              }}>
              {status === "idle"    && <><span>Sign in</span><ArrowRight size={14} strokeWidth={2.5} /></>}
              {status === "loading" && <><Loader2 size={14} className="animate-spin" /><span>Signing in…</span></>}
              {status === "success" && <><Check size={14} strokeWidth={2.5} /><span>Signed in!</span></>}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2.5 my-4">
            <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.06)" }} />
            <span className="text-[10px] tracking-wider" style={{ color:"#1E293B", ...F }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background:"rgba(255,255,255,0.06)" }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[12.5px] font-medium transition-all duration-200"
            style={{ border:"0.5px solid rgba(255,255,255,0.08)", background:"transparent", color:"#475569", ...F }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; e.currentTarget.style.color="#CBD5E1"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.color="#475569"; }}>
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.27 12A6.73 6.73 0 0 1 12 5.27c1.7 0 3.23.63 4.41 1.66l3.29-3.29A11.25 11.25 0 0 0 12 .75 11.27 11.27 0 0 0 1.1 7.55l4.17 3.24V12Z"/>
              <path fill="#34A853" d="M12 23.25c3.04 0 5.6-1 7.46-2.72l-3.65-2.83a6.73 6.73 0 0 1-9.37-3.53L2.28 17.4A11.27 11.27 0 0 0 12 23.25Z"/>
              <path fill="#FBBC05" d="M18.98 12c0-.73-.1-1.5-.26-2.25H12v4.27h3.92a3.84 3.84 0 0 1-1.55 2.43l3.65 2.83C19.78 17.45 20.98 15 18.98 12Z"/>
              <path fill="#4285F4" d="M6.44 14.17A6.67 6.67 0 0 1 5.27 12v-.42L1.1 8.55C.74 9.56.5 10.75.5 12s.24 2.44.6 3.45l4.2-3.08.14.08Z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-[11px] mt-4" style={{ color:"#1E293B", ...F }}>
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-medium hover:opacity-80" style={{ color:ACC }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
