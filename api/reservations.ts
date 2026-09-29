import { apiClient, USE_MOCK } from "./client";
import {
  reservationSchema,
  type BookingFormValues,
  type QueueEntry,
  type Reservation,
} from "@/schemas";
import { delay, MOCK_RESERVATIONS, MOCK_SEATS, MOCK_SPACES } from "@/lib/mock-data";

/** رزروهای کاربر جاری */
export async function getMyReservations(): Promise<Reservation[]> {
  if (USE_MOCK) return delay(MOCK_RESERVATIONS);
  const { data } = await apiClient.get("/reservations/me");
  return reservationSchema.array().parse(data);
}

/** ثبت رزرو جدید */
export async function createReservation(
  spaceId: string,
  values: BookingFormValues,
): Promise<Reservation> {
  if (USE_MOCK) {
    const space = MOCK_SPACES.find((s) => s.id === spaceId)!;
    const seat = (MOCK_SEATS[spaceId] ?? []).find((s) => s.id === values.seatId)!;
    const created: Reservation = {
      id: `r-${Date.now()}`,
      spaceId,
      spaceName: space.name,
      seatId: seat.id,
      seatLabel: seat.label,
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      status: "upcoming",
    };
    MOCK_RESERVATIONS.unshift(created);
    seat.status = "reserved";
    return delay(created, 700);
  }
  const { data } = await apiClient.post(`/spaces/${spaceId}/reservations`, values);
  return reservationSchema.parse(data);
}

/** لغو رزرو */
export async function cancelReservation(id: string): Promise<void> {
  if (USE_MOCK) {
    const r = MOCK_RESERVATIONS.find((x) => x.id === id);
    if (r) r.status = "cancelled";
    await delay(null, 400);
    return;
  }
  await apiClient.patch(`/reservations/${id}/cancel`);
}

/* ------------------- صف هوشمند ------------------- */

let mockQueue: QueueEntry | null = null;

/** ورود به صف یک سالن */
export async function joinQueue(spaceId: string): Promise<QueueEntry> {
  if (USE_MOCK) {
    const space = MOCK_SPACES.find((s) => s.id === spaceId)!;
    mockQueue = {
      id: `q-${Date.now()}`,
      spaceId,
      spaceName: space.name,
      position: space.queueLength + 1,
      peopleAhead: space.queueLength,
      estimatedWaitMinutes: (space.queueLength + 1) * 8,
      status: "waiting",
    };
    return delay(mockQueue, 600);
  }
  const { data } = await apiClient.post(`/spaces/${spaceId}/queue`);
  return data;
}

/** وضعیت فعلی من در صف (برای polling) */
export async function getMyQueueEntry(): Promise<QueueEntry | null> {
  if (USE_MOCK) {
    if (mockQueue && mockQueue.status === "waiting") {
      // هر بار یک نفر از صف جلوتر می‌رود
      const peopleAhead = Math.max(0, mockQueue.peopleAhead - 1);
      mockQueue = {
        ...mockQueue,
        peopleAhead,
        position: peopleAhead + 1,
        estimatedWaitMinutes: peopleAhead * 8,
        status: peopleAhead === 0 ? "ready" : "waiting",
      };
    }
    return delay(mockQueue, 200);
  }
  const { data } = await apiClient.get("/queue/me");
  return data;
}

/** خروج از صف */
export async function leaveQueue(): Promise<void> {
  if (USE_MOCK) {
    mockQueue = null;
    await delay(null, 300);
    return;
  }
  await apiClient.delete("/queue/me");
}