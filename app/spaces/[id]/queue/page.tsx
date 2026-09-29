import { notFound } from "next/navigation";
import { getSpace } from "@/api/spaces";
import QueueView from "@/app/components/booking/QueueView";

export default async function QueuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const space = await getSpace(id);
  if (!space) notFound();

  return <QueueView space={space} />;
}