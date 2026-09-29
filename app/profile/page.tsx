"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Reservation } from "@/schemas";
import { cancelReservation, getMyReservations } from "@/api/reservations";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, fa } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

const STATUS: Record<
  Reservation["status"],
  { label: string; className: string }
> = {
  active: { label: "در حال استفاده", className: "bg-teal text-white" },
  upcoming: { label: "پیش‌رو", className: "bg-teal-wash text-teal-dark" },
  completed: { label: "پایان‌یافته", className: "bg-secondary text-muted-foreground" },
  cancelled: { label: "لغو شده", className: "bg-secondary text-muted-foreground" },
};

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReservations()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  async function handleCancel(id: string) {
    await cancelReservation(id);
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)),
    );
    toast.success("رزرو لغو شد");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">رزروهای من</h1>
      {user && (
        <p className="mt-2 text-muted-foreground">
          {user.fullName} — {fa(user.phone)}
        </p>
      )}

      {loading ? (
        <div className="mt-8 space-y-4">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">هنوز رزروی ثبت نکرده‌اید.</p>
          <Button asChild className="mt-5 bg-teal hover:bg-teal-dark">
            <Link href="/spaces">دیدن سالن‌ها</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-bold">{r.spaceName}</h2>
                    <Badge className={cn("border-0", STATUS[r.status].className)}>
                      {STATUS[r.status].label}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {r.seatLabel} — {formatJalali(r.date)} از {fa(r.startTime)} تا{" "}
                    {fa(r.endTime)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/spaces/${r.spaceId}`}>دیدن سالن</Link>
                  </Button>
                  {(r.status === "upcoming" || r.status === "active") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(r.id)}
                    >
                      لغو رزرو
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}