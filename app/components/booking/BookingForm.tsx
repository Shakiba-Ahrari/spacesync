"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { bookingFormSchema, type BookingFormValues, type Seat, type Space } from "@/schemas";
import { getSeats } from "@/api/spaces";
import { createReservation } from "@/api/reservations";
import { useAuthStore } from "@/store/useAuthStore";
import SeatMap from "@/app/components/space/SeatMap";
import JalaliDatePicker from "@/app/components/booking/JalaliDatePicker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatJalali, jalaliToKey, todayJalali } from "@/lib/jalali";

const HOURS = Array.from({ length: 16 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);

export default function BookingForm({ space }: { space: Space }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(true);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      seatId: "",
      date: jalaliToKey(todayJalali().jy, todayJalali().jm, todayJalali().jd),
      startTime: "",
      endTime: "",
    },
  });

  const selectedSeatId = watch("seatId");

  useEffect(() => {
    getSeats(space.id)
      .then(setSeats)
      .finally(() => setLoadingSeats(false));
  }, [space.id]);

  async function onSubmit(values: BookingFormValues) {
    if (!user) {
      toast.error("برای رزرو ابتدا وارد حساب خود شوید");
      router.push("/login");
      return;
    }
    try {
      await createReservation(space.id, values);
      toast.success("رزرو ثبت شد");
      router.push("/profile");
    } catch {
      toast.error("ثبت رزرو ناموفق بود. دوباره تلاش کنید.");
    }
  }

  const selectedSeat = seats.find((s) => s.id === selectedSeatId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
      {/* انتخاب صندلی */}
      <section>
        <h2 className="font-bold">
          {space.type === "sport" ? "انتخاب زمین" : "انتخاب صندلی"}
        </h2>
        {loadingSeats ? (
          <Skeleton className="mt-4 h-52 rounded-xl" />
        ) : (
          <SeatMap
            seats={seats}
            className="mt-4"
            selectedId={selectedSeatId}
            onSelect={(seat) =>
              setValue("seatId", seat.id, { shouldValidate: true })
            }
          />
        )}
        {errors.seatId && (
          <p className="mt-2 text-sm text-destructive">{errors.seatId.message}</p>
        )}
      </section>

      {/* زمان */}
      <section className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="date">تاریخ</Label>
          <div className="mt-2">
            <JalaliDatePicker
              id="date"
              value={watch("date")}
              onChange={(v) => setValue("date", v, { shouldValidate: true })}
            />
          </div>
          {errors.date && (
            <p className="mt-1.5 text-sm text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="startTime">از ساعت</Label>
          <div className="mt-2">
            <Select
              value={watch("startTime")}
              onValueChange={(v) => setValue("startTime", v ?? "", { shouldValidate: true })}
            >
              <SelectTrigger id="startTime" className="w-full">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.startTime && (
            <p className="mt-1.5 text-sm text-destructive">
              {errors.startTime.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="endTime">تا ساعت</Label>
          <div className="mt-2">
            <Select
              value={watch("endTime")}
              onValueChange={(v) => setValue("endTime", v ?? "", { shouldValidate: true })}
            >
              <SelectTrigger id="endTime" className="w-full">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errors.endTime && (
            <p className="mt-1.5 text-sm text-destructive">{errors.endTime.message}</p>
          )}
        </div>
      </section>

      {/* خلاصه */}
      <Card className="rule-top">
        <CardContent className="pt-1">
          <h3 className="font-bold">خلاصه رزرو</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="سالن" value={space.name} />
            <Row
              label={space.type === "sport" ? "زمین" : "صندلی"}
              value={selectedSeat?.label ?? "انتخاب نشده"}
            />
            <Row
              label="تاریخ"
              value={watch("date") ? formatJalali(watch("date")) : "انتخاب نشده"}
            />
            <Row
              label="ساعت"
              value={
                watch("startTime") && watch("endTime")
                  ? `${watch("startTime")} تا ${watch("endTime")}`
                  : "انتخاب نشده"
              }
            />
          </dl>
        </CardContent>
      </Card>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-teal hover:bg-teal-dark sm:w-auto"
      >
        {isSubmitting ? "در حال ثبت..." : "ثبت رزرو"}
      </Button>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}