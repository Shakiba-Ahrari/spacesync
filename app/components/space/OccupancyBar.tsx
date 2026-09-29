import { fa, occupancyRate } from "@/lib/utils";

export default function OccupancyBar({
  occupied,
  total,
}: {
  occupied: number;
  total: number;
}) {
  const rate = occupancyRate(occupied, total);
  const color =
    rate >= 100
      ? "var(--seat-occupied)"
      : rate >= 75
        ? "var(--seat-reserved)"
        : "var(--teal)";

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs text-muted-foreground">
        <span>اشغال</span>
        <span>٪{fa(rate)}</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={rate}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="درصد اشغال سالن"
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${rate}%`, background: color }}
        />
      </div>
    </div>
  );
}