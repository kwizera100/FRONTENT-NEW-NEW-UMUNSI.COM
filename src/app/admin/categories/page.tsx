"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Eye, GripVertical, Loader2 } from "lucide-react";
import type { ApiCategory } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNameEn, setNewNameEn] = useState("");
  const [newColor, setNewColor] = useState("#f43f5e");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCats(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink-900">Ibyiciro</h2>
          <p className="text-ink-400 text-sm mt-1">
            {cats.length} ibyiciro byose
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ongera icyiciro
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto" />
          <p className="text-sm text-ink-400 mt-3">Birimo gukuramo ibyiciro...</p>
        </div>
      )}

      {/* Categories grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-ink-100 p-5 group hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md"
                  style={{ backgroundColor: cat.color || "#e5b60d" }}
                >
                  {cat.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg hover:bg-ink-100 text-ink-500">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-50 text-ink-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-ink-900">{cat.name}</h3>
              <p className="text-sm text-ink-600 mb-4 line-clamp-2">
                {cat.description || ""}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-ink-50">
                <span className="text-sm font-bold text-ink-700">
                  {cat._count?.posts || cat._count?.articles || cat._count?.news || 0} inkuru
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: cat.color || "#e5b60d" }}
                  />
                  <span className="text-xs text-ink-400 font-mono">
                    {cat.color || "#e5b60d"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add category modal */}
      {showAdd && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black text-ink-900 mb-5">
              Ongera icyiciro gishya
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-bold text-ink-700 mb-1.5 block">
                    Izina (Kinyarwanda)
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Urugero: Imikino"
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-ink-700 mb-1.5 block">
                    Izina (English)
                  </label>
                  <input
                    type="text"
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                    placeholder="Urugero: Sports"
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-ink-700 mb-1.5 block">
                  Ibirango (Description)
                </label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Andika ibirango by'iki cyiciro..."
                  className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-ink-700 mb-1.5 block">
                  Ibara
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-14 h-12 rounded-xl border border-ink-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 focus:border-brand-500 outline-none font-mono"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  alert("Icyiciro cyongerewe (demo mode)");
                  setShowAdd(false);
                  setNewName("");
                  setNewNameEn("");
                  setNewDesc("");
                }}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Ongera icyiciro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
