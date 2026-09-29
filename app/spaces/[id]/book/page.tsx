import { notFound } from "next/navigation";
import { getSpace } from "@/api/spaces";
import BookingForm from "@/app/components/booking/BookingForm";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const space = await getSpace(id);
  if (!space) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">
        رزرو در {space.name}
      </h1>
      <p className="mt-2 text-muted-foreground">
        یک {space.type === "sport" ? "زمین" : "صندلی"} آزاد و بازه‌ی زمانی خود را انتخاب
        کنید.
      </p>
      <BookingForm space={space} />
    </div>
  );
}