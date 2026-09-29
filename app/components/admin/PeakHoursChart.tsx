import { cn } from "@/lib/utils";

const peakHours = [
  { label: "۸", value: 38 },
  { label: "۱۰", value: 64 },
  { label: "۱۲", value: 82 },
  { label: "۱۴", value: 56 },
  { label: "۱۶", value: 74 },
  { label: "۱۸", value: 91 },
  { label: "۲۰", value: 68 },
];

export default function PeakHoursChart({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-40 items-end gap-2", className)}>
      {peakHours.map((hour) => (
        <div key={hour.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end rounded-md bg-muted px-1">
            <div
              className="w-full rounded-sm bg-teal transition-[height]"
              style={{ height: `${hour.value}%` }}
              title={`${hour.label}: ${hour.value}%`}
            />
          </div>
          <span className="text-xs text-muted-foreground">{hour.label}</span>
        </div>
      ))}
    </div>
  );
}