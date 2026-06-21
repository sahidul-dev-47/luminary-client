"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        window.location.href = "/";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 bg-[#131322] rounded-3xl overflow-hidden border border-[#F4C430]/10 shadow-2xl">
        
        {/* Left Side - Illustration */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1E] p-10 relative">
          <div className="text-center">
            <div className="mb-8">
              <span className="text-6xl">🔑</span>
            </div>
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Welcome Back
            </h2>
            <p className="text-[#94A3B8] max-w-xs">
              Continue your journey through thousands of amazing stories.
            </p>
          </div>

          <div className="absolute bottom-10 text-center text-xs text-[#F4C430]/60">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="hover:text-[#F4C430] underline">
              Create one
            </Link>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
            <p className="text-[#94A3B8]">Login to access your library and dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-[#94A3B8]" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#1A1A2E] border border-[#F4C430]/20 rounded-2xl py-3 pl-11 pr-4 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#F4C430]"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-[#94A3B8]" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#1A1A2E] border border-[#F4C430]/20 rounded-2xl py-3 pl-11 pr-12 text-white focus:outline-none focus:border-[#F4C430]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-[#94A3B8] hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-[#F4C430] hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#F4C430] hover:bg-[#E5B02F] text-[#0D0D1A] font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </motion.button>
          </form>

          {/* Google Login Button with Logo */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => alert("Google Login - Connect with BetterAuth / NextAuth")}
              className="w-full border border-[#334155] hover:border-[#475569] hover:bg-white/5 text-white py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.25 1.22-1 2.25-2.12 2.95v2.78h3.44c2.01-1.85 3.17-4.58 3.17-7.99z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.44-2.78c-.95.64-2.17 1.02-3.84 1.02-2.95 0-5.47-1.99-6.37-4.68H1.6v2.95C3.4 20.74 7.4 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.63 14.43c-.36-1.07-.57-2.2-.57-3.43s.21-2.36.57-3.43V4.6H1.6C.58 6.6 0 9.2 0 12s.58 5.4 1.6 7.4l3.03-2.37z"/>
                  <path fill="#EA4335" d="M12 4.8c1.66 0 3.15.57 4.32 1.69l3.23-3.23C17.46 1.54 14.97 0 12 0 7.4 0 3.4 2.26 1.6 5.6l3.03 2.37C6.53 4.79 9.05 4.8 12 4.8z"/>
                </svg>
              </div>
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-[#64748B] mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[#F4C430] hover:underline font-medium">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}