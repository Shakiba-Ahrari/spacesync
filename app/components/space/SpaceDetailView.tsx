"use client";

import Link from "next/link";
import { Clock, MapPin, RefreshCw } from "lucide-react";
import type { Space } from "@/schemas";
import { getSeats } from "@/api/spaces";
import { usePolling } from "@/hooks/usePolling";
import SeatMap from "./SeatMap";
import OccupancyBar from "./OccupancyBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fa } from "@/lib/utils";

export default function SpaceDetailView({ space }: { space: Space }) {
  // ظرفیت لحظه‌ای: هر ۵ ثانیه وضعیت صندلی‌ها را دوباره می‌گیریم
  const { data: seats, loading } = usePolling(() => getSeats(space.id), 5000);

  const list = seats ?? [];
  const freeCount = list.filter((s) => s.status === "free").length;
  const isFull = list.length > 0 && freeCount === 0;
  const unit = space.type === "sport" ? "زمین" : "صندلی";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* سرصفحه */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{space.name}</h1>
            <Badge variant="secondary">
              {space.type === "study" ? "مطالعه" : "ورزشی"}
            </Badge>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {space.city}، {space.address}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            {fa(space.openTime)} تا {fa(space.closeTime)}
          </p>
        </div>

        {isFull ? (
          <Button asChild size="lg" variant="outline">
            <Link href={`/spaces/${space.id}/queue`}>ورود به صف</Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="bg-teal hover:bg-teal-dark">
            <Link href={`/spaces/${space.id}/book`}>رزرو {unit}</Link>
          </Button>
        )}
      </div>

      <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
        {space.description}
      </p>

      {/* خلاصه‌ی ظرفیت */}
      <Card className="mt-8 rule-top">
        <CardContent className="pt-1">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">ظرفیت لحظه‌ای</h2>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw className="size-3" />
              هر ۵ ثانیه به‌روز می‌شود
            </span>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            <Stat label={`${unit}‌های آزاد`} value={fa(freeCount)} tone="free" />
            <Stat
              label={`${unit}‌های اشغال`}
              value={fa(list.filter((s) => s.status === "occupied").length)}
              tone="occupied"
            />
            <Stat
              label="رزرو شده"
              value={fa(list.filter((s) => s.status === "reserved").length)}
              tone="reserved"
            />
          </div>

          <div className="mt-6">
            <OccupancyBar
              occupied={list.length - freeCount}
              total={list.length || space.totalCapacity}
            />
          </div>
        </CardContent>
      </Card>

      {/* نقشه */}
      <h2 className="mt-10 font-bold">نقشه‌ی {unit}‌ها</h2>
      {loading && list.length === 0 ? (
        <Skeleton className="mt-4 h-64 rounded-xl" />
      ) : (
        <SeatMap seats={list} className="mt-4" />
      )}

      {isFull && (
        <div className="mt-8 rounded-xl bg-teal px-6 py-5 text-white">
          <p className="font-semibold">این سالن الان پر است.</p>
          <p className="mt-1.5 text-sm text-white/85">
            وارد صف هوشمند شوید تا به‌محض آزاد شدن یک {unit} به شما اطلاع دهیم.
          </p>
          <Button asChild className="mt-4 bg-white text-ink hover:bg-white/90">
            <Link href={`/spaces/${space.id}/queue`}>ورود به صف</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "free" | "occupied" | "reserved";
}) {
  const color = {
    free: "var(--seat-free)",
    occupied: "var(--seat-occupied)",
    reserved: "var(--seat-reserved)",
  }[tone];

  return (
    <div className="border-e border-border pe-4 last:border-e-0">
      <p className="text-3xl font-extrabold" style={{ color }}>
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}