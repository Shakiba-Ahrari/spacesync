import * as jalaali from "jalaali-js";
import { fa } from "./utils";

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

/** امروز به‌صورت تاریخ شمسی */
export function todayJalali(): { jy: number; jm: number; jd: number } {
  const now = new Date();
  return jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** تعداد روزهای یک ماه شمسی (اسفند را با کبیسه‌بودن سال در نظر می‌گیرد) */
export function jalaliMonthLength(jy: number, jm: number): number {
  return jalaali.jalaaliMonthLength(jy, jm);
}

/** تبدیل تاریخ شمسی به رشته‌ی ذخیره‌سازی "YYYY-MM-DD" */
export function jalaliToKey(jy: number, jm: number, jd: number): string {
  return `${jy}-${String(jm).padStart(2, "0")}-${String(jd).padStart(2, "0")}`;
}

/** تبدیل رشته‌ی ذخیره‌شده به اجزای تاریخ شمسی */
export function keyToJalali(key: string): { jy: number; jm: number; jd: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return null;
  return { jy: Number(m[1]), jm: Number(m[2]), jd: Number(m[3]) };
}

/** نمایش خوانا مثل «۲۱ آبان ۱۴۰۳» */
export function formatJalali(key: string): string {
  const d = keyToJalali(key);
  if (!d) return key;
  return `${fa(d.jd)} ${JALALI_MONTHS[d.jm - 1]} ${fa(d.jy)}`;
}

/** آیا این تاریخ شمسی از امروز قبل‌تر است؟ (برای جلوگیری از رزرو روز گذشته) */
export function isBeforeToday(jy: number, jm: number, jd: number): boolean {
  const t = todayJalali();
  const key = jalaliToKey(jy, jm, jd);
  const todayKey = jalaliToKey(t.jy, t.jm, t.jd);
  return key < todayKey;
}