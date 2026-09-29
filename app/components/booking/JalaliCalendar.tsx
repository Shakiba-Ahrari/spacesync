"use client";

import * as jalaali from "jalaali-js";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JALALI_MONTHS,
  jalaliMonthLength,
  jalaliToKey,
  keyToJalali,
  todayJalali,
} from "@/lib/jalali";
import { cn, fa } from "@/lib/utils";

const WEEKDAY_LABELS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

/** getDay جاوااسکریپت (۰=یکشنبه) را به ایندکس هفته‌ی فارسی (۰=شنبه) نگاشت می‌کند */
function toPersianWeekday(jsDay: number) {
  return (jsDay + 1) % 7;
}

function firstWeekdayOfMonth(jy: number, jm: number) {
  const g = jalaali.toGregorian(jy, jm, 1);
  const d = new Date(g.gy, g.gm - 1, g.gd);
  return toPersianWeekday(d.getDay());
}

interface Props {
  /** "YYYY-MM-DD" شمسی یا رشته‌ی خالی */
  value: string;
  onChange: (value: string) => void;
  /** روزهای قبل از امروز غیرقابل‌انتخاب می‌شوند */
  disablePast?: boolean;
}

export default function JalaliCalendar({ value, onChange, disablePast = true }: Props) {
  const today = todayJalali();
  const selected = keyToJalali(value);

  const [viewYear, setViewYear] = useState(selected?.jy ?? today.jy);
  const [viewMonth, setViewMonth] = useState(selected?.jm ?? today.jm);

  const years = useMemo(() => [today.jy, today.jy + 1], [today.jy]);
  const daysInMonth = jalaliMonthLength(viewYear, viewMonth);
  const leadingBlanks = firstWeekdayOfMonth(viewYear, viewMonth);
  const todayKey = jalaliToKey(today.jy, today.jm, today.jd);

  function changeMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m > 12) {
      m = 1;
      y += 1;
    } else if (m < 1) {
      m = 12;
      y -= 1;
    }
    setViewMonth(m);
    setViewYear(y);
  }

  return (
    <div className="w-72">
      {/* هدر: ماه/سال + پیمایش */}
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => changeMonth(1)}
          aria-label="ماه بعد"
        >
          <ChevronRight className="size-4" />
        </Button>

        <div className="flex flex-1 gap-2">
          <Select
            value={String(viewMonth)}
            onValueChange={(v) => setViewMonth(Number(v))}
          >
            <SelectTrigger size="sm" className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {JALALI_MONTHS.map((name, i) => (
                <SelectItem key={name} value={String(i + 1)}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(viewYear)} onValueChange={(v) => setViewYear(Number(v))}>
            <SelectTrigger size="sm" className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {fa(y)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => changeMonth(-1)}
          aria-label="ماه قبل"
        >
          <ChevronLeft className="size-4" />
        </Button>
      </div>

      {/* عناوین روزهای هفته */}
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {WEEKDAY_LABELS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* شبکه‌ی روزها */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <span key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const key = jalaliToKey(viewYear, viewMonth, day);
          const isSelected = key === value;
          const isToday = key === todayKey;
          const isPast = disablePast && key < todayKey;

          return (
            <Button
              key={day}
              type="button"
              variant={isSelected ? "default" : "ghost"}
              disabled={isPast}
              onClick={() => onChange(key)}
              className={cn(
                "size-9 p-0 text-sm font-normal",
                isSelected && "bg-teal text-white hover:bg-teal-dark",
                isToday && !isSelected && "border border-teal text-teal-dark",
              )}
            >
              {fa(day)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}