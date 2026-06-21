"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserCheck, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // "user" or "writer"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    // TODO: Call your backend API here
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! Please login.");
        window.location.href = "/login"; // or use router
      } else {
        alert(data.message || "Registration failed");
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
              <span className="text-6xl">📖</span>
            </div>
            <h2 className="text-4xl font-serif font-bold text-white mb-4">
              Join Luminary
            </h2>
            <p className="text-[#94A3B8] max-w-xs">
              Discover, read, and share extraordinary stories with fellow book lovers.
            </p>
          </div>

          <div className="absolute bottom-10 text-center text-xs text-[#F4C430]/60">
            Already have an account?{" "}
            <Link href="/login" className="hover:text-[#F4C430] underline">
              Sign in
            </Link>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-[#94A3B8]">Join our community of readers and writers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-[#94A3B8]" size={18} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[#1A1A2E] border border-[#F4C430]/20 rounded-2xl py-3 pl-11 pr-4 text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#F4C430]"
                  placeholder="Rafi Ahmed"
                />
              </div>
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-[#94A3B8]" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#1A1A2E] border border-[#F4C430]/20 rounded-2xl py-3 pl-11 pr-12 text-white focus:outline-none focus:border-[#F4C430]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-[#94A3B8] hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-3">I want to join as</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("user")}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                    formData.role === "user"
                      ? "border-[#F4C430] bg-[#F4C430]/10"
                      : "border-[#334155] hover:border-[#475569]"
                  }`}
                >
                  <UserCheck size={28} className={formData.role === "user" ? "text-[#F4C430]" : "text-[#64748B]"} />
                  <span className="font-medium">Reader</span>
                  <span className="text-xs text-[#64748B]">Browse & Read</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect("writer")}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                    formData.role === "writer"
                      ? "border-[#F4C430] bg-[#F4C430]/10"
                      : "border-[#334155] hover:border-[#475569]"
                  }`}
                >
                  <UserCheck size={28} className={formData.role === "writer" ? "text-[#F4C430]" : "text-[#64748B]"} />
                  <span className="font-medium">Writer</span>
                  <span className="text-xs text-[#64748B]">Publish Stories</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#F4C430] hover:bg-[#E5B02F] text-[#0D0D1A] font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </motion.button>
          </form>

          <p className="text-center text-sm text-[#64748B] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#F4C430] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}