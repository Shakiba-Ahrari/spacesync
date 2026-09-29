"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";
import { getSpaces } from "@/api/spaces";
import { usePolling } from "@/hooks/usePolling";
import { useSpaceStore } from "@/store/useSpaceStore";
import SpaceCard from "@/app/components/space/SpaceCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { fa } from "@/lib/utils";

const TYPE_TABS = [
  { value: "all", label: "همه" },
  { value: "study", label: "سالن مطالعه" },
  { value: "sport", label: "سالن ورزشی" },
] as const;

export default function SpacesPage() {
  const {
    setSpaces,
    filteredSpaces,
    typeFilter,
    setTypeFilter,
    availabilityFilter,
    setAvailabilityFilter,
    search,
    setSearch,
  } = useSpaceStore();

  // ظرفیت سالن‌ها هر ۸ ثانیه به‌روز می‌شود
  const { data, loading } = usePolling(getSpaces, 8000);

  useEffect(() => {
    if (data) setSpaces(data);
  }, [data, setSpaces]);

  const spaces = filteredSpaces();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">سالن‌ها</h1>
      <p className="mt-2 text-muted-foreground">
        ظرفیت هر سالن به‌صورت زنده به‌روز می‌شود.
      </p>

      {/* فیلترها */}
      <div className="mt-7 flex flex-col gap-4 md:flex-row md:items-center">
        <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
          <TabsList>
            {TYPE_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Label className="flex cursor-pointer items-center gap-2 text-sm font-normal">
          <Checkbox
            checked={availabilityFilter === "available"}
            onCheckedChange={(checked) =>
              setAvailabilityFilter(checked ? "available" : "all")
            }
          />
          فقط سالن‌هایی که جا دارند
        </Label>

        <div className="relative md:ms-auto md:w-64">
          <Search className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام یا محله"
            className="pe-9"
          />
        </div>
      </div>

      {/* لیست */}
      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : spaces.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">سالنی با این فیلترها پیدا نشد.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            فیلتر نوع سالن را روی «همه» بگذارید یا عبارت جستجو را کوتاه‌تر کنید.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm text-muted-foreground">
            {fa(spaces.length)} سالن
          </p>
          <div className="mt-3 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}