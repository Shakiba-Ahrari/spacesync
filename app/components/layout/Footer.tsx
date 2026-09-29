"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-bold text-ink">SpaceSync</span> — ظرفیت لحظه‌ای سالن‌های
          مطالعه و ورزشی
        </p>
        <nav className="flex gap-5">
          <Link href="/spaces" className="hover:text-teal">
            سالن‌ها
          </Link>
          <Link href="/login" className="hover:text-teal">
            ورود
          </Link>
          <Link href="/admin" className="hover:text-teal">
            مدیران
          </Link>
        </nav>
      </div>
    </footer>
  );
}