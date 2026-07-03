"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@umunsi.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Demo auth
    setTimeout(() => {
      localStorage.setItem("umunsi_admin_auth", "true");
      router.push("/admin");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
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
          <h2 className="text-2xl font-black text-ink-900 mb-2">Injira</h2>
          <p className="text-ink-400 text-sm mb-6">
            Injiza amakuru yawe yo kwinjira mu admin dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-ink-700 mb-1.5 block">
                Emeyili
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

            <div>
              <label className="text-sm font-semibold text-ink-700 mb-1.5 block">
                Ijambo ry'ibanga
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-ink-100 focus:border-brand-500 outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? "Birimo..." : "Injira"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 p-4 bg-brand-50 rounded-xl text-sm text-brand-700">
            <p className="font-semibold mb-1">Demo credentials:</p>
            <p>Email: admin@umunsi.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
