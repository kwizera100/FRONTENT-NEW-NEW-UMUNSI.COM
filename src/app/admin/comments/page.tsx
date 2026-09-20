"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Trash2, CheckCircle, Send, Loader2, Mail, Phone, User } from "lucide-react";

interface Comment {
  id: string;
  postId: string;
  newsId: string | null;
  name: string;
  email: string;
  phone: string;
  content: string;
  isApproved: boolean;
  isSpam: boolean;
  createdAt: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("umunsi_admin_token") : "";

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/comments/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (data?.comments) setComments(data.comments);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const approveComment = async (id: string) => {
    setActionLoading(id);
    try {
      await fetch(`/api/comments/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((c) => c.map((x) => (x.id === id ? { ...x, isApproved: true, isSpam: false } : x)));
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  const deleteComment = async (id: string) => {
    if (!confirm("This will permanently delete the comment. Continue?")) return;
    setActionLoading(id);
    try {
      await fetch(`/api/comments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((c) => c.filter((x) => x.id !== id));
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  const submitReply = async (id: string) => {
    if (!replyText.trim()) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/comments/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reply: replyText }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setMessage("Reply sent to user's email!");
        setReplyingTo(null);
        setReplyText("");
        setComments((c) => c.map((x) => (x.id === id ? { ...x, isApproved: true } : x)));
        setTimeout(() => setMessage(""), 4000);
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const pending = comments.filter((c) => !c.isApproved && !c.isSpam);
  const approved = comments.filter((c) => c.isApproved);
  const spam = comments.filter((c) => c.isSpam);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1.5 h-8 rounded-full bg-[#e5b60d]" />
        <h1 className="text-2xl lg:text-3xl font-black text-gray-900 font-display flex items-center gap-2">
          <MessageCircle className="w-7 h-7 text-[#e5b60d]" />
          Reader Comments
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-black text-yellow-600">{pending.length}</p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-black text-green-600">{approved.length}</p>
          <p className="text-xs text-gray-500 mt-1">Approved</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-black text-red-600">{spam.length}</p>
          <p className="text-xs text-gray-500 mt-1">Spam</p>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-semibold">
          {message}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#e5b60d] mx-auto" />
          <p className="text-gray-400 mt-3">Loading...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No comments found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className={`bg-white rounded-xl border p-4 lg:p-5 shadow-sm ${c.isSpam ? "border-red-200" : c.isApproved ? "border-green-200" : "border-yellow-200"}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e5b60d] to-[#c9a00c] flex items-center justify-center text-white font-bold shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {c.email}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3 h-3" />
                      {c.phone}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.isSpam ? "bg-red-100 text-red-700" : c.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {c.isSpam ? "Spam" : c.isApproved ? "Approved" : "Pending"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-gray-700 text-sm leading-relaxed">{c.content}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!c.isApproved && !c.isSpam && (
                  <button
                    onClick={() => approveComment(c.id)}
                    disabled={actionLoading === c.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-xs transition-colors disabled:opacity-50"
                  >
                    {actionLoading === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    Approve
                  </button>
                )}
                <button
                  onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
                <button
                  onClick={() => deleteComment(c.id)}
                  disabled={actionLoading === c.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  {actionLoading === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Delete
                </button>
              </div>

              {/* Reply box */}
              {replyingTo === c.id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    placeholder="Write your reply... It will be sent to the user's email immediately."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#e5b60d] focus:ring-2 focus:ring-[#e5b60d]/20 outline-none text-sm resize-none mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => submitReply(c.id)}
                      disabled={actionLoading === c.id || !replyText.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e5b60d] hover:bg-[#c9a00c] text-white font-bold text-xs transition-colors disabled:opacity-50"
                    >
                      {actionLoading === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Send reply
                    </button>
                    <button
                      onClick={() => { setReplyingTo(null); setReplyText(""); }}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
