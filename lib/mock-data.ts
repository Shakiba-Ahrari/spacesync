import type { Reservation, Seat, Space } from "@/schemas";

/**
 * داده‌ی نمونه برای اجرای سایت بدون بک‌اند.
 * وقتی API واقعی آماده شد، فقط فایل‌های داخل src/api عوض می‌شوند و این فایل حذف می‌شود.
 */

export const MOCK_SPACES: Space[] = [
  {
    id: "lib-central",
    name: "کتابخانه مرکزی دانشگاه",
    type: "study",
    city: "تهران",
    address: "خیابان انقلاب، ضلع جنوبی پردیس مرکزی",
    description:
      "سالن مطالعه‌ی دوطبقه با میزهای انفرادی، سکوت کامل و اینترنت پرسرعت.",
    totalCapacity: 48,
    currentOccupancy: 41,
    openTime: "07:00",
    closeTime: "23:00",
    queueLength: 3,
  },
  {
    id: "study-hall-2",
    name: "سالن مطالعه شهید بهشتی",
    type: "study",
    city: "تهران",
    address: "بلوار کشاورز، جنب کتابخانه عمومی",
    description: "فضای گروهی با میزهای شش‌نفره، مناسب مطالعه‌ی تیمی.",
    totalCapacity: 36,
    currentOccupancy: 12,
    openTime: "08:00",
    closeTime: "22:00",
    queueLength: 0,
  },
  {
    id: "futsal-arena",
    name: "سالن فوتسال آزادی",
    type: "sport",
    city: "تهران",
    address: "مجموعه ورزشی آزادی، سالن شماره ۳",
    description: "سه زمین استاندارد فوتسال با کفپوش تاتان و رختکن مجهز.",
    totalCapacity: 6,
    currentOccupancy: 4,
    openTime: "09:00",
    closeTime: "24:00",
    queueLength: 2,
  },
  {
    id: "gym-north",
    name: "سالن ورزشی شمال شهر",
    type: "sport",
    city: "تهران",
    address: "میدان قدس، خیابان دربند",
    description: "سالن چندمنظوره‌ی والیبال و بسکتبال، قابل رزرو ساعتی.",
    totalCapacity: 4,
    currentOccupancy: 1,
    openTime: "10:00",
    closeTime: "23:00",
    queueLength: 0,
  },
];

/** تولید صندلی‌های یک سالن به‌صورت قابل‌تکرار (بدون رندوم ناپایدار) */
function buildSeats(space: Space): Seat[] {
  const seats: Seat[] = [];
  const isSport = space.type === "sport";
  const rows = isSport ? ["زمین"] : ["A", "B", "C", "D"];
  const perRow = Math.ceil(space.totalCapacity / rows.length);

  let index = 0;
  for (const row of rows) {
    for (let i = 1; i <= perRow && index < space.totalCapacity; i++) {
      index++;
      const occupied = index <= space.currentOccupancy;
      const reserved = !occupied && index % 7 === 0;
      seats.push({
        id: `${space.id}-${row}-${i}`,
        spaceId: space.id,
        label: isSport ? `زمین ${i}` : `${row}-${i}`,
        row,
        status: occupied ? "occupied" : reserved ? "reserved" : "free",
        freeInMinutes: occupied ? 15 + ((index * 7) % 60) : null,
      });
    }
  }
  return seats;
}

export const MOCK_SEATS: Record<string, Seat[]> = Object.fromEntries(
  MOCK_SPACES.map((s) => [s.id, buildSeats(s)]),
);

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: "r-1",
    spaceId: "lib-central",
    spaceName: "کتابخانه مرکزی دانشگاه",
    seatId: "lib-central-B-3",
    seatLabel: "B-3",
    date: "1403-08-21",
    startTime: "14:00",
    endTime: "17:00",
    status: "active",
  },
  {
    id: "r-2",
    spaceId: "futsal-arena",
    spaceName: "سالن فوتسال آزادی",
    seatId: "futsal-arena-زمین-2",
    seatLabel: "زمین ۲",
    date: "1403-08-23",
    startTime: "20:00",
    endTime: "21:30",
    status: "upcoming",
  },
  {
    id: "r-3",
    spaceId: "study-hall-2",
    spaceName: "سالن مطالعه شهید بهشتی",
    seatId: "study-hall-2-A-5",
    seatLabel: "A-5",
    date: "1403-08-14",
    startTime: "09:00",
    endTime: "12:00",
    status: "completed",
  },
];

/** شبیه‌سازی تاخیر شبکه */
export function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}