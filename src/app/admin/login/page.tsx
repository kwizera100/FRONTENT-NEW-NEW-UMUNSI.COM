"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@umunsi.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("umunsi_admin_token", data.token || "");
      localStorage.setItem("umunsi_admin_user", JSON.stringify(data.user || {}));
      localStorage.setItem("umunsi_admin_auth", "true");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-2xl font-black text-ink-900 mb-2">Login</h2>
          <p className="text-ink-400 text-sm mb-6">
            Enter your credentials to access the admin dashboard.
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

            <div>
              <label className="text-sm font-semibold text-ink-700 mb-1.5 block">
                Password
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
              {loading ? "Loading..." : "Login"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
