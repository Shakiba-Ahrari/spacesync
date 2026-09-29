"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { LogOut, Menu, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/spaces", label: "سالن‌ها" },
  { href: "/profile", label: "رزروهای من" },
];

/**
 * وضعیت ورود از localStorage خوانده می‌شود، پس فقط بعد از هیدریت شدن در
 * کلاینت قابل‌اعتماد است. useSyncExternalStore برای این تشخیص است تا
 * دیگر نیازی به setState داخل useEffect نباشد.
 */
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const mounted = useIsClient();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ink text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          SpaceSync
        </Link>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-teal",
                pathname.startsWith(item.href) ? "text-teal" : "text-white/80",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="me-auto flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-white hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Link href="/checkin/lib-central-A-1">
              <QrCode className="size-4" />
              اسکن QR
            </Link>
          </Button>

          {mounted && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  {user.fullName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  رزروهای من
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    پنل مدیریت
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  <LogOut className="size-4" />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="bg-teal hover:bg-teal-dark">
              <Link href="/login">ورود</Link>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Menu className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {NAV.map((item) => (
                <DropdownMenuItem key={item.href} onClick={() => router.push(item.href)}>
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}