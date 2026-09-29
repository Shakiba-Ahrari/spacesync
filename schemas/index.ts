import { z } from "zod";

/* ---------------- سالن (Space) ---------------- */
export const spaceTypeSchema = z.enum(["study", "sport"]);
export type SpaceType = z.infer<typeof spaceTypeSchema>;

export const spaceSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  type: spaceTypeSchema,
  city: z.string(),
  address: z.string(),
  description: z.string(),
  totalCapacity: z.number().int().positive(),
  currentOccupancy: z.number().int().nonnegative(),
  openTime: z.string(), // "08:00"
  closeTime: z.string(), // "23:00"
  queueLength: z.number().int().nonnegative(),
});
export type Space = z.infer<typeof spaceSchema>;

/* ---------------- صندلی / زمین (Seat) ---------------- */
export const seatStatusSchema = z.enum(["free", "occupied", "reserved"]);
export type SeatStatus = z.infer<typeof seatStatusSchema>;

export const seatSchema = z.object({
  id: z.string(),
  spaceId: z.string(),
  label: z.string(), // "A-12" یا "زمین ۲"
  row: z.string(), // برای چیدمان نقشه
  status: seatStatusSchema,
  /** دقیقه‌ی باقی‌مانده تا آزاد شدن، اگر اشغال باشد */
  freeInMinutes: z.number().int().nonnegative().nullable(),
});
export type Seat = z.infer<typeof seatSchema>;

/* ---------------- رزرو ---------------- */
export const reservationStatusSchema = z.enum([
  "upcoming",
  "active",
  "completed",
  "cancelled",
]);
export type ReservationStatus = z.infer<typeof reservationStatusSchema>;

export const reservationSchema = z.object({
  id: z.string(),
  spaceId: z.string(),
  spaceName: z.string(),
  seatId: z.string(),
  seatLabel: z.string(),
  date: z.string(), // "1403-08-21"
  startTime: z.string(), // "14:00"
  endTime: z.string(), // "16:00"
  status: reservationStatusSchema,
});
export type Reservation = z.infer<typeof reservationSchema>;

/** فرمی که کاربر در صفحه‌ی رزرو پر می‌کند */
export const bookingFormSchema = z
  .object({
    seatId: z.string().min(1, "یک صندلی یا زمین انتخاب کنید"),
    date: z.string().min(1, "تاریخ را وارد کنید"),
    startTime: z.string().min(1, "ساعت شروع را انتخاب کنید"),
    endTime: z.string().min(1, "ساعت پایان را انتخاب کنید"),
  })
  .refine((v) => v.endTime > v.startTime, {
    message: "ساعت پایان باید بعد از ساعت شروع باشد",
    path: ["endTime"],
  });
export type BookingFormValues = z.infer<typeof bookingFormSchema>;

/* ---------------- صف هوشمند ---------------- */
export const queueEntrySchema = z.object({
  id: z.string(),
  spaceId: z.string(),
  spaceName: z.string(),
  position: z.number().int().positive(),
  peopleAhead: z.number().int().nonnegative(),
  estimatedWaitMinutes: z.number().int().nonnegative(),
  status: z.enum(["waiting", "ready", "expired"]),
});
export type QueueEntry = z.infer<typeof queueEntrySchema>;

/* ---------------- احراز هویت ---------------- */
export const userSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  phone: z.string(),
  role: z.enum(["user", "admin"]),
});
export type User = z.infer<typeof userSchema>;

const phone = z
  .string()
  .regex(/^09\d{9}$/, "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد");

export const loginSchema = z.object({
  phone,
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر است"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "نام و نام خانوادگی را کامل وارد کنید"),
    phone,
    password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر است"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "تکرار رمز عبور مطابقت ندارد",
    path: ["confirmPassword"],
  });
export type RegisterValues = z.infer<typeof registerSchema>;