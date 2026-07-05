"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Image,
  FolderTree,
  Settings,
  LogOut,
  Menu,
  X,
  PenSquare,
  Eye,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Articles", icon: FileText },
  { href: "/admin/posts/new", label: "New Article", icon: PenSquare },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("ADMIN");
  const [userName, setUserName] = useState<string>("Admin");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isAuthed = localStorage.getItem("umunsi_admin_auth") === "true";
    if (!isAuthed && pathname !== "/admin/login") {
      router.push("/admin/login");
      return;
    }
    try {
      const userStr = localStorage.getItem("umunsi_admin_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const role = (user.role || "ADMIN").toUpperCase();
        setUserRole(role);
        const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || user.email || "Admin";
        setUserName(name);
      }
    } catch {
      // keep defaults
    }
  }, [pathname, router]);

  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) return <>{children}</>;

  const visibleNavItems = navItems.filter((item) => {
    if (item.href === "/admin/users" || item.href === "/admin/settings") {
      return userRole === "ADMIN";
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-ink-900 text-white flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/10">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center font-black">
            U
          </div>
          <div>
            <span className="font-black text-lg">Umunsi</span>
            <span className="text-brand-500 font-black text-lg">.com</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleNavItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                  active
                    ? "bg-brand-600 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Eye className="w-5 h-5" />
            View Site
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("umunsi_admin_auth");
              localStorage.removeItem("umunsi_admin_token");
              localStorage.removeItem("umunsi_admin_user");
              router.push("/admin/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-red-600/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-ink-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-ink-50"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-bold text-ink-900">
              {visibleNavItems.find((item) =>
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href)
              )?.label || "Admin"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold text-ink-700 block leading-tight">
                {userName}
              </span>
              <span className={`text-xs font-bold ${userRole === "ADMIN" ? "text-red-500" : "text-blue-500"}`}>
                {userRole}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
