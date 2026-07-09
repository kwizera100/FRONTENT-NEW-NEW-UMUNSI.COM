"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PostEditor } from "@/components/admin/PostEditor";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("umunsi_admin_token");
        const res = await fetch(`/api/posts/by-id/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to load article.");
        } else {
          setPost(data);
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={() => router.push("/admin/posts")}
          className="px-5 py-2 bg-ink-900 hover:bg-ink-800 text-white font-bold rounded-xl text-sm"
        >
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <PostEditor
      mode="edit"
      postId={id}
      initialPost={post}
      onSave={() => router.push("/admin/posts")}
    />
  );
}
