"use client";

import { useEffect, useRef, useState } from "react";

/**
 * هوک عمومی برای گرفتن داده به‌صورت دوره‌ای.
 * از همین برای «ظرفیت لحظه‌ای» و «وضعیت صف» استفاده می‌کنیم.
 * وقتی بک‌اند WebSocket داشت، فقط جای همین هوک عوض می‌شود.
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  intervalMs = 5000,
  enabled = true,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function run() {
      try {
        const result = await fetcherRef.current();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("دریافت اطلاعات ناموفق بود");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    const id = setInterval(run, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs, enabled]);

  return { data, loading, error };
}