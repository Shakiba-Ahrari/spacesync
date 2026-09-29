import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * نمونه‌ی مرکزی axios. فعلاً چون بک‌اند آماده نیست از آن استفاده نمی‌شود،
 * ولی همه‌ی فایل‌های api روی همین سوار می‌شوند.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

/** وقتی بک‌اند آماده شد، این را false کن تا درخواست‌های واقعی ارسال شوند. */
export const USE_MOCK = true;