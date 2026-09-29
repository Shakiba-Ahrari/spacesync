import { apiClient, USE_MOCK } from "./client";
import { seatSchema, spaceSchema, type Seat, type Space } from "@/schemas";
import { delay, MOCK_SEATS, MOCK_SPACES } from "@/lib/mock-data";

/** لیست همه‌ی سالن‌ها */
export async function getSpaces(): Promise<Space[]> {
  if (USE_MOCK) return delay(MOCK_SPACES);
  const { data } = await apiClient.get("/spaces");
  return spaceSchema.array().parse(data);
}

/** یک سالن بر اساس شناسه */
export async function getSpace(id: string): Promise<Space | null> {
  if (USE_MOCK) return delay(MOCK_SPACES.find((s) => s.id === id) ?? null);
  const { data } = await apiClient.get(`/spaces/${id}`);
  return spaceSchema.parse(data);
}

/**
 * صندلی‌های یک سالن. این تابع با polling هر چند ثانیه صدا زده می‌شود
 * تا «ظرفیت لحظه‌ای» به‌روز بماند.
 */
export async function getSeats(spaceId: string): Promise<Seat[]> {
  if (USE_MOCK) {
    const seats = MOCK_SEATS[spaceId] ?? [];
    // شبیه‌سازی تغییر لحظه‌ای: هر بار یک صندلی وضعیتش عوض می‌شود
    const idx = Math.floor(Math.random() * seats.length);
    const next = seats.map((s, i) =>
      i === idx
        ? {
            ...s,
            status: s.status === "free" ? ("occupied" as const) : ("free" as const),
            freeInMinutes: s.status === "free" ? 30 : null,
          }
        : s,
    );
    MOCK_SEATS[spaceId] = next;
    return delay(next, 200);
  }
  const { data } = await apiClient.get(`/spaces/${spaceId}/seats`);
  return seatSchema.array().parse(data);
}

/** ثبت حضور با اسکن QR */
export async function checkinSeat(seatId: string): Promise<{ seatLabel: string }> {
  if (USE_MOCK) {
    for (const spaceId of Object.keys(MOCK_SEATS)) {
      const seat = MOCK_SEATS[spaceId].find((s) => s.id === seatId);
      if (seat) {
        seat.status = "occupied";
        seat.freeInMinutes = 120;
        return delay({ seatLabel: seat.label }, 700);
      }
    }
    throw new Error("این صندلی پیدا نشد");
  }
  const { data } = await apiClient.post(`/checkin/${seatId}`);
  return data;
}

/** پایان استفاده و آزادسازی صندلی */
export async function checkoutSeat(seatId: string): Promise<void> {
  if (USE_MOCK) {
    for (const spaceId of Object.keys(MOCK_SEATS)) {
      const seat = MOCK_SEATS[spaceId].find((s) => s.id === seatId);
      if (seat) {
        seat.status = "free";
        seat.freeInMinutes = null;
      }
    }
    await delay(null, 500);
    return;
  }
  await apiClient.post(`/checkout/${seatId}`);
}