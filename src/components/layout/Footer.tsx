"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield, FileText, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white mt-16">
      {/* Main footer */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/images/umunsi-text-logo.jpg"
                alt="Umunsi.com"
                width={180}
                height={45}
                className="h-10 w-auto brightness-0 invert"
                priority
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Entertainment, Health and Social Life through Education. Home of Umunsimedia.com students App
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[#e5b60d] font-bold mb-5 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Legal
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="/privacy" className="hover:text-[#e5b60d] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#e5b60d] transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#e5b60d]" />
                Accredited by DPO (Data Protection)
              </li>
            </ul>
          </div>

          {/* Our Brands */}
          <div>
            <h4 className="text-[#e5b60d] font-bold mb-5">Our Brands</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link href="https://umunsi.com" className="hover:text-[#e5b60d] transition-colors">
                  Umunsi.com
                </Link>
              </li>
              <li>
                <Link href="https://umunsimedia.com" className="hover:text-[#e5b60d] transition-colors">
                  Umunsimedia
                </Link>
              </li>
              <li>
                <Link href="https://student.umunsi.com" className="hover:text-[#e5b60d] transition-colors">
                  student.umunsi.com
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#e5b60d] font-bold mb-5 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Contact
            </h4>
            <p className="text-white/70 text-sm">
              Call us: <span className="text-white font-semibold">0791859465</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Umunsi.com. All rights reserved.</p>
          <p className="font-semibold text-[#e5b60d]">Designed by UMUNSI SITE Ltd</p>
        </div>
      </div>
    </footer>
  );
}
