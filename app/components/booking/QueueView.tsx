"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Space } from "@/schemas";
import { getMyQueueEntry, joinQueue, leaveQueue } from "@/api/reservations";
import { usePolling } from "@/hooks/usePolling";
import { useQueueStore } from "@/store/useQueueStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fa } from "@/lib/utils";

export default function QueueView({ space }: { space: Space }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { entry, setEntry } = useQueueStore();
  const [joining, setJoining] = useState(false);

  // تا وقتی در صف هستیم، هر ۴ ثانیه موقعیت را می‌گیریم
  const { data } = usePolling(getMyQueueEntry, 4000, Boolean(entry));

  useEffect(() => {
    if (data) setEntry(data);
  }, [data, setEntry]);

  useEffect(() => {
    if (entry?.status === "ready") {
      toast.success("نوبت شما رسید — جای شما آماده است");
    }
  }, [entry?.status]);

  async function handleJoin() {
    if (!user) {
      toast.error("برای ورود به صف ابتدا وارد حساب خود شوید");
      router.push("/login");
      return;
    }
    setJoining(true);
    try {
      setEntry(await joinQueue(space.id));
    } catch {
      toast.error("ورود به صف ناموفق بود");
    } finally {
      setJoining(false);
    }
  }

  async function handleLeave() {
    await leaveQueue();
    setEntry(null);
    toast.success("از صف خارج شدید");
  }

  const unit = space.type === "sport" ? "زمین" : "صندلی";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold">صف هوشمند — {space.name}</h1>

      {!entry ? (
        <Card className="mt-8 rule-top">
          <CardContent className="pt-1">
            <p className="leading-8">
              این سالن الان پر است. وارد صف شوید تا به‌محض آزاد شدن یک {unit} به شما
              خبر بدهیم. لازم نیست جایی منتظر بمانید — وضعیت صف را از همین صفحه دنبال
              کنید.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              هم‌اکنون {fa(space.queueLength)} نفر در صف هستند.
            </p>
            <Button
              onClick={handleJoin}
              disabled={joining}
              size="lg"
              className="mt-6 bg-teal hover:bg-teal-dark"
            >
              {joining ? "در حال ثبت..." : "ورود به صف"}
            </Button>
          </CardContent>
        </Card>
      ) : entry.status === "ready" ? (
        <Card className="mt-8 border-teal bg-teal text-white">
          <CardContent className="pt-1 text-center">
            <p className="text-3xl font-extrabold">نوبت شماست</p>
            <p className="mt-3 leading-7 text-white/85">
              یک {unit} آزاد شد. تا ۱۰ دقیقه برای شما نگه داشته می‌شود؛ با اسکن QR روی
              همان {unit} حضور خود را ثبت کنید.
            </p>
            <Button asChild className="mt-6 bg-white text-ink hover:bg-white/90">
              <Link href={`/spaces/${space.id}`}>دیدن نقشه سالن</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-8 rule-top">
          <CardContent className="pt-1 text-center">
            <p className="text-sm text-muted-foreground">موقعیت شما در صف</p>
            <p className="mt-2 text-6xl font-extrabold text-teal">
              {fa(entry.position)}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-paper p-4">
                <p className="text-2xl font-bold">{fa(entry.peopleAhead)}</p>
                <p className="mt-1 text-muted-foreground">نفر جلوتر از شما</p>
              </div>
              <div className="rounded-lg bg-paper p-4">
                <p className="text-2xl font-bold">
                  {fa(entry.estimatedWaitMinutes)}
                </p>
                <p className="mt-1 text-muted-foreground">دقیقه انتظار تقریبی</p>
              </div>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              این صفحه هر چند ثانیه خودش به‌روز می‌شود.
            </p>

            <Button onClick={handleLeave} variant="outline" className="mt-6">
              خروج از صف
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}