"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: BarChart3 },
  { href: "/admin/spaces", label: "سالن‌ها و کدهای QR", icon: Building2 },
  { href: "/admin/queue", label: "صف‌ها", icon: ListOrdered },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-s border-border bg-ink text-white md:block">
        <div className="p-5">
          <Link href="/" className="text-lg font-extrabold">
            SpaceSync
          </Link>
          <p className="mt-1 text-xs text-white/50">پنل مدیریت</p>
        </div>
        <nav className="px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                pathname === item.href
                  ? "bg-teal text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 bg-paper">
        {/* ناوبری موبایل */}
        <div className="flex gap-2 overflow-x-auto border-b border-border bg-ink px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm",
                pathname === item.href ? "bg-teal text-white" : "text-white/70",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}