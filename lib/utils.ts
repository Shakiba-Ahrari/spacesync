import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** تبدیل اعداد لاتین به فارسی برای نمایش */
export function fa(value: string | number): string {
  const digits = "۰۱۲۳۴۵۶۷۸۹";
  return String(value).replace(/\d/g, (d) => digits[Number(d)]);
}

/** درصد اشغال یک سالن */
export function occupancyRate(occupied: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((occupied / total) * 100);
}

/** برچسب فارسی وضعیت صندلی */
export const SEAT_STATUS_LABEL = {
  free: "آزاد",
  occupied: "اشغال",
  reserved: "رزرو شده",
} as const;
