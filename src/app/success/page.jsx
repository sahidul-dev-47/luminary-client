"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PaymentSuccessContent from "./PaymentSuccessContent"; 

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-[#07070E] flex items-center justify-center px-4 relative overflow-hidden">
      
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 50%)`,
        }}
      />

    
      <Suspense 
        fallback={
          <div
            className="max-w-md w-full rounded-2xl p-8 text-center relative z-10"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 size={44} className="animate-spin text-purple-500" />
              <p className="text-slate-400 text-sm font-medium">Loading...</p>
            </div>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
}