"use client";

import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import type { Seat, Space } from "@/schemas";
import { getSeats, getSpaces } from "@/api/spaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QrSheet from "@/app/components/qr/QrSheet";
import { fa } from "@/lib/utils";

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrTarget, setQrTarget] = useState<{ space: Space; seats: Seat[] } | null>(
    null,
  );

  useEffect(() => {
    getSpaces()
      .then(setSpaces)
      .finally(() => setLoading(false));
  }, []);

  async function openQr(space: Space) {
    const seats = await getSeats(space.id);
    setQrTarget({ space, seats });
  }

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-bold">سالن‌ها و کدهای QR</h1>
      <p className="mt-2 text-muted-foreground">
        برای هر سالن یک برگه‌ی QR بسازید و روی صندلی‌ها یا زمین‌ها نصب کنید.
      </p>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {spaces.map((space) => (
            <Card key={space.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-bold">{space.name}</h2>
                    <Badge variant="secondary">
                      {space.type === "study" ? "مطالعه" : "ورزشی"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {fa(space.totalCapacity)} جایگاه — {fa(space.currentOccupancy)}{" "}
                    اشغال — {fa(space.queueLength)} نفر در صف
                  </p>
                </div>

                <Button variant="outline" onClick={() => openQr(space)}>
                  <QrCode className="size-4" />
                  ساخت برگه QR
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(qrTarget)} onOpenChange={() => setQrTarget(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>کدهای QR — {qrTarget?.space.name}</DialogTitle>
          </DialogHeader>
          {qrTarget && <QrSheet seats={qrTarget.seats} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}