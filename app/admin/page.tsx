"use client";

import { useEffect } from "react";
import { getSpaces } from "@/api/spaces";
import { usePolling } from "@/hooks/usePolling";
import { useSpaceStore } from "@/store/useSpaceStore";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import OccupancyBar from "@/app/components/space/OccupancyBar";
import PeakHoursChart from "@/app/components/admin/PeakHoursChart";
import { fa, occupancyRate } from "@/lib/utils";

export default function AdminDashboard() {
  const { spaces, setSpaces } = useSpaceStore();
  const { data, loading } = usePolling(getSpaces, 10_000);

  useEffect(() => {
    if (data) setSpaces(data);
  }, [data, setSpaces]);

  const totalCapacity = spaces.reduce((a, s) => a + s.totalCapacity, 0);
  const totalOccupied = spaces.reduce((a, s) => a + s.currentOccupancy, 0);
  const totalQueue = spaces.reduce((a, s) => a + s.queueLength, 0);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">داشبورد</h1>
      <p className="mt-2 text-muted-foreground">
        وضعیت همه‌ی سالن‌های تحت مدیریت شما، به‌صورت زنده.
      </p>

      {loading && spaces.length === 0 ? (
        <Skeleton className="mt-8 h-32 rounded-xl" />
      ) : (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <KpiCard
              label="درصد اشغال کل"
              value={`٪${fa(occupancyRate(totalOccupied, totalCapacity))}`}
            />
            <KpiCard
              label="جای خالی همین الان"
              value={fa(totalCapacity - totalOccupied)}
            />
            <KpiCard label="نفرات در صف" value={fa(totalQueue)} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <Card>
              <CardContent>
                <h2 className="font-bold">اشغال به تفکیک سالن</h2>
                <div className="mt-6 space-y-6">
                  {spaces.map((s) => (
                    <div key={s.id}>
                      <div className="mb-2 flex items-baseline justify-between text-sm">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-muted-foreground">
                          {fa(s.currentOccupancy)} از {fa(s.totalCapacity)}
                        </span>
                      </div>
                      <OccupancyBar
                        occupied={s.currentOccupancy}
                        total={s.totalCapacity}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="font-bold">ساعات پیک امروز</h2>
                <PeakHoursChart className="mt-6" />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rule-top">
      <CardContent className="pt-1">
        <p className="text-4xl font-extrabold text-ink">{value}</p>
        <p className="mt-2 text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}