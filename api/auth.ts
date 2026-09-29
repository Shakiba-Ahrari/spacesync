import { apiClient, USE_MOCK } from "./client";
import type { LoginValues, RegisterValues, User } from "@/schemas";
import { delay } from "@/lib/mock-data";

type AuthResult = { user: User; token: string };

export async function login(values: LoginValues): Promise<AuthResult> {
  if (USE_MOCK) {
    // هر شماره‌ای که با 0911 شروع شود، مدیر در نظر گرفته می‌شود (برای تست پنل ادمین)
    const isAdmin = values.phone.startsWith("0911");
    return delay(
      {
        user: {
          id: "u-1",
          fullName: isAdmin ? "مدیر سالن" : "کاربر آزمایشی",
          phone: values.phone,
          role: isAdmin ? "admin" : "user",
        },
        token: "mock-token",
      },
      600,
    );
  }
  const { data } = await apiClient.post("/auth/login", values);
  return data;
}

export async function register(values: RegisterValues): Promise<AuthResult> {
  if (USE_MOCK) {
    return delay(
      {
        user: {
          id: "u-new",
          fullName: values.fullName,
          phone: values.phone,
          role: "user",
        },
        token: "mock-token",
      },
      600,
    );
  }
  const { data } = await apiClient.post("/auth/register", values);
  return data;
}