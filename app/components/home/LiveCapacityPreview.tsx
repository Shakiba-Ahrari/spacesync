"use client";

import Link from "next/link";
import { getSpaces } from "@/api/spaces";
import { usePolling } from "@/hooks/usePolling";
import { fa, occupancyRate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * کارت «همین الان» در هیرو: سه سالن با ظرفیت زنده.
 * هر ۵ ثانیه به‌روز می‌شود تا ارزش اصلی محصول بلافاصله دیده شود.
 */
export default function LiveCapacityPreview() {
  const { data, loading } = usePolling(getSpaces, 5000);
  const spaces = (data ?? []).slice(0, 3);

  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-sm text-white/70">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal opacity-70" />
          <span className="relative inline-flex size-2 rounded-full bg-teal" />
        </span>
        همین الان
      </div>

      <div className="space-y-3">
        {loading &&
          [0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl bg-white/10" />
          ))}

        {spaces.map((space) => {
          const free = space.totalCapacity - space.currentOccupancy;
          const rate = occupancyRate(space.currentOccupancy, space.totalCapacity);
          return (
            <Link
              key={space.id}
              href={`/spaces/${space.id}`}
              className="block rounded-xl bg-white/10 p-4 transition-colors hover:bg-white/15"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium">{space.name}</span>
                <span
                  className="text-sm font-bold"
                  style={{ color: free > 0 ? "var(--teal)" : "var(--seat-occupied)" }}
                >
                  {free > 0 ? `${fa(free)} جای خالی` : "تکمیل"}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${rate}%`,
                    background: free > 0 ? "var(--teal)" : "var(--seat-occupied)",
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}