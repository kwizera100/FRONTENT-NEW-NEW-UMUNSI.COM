"use client";

import { useState, useEffect, useRef } from "react";
import { Crown, Lock, CheckCircle, Loader2, AlertCircle, Smartphone, UserPlus } from "lucide-react";

interface ArticlePaywallProps {
  postId: string;
  postTitle: string;
  articlePayment?: string | null;
  adConfig?: string | null;
  isPremium?: boolean;
  isLocked?: boolean;
  postSlug?: string;
}

const DEFAULT_PRICE = 500;

export function ArticlePaywall({ postId, postTitle, articlePayment, isPremium, isLocked, postSlug }: ArticlePaywallProps) {
  const [locked, setLocked] = useState(false);
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"locked" | "paying" | "pending" | "signup">("locked");
  const [error, setError] = useState("");
  const [signupUrl, setSignupUrl] = useState("https://writer.umunsi.com/signup");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const articleUrl = () => `/article/${postSlug || postId}`;

  const unlockArticle = (ref: string) => {
    // Reload the page server-side with accessRef → renders the ORIGINAL article (ArticleContent styling, image, comments)
    window.location.href = `${articleUrl()}?accessRef=${encodeURIComponent(ref)}`;
  };

  useEffect(() => {
    // If the backend already unlocked this post (accessRef in URL worked), don't show paywall
    if (isLocked === false) return;

    let requires = Boolean(isPremium);
    let p = DEFAULT_PRICE;
    try {
      if (articlePayment) {
        const ap = JSON.parse(articlePayment);
        if (ap?.requirePayment) requires = true;
        if (ap?.price && Number(ap.price) > 0) p = Number(ap.price);
      }
    } catch {}
    if (!requires) return;

    fetch("/api/payment/config")
      .then((r) => r.json())
      .then((d) => { if (d?.umunsiMediaSignupUrl) setSignupUrl(d.umunsiMediaSignupUrl); })
      .catch(() => {});

    // Returning reader — verify stored ref, then unlock by reloading with accessRef
    const ref = localStorage.getItem(`umunsi_article_access_${postId}`);
    if (ref) {
      fetch(`/api/payment/mtn/access/${postId}?ref=${encodeURIComponent(ref)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.hasAccess) {
            unlockArticle(ref);
          } else {
            localStorage.removeItem(`umunsi_article_access_${postId}`);
            setLocked(true);
            setPrice(p);
          }
        })
        .catch(() => { setLocked(true); setPrice(p); });
    } else {
      setLocked(true);
      setPrice(p);
    }

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [postId, articlePayment, isPremium, isLocked]);

  const startPayment = async () => {
    if (!phone.trim()) { setError("Shyiramo numero ya MTN"); return; }
    setError("");
    setStep("paying");
    try {
      const res = await fetch("/api/payment/mtn/requesttopay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, msisdn: phone.trim(), amount: price }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Kwishyura ntibikunze. Gerageza nanone.");
        setStep("locked");
        return;
      }
      setStep("pending");
      // Poll status every 3s
      pollRef.current = setInterval(async () => {
        try {
          const sr = await fetch(`/api/payment/mtn/status/${data.referenceId}`);
          const sd = await sr.json();
          if (sd.status === "SUCCESS") {
            if (pollRef.current) clearInterval(pollRef.current);
            localStorage.setItem(`umunsi_article_access_${postId}`, data.referenceId);
            setStep("signup");
          } else if (sd.status === "FAILED") {
            if (pollRef.current) clearInterval(pollRef.current);
            const reason = sd.reason === "PAYEE_NOT_FOUND" || sd.reason === "PAYER_NOT_FOUND"
              ? "Numero ya MTN ntibashije kuboneka — shyiramo numero yawe ya MoMo ukoresheje"
              : sd.reason === "NOT_ENOUGH_FUNDS" ? "Nta mafrwanda ahagije kuri konti yawe" : "Kwishyura ntibyagenze neza. Gerageza nanone.";
            setError(reason);
            setStep("locked");
          }
        } catch {}
      }, 3000);
    } catch {
      setError("Habayemo ikibazo. Gerageza nanone.");
      setStep("locked");
    }
  };

  const cancelPending = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStep("locked");
  };

  if (!locked) return null;

  return (
    <div className="my-8 rounded-2xl border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
          <Crown className="w-6 h-6 text-gray-900" />
        </div>
        <div>
          <h3 className="font-black text-gray-900 text-lg">INKURU YA PREMIUM</h3>
          <p className="text-sm text-gray-600">Iyi nkuru isaba kwishyura kugirango uyisome</p>
        </div>
      </div>

      {step === "locked" && (
        <div>
          <p className="text-gray-700 mb-4">
            Soma inkuru yuzuye — ishyura <strong>{price} RWF</strong> ukoresheje MTN Mobile Money.
          </p>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm mb-3">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Numero ya MTN (078XXXXXXX)"
                className="flex-1 outline-none text-sm"
              />
            </div>
            <button
              onClick={startPayment}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Ishyura {price} RWF — Soma Inkuru
            </button>
          </div>
        </div>
      )}

      {step === "paying" && (
        <div className="flex items-center justify-center gap-3 py-4 text-gray-700">
          <Loader2 className="w-5 h-5 animate-spin" /> Kohereza ubwishyu...
        </div>
      )}

      {step === "pending" && (
        <div className="text-center py-4">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mx-auto mb-3" />
          <p className="font-bold text-gray-900 mb-1">Emeza kwishyura kuri telefoni yawe</p>
          <p className="text-sm text-gray-600 mb-4">Ugiye kubona ubutumwa bwa MTN — andika PIN yawe wemeze.</p>
          <button onClick={cancelPending} className="text-sm text-gray-500 underline">Hagarika</button>
        </div>
      )}

      {step === "signup" && (
        <div className="text-center py-4">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="font-black text-gray-900 text-lg mb-2">Ubwishyu bwakunze!</p>
          <p className="text-sm text-gray-600 mb-4">
            Fungura konti yawe ku <strong>writer.umunsi.com</strong> — uzajya usoma inkuru za premium ukoresheje konti yawe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Fungura Konti — writer.umunsi.com
            </a>
            <button
              onClick={() => unlockArticle(localStorage.getItem(`umunsi_article_access_${postId}`) || "")}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Soma Inkuru Ubu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
