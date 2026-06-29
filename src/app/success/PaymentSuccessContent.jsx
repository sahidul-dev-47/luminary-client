"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, ArrowRight, BookOpen } from "lucide-react";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const success = searchParams.get("success");
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "Verifying your payment...",
  );

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;

    if (success === "true" && sessionId) {
      const verifyAndSavePayment = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/v1/payments/verify-status",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session_id: sessionId }),
            },
          );

          const data = await response.json();

          if (data.success) {
            setLoading(false);
            setStatusMessage(
              "Payment successful! Your library and profile have been updated.",
            );
          } else {
            setLoading(false);
            setStatusMessage(data.message || "Payment verification failed.");
          }
        } catch (error) {
          console.error("Verification Error:", error);
          setLoading(false);
          setStatusMessage("Something went wrong while updating database.");
        }
      };

      verifyAndSavePayment();
      effectRan.current = true;
    } else {
      setLoading(false);
      setStatusMessage("Invalid session or payment cancelled.");
    }
  }, [success, sessionId]);

  return (
    <div
      className="max-w-md w-full rounded-2xl p-8 text-center relative z-10"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
      }}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-4 py-6">
          <Loader2 size={44} className="animate-spin text-purple-500" />
          <p className="text-slate-400 text-sm font-medium">
            {statusMessage}
          </p>
        </div>
      ) : success === "true" ? (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-5 text-emerald-400">
            <CheckCircle2 size={32} />
          </div>

          <h1
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Thank You!
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            {statusMessage}
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Link
              href="/dashboard/user"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-black transition-all hover:opacity-90"
              style={{
                background: "#A855F7",
                boxShadow: "0 4px 20px rgba(168,85,247,0.25)",
              }}
            >
              Go to Dashboard <ArrowRight size={14} />
            </Link>

            <Link
              href="/ebooks"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-medium text-slate-400 transition-all hover:text-slate-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.08)",
              }}
            >
              <BookOpen size={14} /> Browse More Ebooks
            </Link>
          </div>
        </div>
      ) : (
        <div className="py-6">
          <p className="text-red-400 font-medium mb-4">{statusMessage}</p>
          <Link
            href="/ebooks"
            className="inline-text text-sm text-purple-400 hover:underline"
          >
            Back to Store
          </Link>
        </div>
      )}
    </div>
  );
}