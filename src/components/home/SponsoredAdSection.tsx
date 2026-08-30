"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Settings {
  sponsoredBannerImage?: string;
  sponsoredBannerLink?: string;
  sponsoredBannerTitle?: string;
  sponsoredBanner2Image?: string;
  sponsoredBanner2Link?: string;
  sponsoredBanner2Title?: string;
}

export function SponsoredAdSection({ variant = "full" }: { variant?: "full" | "sidebar" | "vertical" }) {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") setSettings(data);
      })
      .catch(() => {});
  }, []);

  const isSecond = variant === "sidebar";
  const link = (isSecond ? settings.sponsoredBanner2Link : settings.sponsoredBannerLink) || "/contact";
  const title = (isSecond ? settings.sponsoredBanner2Title : settings.sponsoredBannerTitle) || "Sponsored";
  const image = isSecond ? settings.sponsoredBanner2Image : settings.sponsoredBannerImage;

  const DefaultAd = () => {
    const [index, setIndex] = useState(0);
    const lines = ["UMUNSI SITE LTD", "0791859465", "UMUNSI.COM"];

    useEffect(() => {
      const timer = setInterval(() => {
        setIndex((i) => (i + 1) % lines.length);
      }, 3000);
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
        <div className="relative w-full flex-1 flex items-center justify-center min-h-0">
          {lines.map((line, i) => (
            <p
              key={line}
              className={`absolute inset-0 flex items-center justify-center text-center font-black uppercase tracking-wider transition-opacity duration-700 px-4 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              style={{
                fontSize: i === 1 ? "clamp(1rem, 4vw, 2rem)" : "clamp(1.2rem, 5vw, 2.5rem)",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {line}
            </p>
          ))}
        </div>
        <p className="text-[10px] sm:text-xs font-semibold opacity-80 text-center mt-auto">Advertise with us</p>
      </div>
    );
  };

  const Banner = ({ heightClass, roundedClass = "rounded-xl" }: { heightClass: string; roundedClass?: string }) => (
    <div className={`relative w-full ${heightClass} ${roundedClass} overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 shadow-sm`}>
      <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/40 text-white text-[10px] font-bold uppercase rounded">
        {title}
      </span>
      <Link
        href={link}
        target={link.startsWith("http") ? "_blank" : undefined}
        rel={link.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block w-full h-full"
      >
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover bg-white"
          />
        ) : (
          <DefaultAd />
        )}
      </Link>
    </div>
  );

  if (variant === "vertical") {
    return (
      <div className="w-full h-full min-h-[180px]">
        <Banner heightClass="h-full" />
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="w-full h-full">
        <Banner heightClass="h-full" />
      </div>
    );
  }

  return (
    <section className="w-full bg-white border-y border-gray-100">
      <div className="py-4">
        <Banner heightClass="h-[90px]" roundedClass="rounded-none" />
      </div>
    </section>
  );
}
