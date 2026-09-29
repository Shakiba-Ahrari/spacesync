"use client";

import { QRCodeSVG } from "qrcode.react";
import { Printer } from "lucide-react";
import type { Seat } from "@/schemas";
import { Button } from "@/components/ui/button";
import { fa } from "@/lib/utils";

/**
 * برگه‌ی قابل چاپ کدهای QR.
 * آدرس هر کد: <دامنه>/checkin/<seatId> — با اسکن، صفحه‌ی ثبت حضور باز می‌شود.
 */
export default function QrSheet({ seats }: { seats: Seat[] }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div>
      <Button onClick={() => window.print()} variant="outline" size="sm">
        <Printer className="size-4" />
        چاپ برگه
      </Button>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className="rounded-lg border border-border bg-white p-3 text-center"
          >
            <QRCodeSVG
              value={`${origin}/checkin/${seat.id}`}
              size={104}
              level="M"
              className="mx-auto"
            />
            <p className="mt-2 text-sm font-bold">{fa(seat.label)}</p>
            <p className="text-[11px] text-muted-foreground">
              برای ثبت حضور اسکن کنید
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}