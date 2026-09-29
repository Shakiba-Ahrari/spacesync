"use client";

import type { Seat } from "@/schemas";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, fa, SEAT_STATUS_LABEL } from "@/lib/utils";

const STATUS_STYLE: Record<Seat["status"], string> = {
  free: "bg-teal-wash text-teal-dark border-teal/40 hover:border-teal",
  occupied: "bg-[color:var(--seat-occupied)]/12 text-[color:var(--seat-occupied)] border-[color:var(--seat-occupied)]/35",
  reserved:
    "bg-[color:var(--seat-reserved)]/14 text-[color:var(--seat-reserved)] border-[color:var(--seat-reserved)]/40",
};

interface Props {
  seats: Seat[];
  className?: string;
  /** اگر پاس داده شود، صندلی‌های آزاد قابل انتخاب می‌شوند */
  selectedId?: string;
  onSelect?: (seat: Seat) => void;
}

export default function SeatMap({ seats, className, selectedId, onSelect }: Props) {
  const rows = Array.from(new Set(seats.map((s) => s.row)));
  const selectable = Boolean(onSelect);

  return (
    <div className={className}>
      <div className="rounded-xl border border-border bg-white p-5">
        {rows.map((row) => (
          <div key={row} className="mb-5 last:mb-0">
            <p className="mb-2 text-xs text-muted-foreground">ردیف {row}</p>
            <div className="flex flex-wrap gap-2">
              {seats
                .filter((s) => s.row === row)
                .map((seat) => {
                  const disabled = seat.status !== "free";
                  const isSelected = selectedId === seat.id;

                  const chip = (
                    <button
                      key={seat.id}
                      type="button"
                      disabled={!selectable || disabled}
                      onClick={() => onSelect?.(seat)}
                      aria-label={`${seat.label} — ${SEAT_STATUS_LABEL[seat.status]}`}
                      className={cn(
                        "min-w-14 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                        STATUS_STYLE[seat.status],
                        selectable && !disabled && "cursor-pointer",
                        (!selectable || disabled) && "cursor-default",
                        isSelected &&
                          "scale-105 border-teal bg-teal text-white shadow-md",
                      )}
                    >
                      {fa(seat.label)}
                    </button>
                  );

                  return (
                    <Tooltip key={seat.id}>
                      <TooltipTrigger asChild>{chip}</TooltipTrigger>
                      <TooltipContent>
                        {SEAT_STATUS_LABEL[seat.status]}
                        {seat.freeInMinutes !== null &&
                          ` — تخمین آزاد شدن: ${fa(seat.freeInMinutes)} دقیقه`}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* راهنمای رنگ‌ها */}
      <div className="mt-4 flex flex-wrap gap-5 text-xs text-muted-foreground">
        <Legend color="var(--seat-free)" label="آزاد" />
        <Legend color="var(--seat-occupied)" label="اشغال" />
        <Legend color="var(--seat-reserved)" label="رزرو شده" />
      </div>
    </div>
  );
}


function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="size-3 rounded" style={{ background: color }} />
      {label}
    </span>
  );
}