"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { checkinSeat, checkoutSeat } from "@/api/spaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fa } from "@/lib/utils";

type State =
  | { kind: "loading" }
  | { kind: "done"; seatLabel: string }
  | { kind: "error" };

/**
 * این صفحه با اسکن QR روی صندلی باز می‌شود و به‌صورت خودکار حضور را ثبت می‌کند.
 * آدرس QR روی هر صندلی: https://spacesync.app/checkin/<seatId>
 */
export default function CheckinView({ seatId }: { seatId: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);

  useEffect(() => {
    checkinSeat(seatId)
      .then((res) => setState({ kind: "done", seatLabel: res.seatLabel }))
      .catch(() => setState({ kind: "error" }));
  }, [seatId]);

  async function handleRelease() {
    setReleasing(true);
    await checkoutSeat(seatId);
    setReleased(true);
    setReleasing(false);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-20">
      <Card className="rule-top">
        <CardContent className="pt-1 text-center">
          {state.kind === "loading" && (
            <>
              <LoaderCircle className="mx-auto size-10 animate-spin text-teal" />
              <p className="mt-5 font-medium">در حال ثبت حضور شما…</p>
            </>
          )}

          {state.kind === "error" && (
            <>
              <XCircle className="mx-auto size-10 text-destructive" />
              <h1 className="mt-5 text-lg font-bold">این صندلی شناخته نشد</h1>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                کد روی صندلی ممکن است آسیب دیده باشد. دوباره اسکن کنید یا از فهرست
                سالن‌ها صندلی خود را انتخاب کنید.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/spaces">رفتن به فهرست سالن‌ها</Link>
              </Button>
            </>
          )}

          {state.kind === "done" && !released && (
            <>
              <CheckCircle2 className="mx-auto size-10 text-teal" />
              <h1 className="mt-5 text-lg font-bold">
                صندلی {fa(state.seatLabel)} برای شما ثبت شد
              </h1>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                از این لحظه این صندلی برای بقیه اشغال نمایش داده می‌شود. وقتی کارتان
                تمام شد، همین کد را دوباره اسکن کنید یا دکمه‌ی پایین را بزنید.
              </p>
              <Button
                onClick={handleRelease}
                disabled={releasing}
                className="mt-6 bg-teal hover:bg-teal-dark"
              >
                {releasing ? "در حال آزادسازی…" : "پایان استفاده و آزادسازی صندلی"}
              </Button>
            </>
          )}

          {released && (
            <>
              <CheckCircle2 className="mx-auto size-10 text-teal" />
              <h1 className="mt-5 text-lg font-bold">صندلی آزاد شد</h1>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                ممنون که جای خالی را برای نفر بعدی آزاد کردید.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/spaces">بازگشت به سالن‌ها</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}