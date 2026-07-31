"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Could not send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center text-white font-black text-2xl">
              U
            </div>
            <div>
              <span className="text-2xl font-black text-white">Umunsi</span>
              <span className="text-brand-500 text-2xl font-black">.com</span>
            </div>
          </div>
          <p className="text-white/50 text-sm">Admin Dashboard</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-ink-900">Email yoherejwe</h2>
              <p className="text-ink-500 text-sm">
                Twebere kanda kuri link yatanzwe mu email wagenewe. Link izarangira vuba.
              </p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-brand-600 font-bold text-sm hover:text-brand-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Subira ku login
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1 text-sm font-semibold text-ink-500 hover:text-brand-600 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Subira ku login
              </Link>
              <h2 className="text-2xl font-black text-ink-900 mb-2">Hindura ijambo ry&apos;ibanga</h2>
              <p className="text-ink-400 text-sm mb-6">
                Andika email yawe maze uhawe ubutumwa bwo guhindura password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-semibold">
                    {error}
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-ink-700 mb-1.5 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-ink-100 focus:border-brand-500 outline-none transition-colors"
                      placeholder="admin@umunsi.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {loading ? "Birimo..." : "Ohereza email"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
