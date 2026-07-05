"use client";

import { useState, useEffect } from "react";
import { Users, Plus, X, Mail, Shield, Loader2, Trash2, Copy, CheckCircle2 } from "lucide-react";

interface User {
  id: string;
  name?: string;
  email: string;
  role?: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("AUTHOR");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("umunsi_admin_token");
      const res = await fetch("/api/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load users");
      } else {
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setCreating(true);
    setCreateError("");
    try {
      const token = localStorage.getItem("umunsi_admin_token");
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create user");
      } else {
        setCreatedUser(data);
        setUsers([...users, data]);
        setShowAdd(false);
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setNewRole("AUTHOR");
      }
    } catch {
      setCreateError("Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const copyCredentials = () => {
    if (!createdUser) return;
    const text = `Email: ${createdUser.email}\nPassword: ${newPassword || "(as set during creation)"}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            User Management
          </h2>
          <p className="text-ink-400 text-sm mt-1">
            {users.length} users — Manage authors and admins
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600 font-semibold">{error}</p>
          <p className="text-xs text-red-400 mt-1">
            Note: The backend may require admin privileges to list users.
          </p>
        </div>
      )}

      {/* Users list */}
      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
          <p className="text-sm text-ink-400 mt-3">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-ink-400 uppercase">Name</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-ink-400 uppercase">Email</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-ink-400 uppercase">Role</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-ink-400 uppercase">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-ink-50 hover:bg-ink-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-ink-800 text-sm">{user.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-600">{user.email}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        user.role?.toUpperCase() === "ADMIN"
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {user.role || "AUTHOR"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-400">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-ink-400 text-sm">
                    No users found. Add a new user to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Created user credentials popup */}
      {createdUser && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setCreatedUser(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-ink-900">User Created!</h3>
                <p className="text-sm text-ink-400">Share these credentials with the user</p>
              </div>
            </div>
            <div className="space-y-3 bg-ink-50 rounded-xl p-4">
              <div>
                <label className="text-xs font-bold text-ink-400 uppercase block mb-1">Name</label>
                <p className="text-sm text-ink-800 font-semibold">{createdUser.name || "—"}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-ink-400 uppercase block mb-1">Email</label>
                <p className="text-sm text-ink-800 font-semibold">{createdUser.email}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-ink-400 uppercase block mb-1">Password</label>
                <p className="text-sm text-ink-800 font-semibold">{newPassword || "Set during creation"}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-ink-400 uppercase block mb-1">Role</label>
                <p className="text-sm text-ink-800 font-semibold">{createdUser.role || newRole}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={copyCredentials}
                className="flex-1 py-2.5 bg-ink-900 hover:bg-ink-800 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Credentials"}
              </button>
              <button
                onClick={() => setCreatedUser(null)}
                className="px-5 py-2.5 bg-ink-100 hover:bg-ink-200 text-ink-700 font-bold rounded-xl text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add user modal */}
      {showAdd && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-ink-900">Add New User</h3>
              <button
                onClick={() => setShowAdd(false)}
                className="p-2 rounded-lg hover:bg-ink-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {createError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-semibold">
                  {createError}
                </div>
              )}

              <div>
                <label className="text-sm font-bold text-ink-700 mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-ink-700 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="user@umunsi.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-ink-700 mb-1.5 block">Password</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Set a password"
                  className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-ink-700 mb-1.5 block">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none font-semibold text-sm"
                >
                  <option value="AUTHOR">Author — Can write and edit articles</option>
                  <option value="ADMIN">Admin — Full access to everything</option>
                </select>
              </div>

              <button
                onClick={handleCreateUser}
                disabled={creating || !newEmail.trim() || !newPassword.trim()}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
