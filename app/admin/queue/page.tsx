"use client";

import { useEffect } from "react";
import { getSpaces } from "@/api/spaces";
import { usePolling } from "@/hooks/usePolling";
import { useSpaceStore } from "@/store/useSpaceStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fa } from "@/lib/utils";

export default function AdminQueuePage() {
  const { spaces, setSpaces } = useSpaceStore();
  const { data, loading } = usePolling(getSpaces, 6000);

  useEffect(() => {
    if (data) setSpaces(data);
  }, [data, setSpaces]);

  const withQueue = spaces.filter((s) => s.queueLength > 0);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">صف‌ها</h1>
      <p className="mt-2 text-muted-foreground">
        سالن‌هایی که الان پر هستند و افرادی منتظرشان هستند.
      </p>

      {loading && spaces.length === 0 ? (
        <Skeleton className="mt-8 h-28 rounded-xl" />
      ) : withQueue.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">هیچ صفی فعال نیست.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            همه‌ی سالن‌ها ظرفیت خالی دارند.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {withQueue.map((s) => (
            <Card key={s.id} className="rule-top-warn">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div>
                  <h2 className="font-bold">{s.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {fa(s.queueLength)} نفر منتظر — انتظار تقریبی{" "}
                    {fa(s.queueLength * 8)} دقیقه
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  اطلاع به نفر اول صف
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}