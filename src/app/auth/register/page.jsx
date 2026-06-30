"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { signUp, signIn, authClient } from "@/lib/auth-client";

const F = { fontFamily: "'Inter','system-ui',sans-serif" };
const FD = { fontFamily: "'Playfair Display',Georgia,serif" };
const ACC = "#F4C430";

// ── BookStack Component ──────────────────────────────────
function BookStack() {
  const books = [
    {
      title: "Glass\nMeridian",
      bg: "rgba(129,140,248,0.1)",
      border: "rgba(129,140,248,0.2)",
      spine: "rgba(129,140,248,0.22)",
      c: "rgba(129,140,248,0.5)",
      rot: "rotate(6deg)",
      l: 30,
      t: 20,
    },
    {
      title: "Echoes\nof Silence",
      bg: "rgba(212,83,126,0.1)",
      border: "rgba(212,83,126,0.2)",
      spine: "rgba(212,83,126,0.2)",
      c: "rgba(212,83,126,0.5)",
      rot: "rotate(-3deg)",
      l: 14,
      t: 12,
    },
    {
      title: "The Silent\nArchive",
      bg: "rgba(244,196,48,0.1)",
      border: "rgba(244,196,48,0.22)",
      spine: "rgba(244,196,48,0.2)",
      c: "rgba(244,196,48,0.55)",
      rot: "rotate(0deg)",
      l: 0,
      t: 0,
      front: true,
    },
  ];
  return (
    <div
      style={{
        position: "relative",
        width: 120,
        height: 140,
        margin: "0 auto 20px",
      }}
    >
      {books.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 82,
            height: 118,
            left: b.l,
            top: b.t,
            transform: b.rot,
            background: b.bg,
            border: `0.5px solid ${b.border}`,
            borderRadius: "3px 8px 8px 3px",
            zIndex: i + 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 7,
              background: b.spine,
              borderRadius: "1px 0 0 1px",
            }}
          />
          {b.front && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 38 38" fill="none">
                <circle
                  cx="19"
                  cy="19"
                  r="17"
                  fill="rgba(244,196,48,0.08)"
                  stroke="rgba(244,196,48,0.25)"
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
              </svg>
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 14,
              right: 6,
              ...FD,
              fontSize: 9,
              color: b.c,
              lineHeight: 1.3,
              whiteSpace: "pre-line",
            }}
          >
            {b.title}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Field Component ────────────────────────────────────────
function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  rightSlot,
}) {
  return (
    <div className="mb-3.5">
      <label
        className="block mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider"
        style={{ color: "#334155", ...F }}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon
          size={14}
          className="absolute left-3 pointer-events-none"
          style={{ color: "#334155" }}
        />
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={type === "password" ? "new-password" : id}
          className={`w-full rounded-[9px] py-2.5 pl-9 pr-${rightSlot ? "9" : "3"} text-[13px] outline-none transition-all duration-150`}
          style={{
            background: "rgba(255,255,255,0.025)",
            border: `0.5px solid ${error ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)"}`,
            color: "#EDE9E0",
            ...F,
          }}
        />
        {rightSlot}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[10px] mt-1"
            style={{ color: "#F87171", ...F }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Register Page ──────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Reader",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!session?.user) return;

      const res = await fetch("/api/auth/check-role");
      const data = await res.json();

      // Modal only for Google users
      if (!data.role) {
        setShowRoleModal(true);
      }
    };

    checkRole();
  }, [session]);

  const setField = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrors((p) => ({ ...p, [k]: "" }));
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const { error } = await signUp.email({
        name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (error) {
        setApiError(error.message || "Signup failed");
        return;
      }

      setShowRoleModal(true);
    } catch (err) {
      setApiError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setApiError("");
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/auth/register",
      });
    } catch (err) {
      setApiError("Google sign up failed. Please try again.");
    }
  };

  const handleRoleSelect = async (selectedRole) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/update-role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (res.ok) {
        setShowRoleModal(false);
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1200);
      } else {
        setApiError("Failed to save role");
      }
    } catch (err) {
      setApiError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const eyeBtn = (show, toggle) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-2.5 text-[#334155] hover:text-[#94A3B8]"
    >
      {show ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5"
      style={{
        background: "#07070E",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.045) 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div
        className="reg-grid relative z-10 w-full max-w-[860px] overflow-hidden rounded-[20px]"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          border: "0.5px solid rgba(244,196,48,0.12)",
        }}
      >
        {/* Left Panel */}
        <div
          className="reg-left flex flex-col justify-between p-10 relative"
          style={{
            background:
              "linear-gradient(145deg,#0E0D1F 0%,#12101E 60%,#0A0918 100%)",
          }}
        >
          <div className="flex items-center gap-2">
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
            </svg>
            <span
              style={{ ...FD, fontSize: 17, fontWeight: 700, color: "#F0EDE6" }}
            >
              Luminary
            </span>
          </div>

          <div className="flex flex-col items-center text-center">
            <BookStack />
            <h2
              style={{ ...FD, fontSize: 20, fontWeight: 700, color: "#F0EDE6" }}
            >
              Read. Write.
              <br />
              <em style={{ fontStyle: "italic", color: ACC }}>Illuminate.</em>
            </h2>
          </div>

          <p
            className="text-center text-[11px]"
            style={{ color: "#1E293B", ...F }}
          >
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: ACC }}>
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Panel */}
        <div
          className="flex flex-col justify-center p-9"
          style={{ background: "#0C0B1A" }}
        >
          <h1
            style={{ ...FD, fontSize: 22, fontWeight: 700, color: "#EDE9E0" }}
          >
            Create your account
          </h1>
          <p className="text-[12px] mb-6" style={{ color: "#334155", ...F }}>
            Free to join. Start reading or publishing today.
          </p>

          {apiError && (
            <div className="mb-4 p-3 rounded-[9px] text-red-400 bg-red-500/10 border border-red-500/30 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleEmailSubmit} noValidate>
            <Field
              label="Full name"
              id="fullName"
              value={form.fullName}
              onChange={setField("fullName")}
              placeholder="Rafi Ahmed"
              error={errors.fullName}
              icon={User}
            />
            <Field
              label="Email address"
              id="email"
              type="email"
              value={form.email}
              onChange={setField("email")}
              placeholder="you@example.com"
              error={errors.email}
              icon={Mail}
            />

            <Field
              label="Password"
              id="password"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={setField("password")}
              placeholder="Min. 6 characters"
              error={errors.password}
              icon={Lock}
              rightSlot={eyeBtn(showPw, () => setShowPw((p) => !p))}
            />

            <Field
              label="Confirm password"
              id="confirmPassword"
              type={showCpw ? "text" : "password"}
              value={form.confirmPassword}
              onChange={setField("confirmPassword")}
              placeholder="Repeat password"
              error={errors.confirmPassword}
              icon={Lock}
              rightSlot={eyeBtn(showCpw, () => setShowCpw((p) => !p))}
            />

            <motion.button
              type="submit"
              disabled={isLoading || success}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-[10px] font-bold text-[13.5px] transition-all"
              style={{ background: ACC, color: "#07070E" }}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto" size={18} />
              ) : (
                "Create account"
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-2.5 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] tracking-wider text-[#1E293B]">
              or continue with
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[10px] border border-white/10 hover:border-white/30 transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.27 12A6.73 6.73 0 0 1 12 5.27c1.7 0 3.23.63 4.41 1.66l3.29-3.29A11.25 11.25 0 0 0 12 .75 11.27 11.27 0 0 0 1.1 7.55l4.17 3.24V12Z"
              />
              <path
                fill="#34A853"
                d="M12 23.25c3.04 0 5.6-1 7.46-2.72l-3.65-2.83a6.73 6.73 0 0 1-9.37-3.53L2.28 17.4A11.27 11.27 0 0 0 12 23.25Z"
              />
              <path
                fill="#FBBC05"
                d="M18.98 12c0-.73-.1-1.5-.26-2.25H12v4.27h3.92a3.84 3.84 0 0 1-1.55 2.43l3.65 2.83C19.78 17.45 20.98 15 18.98 12Z"
              />
              <path
                fill="#4285F4"
                d="M6.44 14.17A6.67 6.67 0 0 1 5.27 12v-.42L1.1 8.55C.74 9.56.5 10.75.5 12s.24 2.44.6 3.45l4.2-3.08.14.08Z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>

      {/* Role Selection Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0C0B1A] rounded-3xl p-8 max-w-sm w-full border border-[#F4C430]/30"
            >
              <h2 className="text-2xl font-bold text-center mb-2">
                Choose your role
              </h2>
              <p className="text-center text-[#94A3B8] mb-8">
                This defines your experience on Luminary
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect("Reader")}
                  className="w-full p-6 rounded-2xl border hover:border-[#F4C430] text-left transition-all"
                >
                  <div className="text-4xl mb-3">📖</div>
                  <h3 className="text-xl font-semibold">Reader</h3>
                  <p className="text-sm text-gray-400">
                    Browse, read and collect books
                  </p>
                </button>

                <button
                  onClick={() => handleRoleSelect("Writer")}
                  className="w-full p-6 rounded-2xl border hover:border-[#F4C430] text-left transition-all"
                >
                  <div className="text-4xl mb-3">✍️</div>
                  <h3 className="text-xl font-semibold">Writer</h3>
                  <p className="text-sm text-gray-400">
                    Publish books and earn money
                  </p>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
