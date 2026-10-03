"use client";

import { useEffect, useRef, useState } from "react";
import { X, Smartphone, Loader2, CheckCircle, AlertCircle, Heart } from "lucide-react";

interface TipModalProps {
  postId: string;
  onClose: () => void;
}

const DEFAULT_TIP_PRICE = 2000;

export function TipModal({ postId, onClose }: TipModalProps) {
  const [price, setPrice] = useState(DEFAULT_TIP_PRICE);
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"form" | "paying" | "pending" | "success">("form");
  const [error, setError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/tips/config")
      .then((r) => r.json())
      .then((d) => {
        const p = Number(d?.tipConfig?.price);
        if (p > 0) setPrice(p);
      })
      .catch(() => {});
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startPayment = async () => {
    if (!phone.trim()) {
      setError("Shyiramo numero ya MTN MoMo");
      return;
    }
    setError("");
    setStep("paying");
    try {
      const res = await fetch("/api/tips/mtn/requesttopay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, msisdn: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Kwishyura ntibikunze. Gerageza nanone.");
        setStep("form");
        return;
      }
      setStep("pending");
      pollRef.current = setInterval(async () => {
        try {
          const sr = await fetch(`/api/tips/mtn/status/${data.referenceId}`);
          const sd = await sr.json();
          if (sd.status === "SUCCESS") {
            if (pollRef.current) clearInterval(pollRef.current);
            setStep("success");
          } else if (sd.status === "FAILED") {
            if (pollRef.current) clearInterval(pollRef.current);
            const reason =
              sd.reason === "PAYEE_NOT_FOUND" || sd.reason === "PAYER_NOT_FOUND"
                ? "Numero ya MTN ntibashije kuboneka"
                : sd.reason === "NOT_ENOUGH_FUNDS"
                  ? "Nta mafrwanda ahagije kuri konti yawe"
                  : "Kwishyura ntibyagenze neza. Gerageza nanone.";
            setError(reason);
            setStep("form");
          }
        } catch {}
      }, 3000);
    } catch {
      setError("Habayemo ikibazo. Gerageza nanone.");
      setStep("form");
    }
  };

  const cancelPending = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStep("form");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#e5b60d] to-amber-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Heart className="w-5 h-5" />
            <h3 className="font-black text-lg">Dutere Inkunga</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === "form" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Shyigikira uyu mwanditsi ukoresheje MTN Mobile Money. Amafaranga ajya kuri konti y'umwanditsi.
              </p>
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <Smartphone className="w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Numero ya MTN (078XXXXXXX)"
                  className="flex-1 bg-transparent outline-none text-sm"
                  autoFocus
                />
              </div>
              <button
                onClick={startPayment}
                className="w-full bg-[#e5b60d] hover:bg-[#c9a00c] text-white font-black py-3 px-6 rounded-xl transition-colors"
              >
                Ishyura {price.toLocaleString()} RWF — Dutere Inkunga
              </button>
            </div>
          )}

          {(step === "paying" || step === "pending") && (
            <div className="text-center py-6">
              <Loader2 className="w-10 h-10 animate-spin text-[#e5b60d] mx-auto mb-4" />
              <p className="font-bold text-gray-900 mb-1">
                {step === "paying" ? "Kohereza ubwishyu..." : "Emeza kwishyura kuri telefoni yawe"}
              </p>
              {step === "pending" && (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Ugiye kubona ubutumwa bwa MTN — andika PIN yawe wemeze.
                  </p>
                  <button onClick={cancelPending} className="text-sm text-gray-500 underline">
                    Hagarika
                  </button>
                </>
              )}
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-6">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <p className="font-black text-gray-900 text-lg mb-2">Murakoze cyane!</p>
              <p className="text-sm text-gray-600 mb-6">
                Inkunga yawe yoherejwe ku mwanditsi w'iyi nkuru.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm"
              >
                Funga
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
