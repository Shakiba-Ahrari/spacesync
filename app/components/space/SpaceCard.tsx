import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { Space } from "@/schemas";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OccupancyBar from "./OccupancyBar";
import { fa } from "@/lib/utils";

export default function SpaceCard({ space }: { space: Space }) {
  const free = space.totalCapacity - space.currentOccupancy;
  const isFull = free <= 0;

  return (
    <Link href={`/spaces/${space.id}`} className="group block">
      <Card className="h-full rule-top transition-shadow group-hover:shadow-md">
        <CardContent className="flex h-full flex-col pt-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold leading-7">{space.name}</h3>
            <Badge variant="secondary" className="shrink-0">
              {space.type === "study" ? "مطالعه" : "ورزشی"}
            </Badge>
          </div>

          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {space.address}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            {fa(space.openTime)} تا {fa(space.closeTime)}
          </p>

          <div className="mt-5 flex-1" />

          <OccupancyBar
            occupied={space.currentOccupancy}
            total={space.totalCapacity}
          />

          <p className="mt-3 text-sm">
            {isFull ? (
              <span className="font-semibold text-seat-occupied">
                تکمیل — {fa(space.queueLength)} نفر در صف
              </span>
            ) : (
              <span className="font-semibold text-teal-dark">
                {fa(free)} جای خالی از {fa(space.totalCapacity)}
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}