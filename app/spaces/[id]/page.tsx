import { notFound } from "next/navigation";
import { getSpace } from "@/api/spaces";
import SpaceDetailView from "@/app/components/space/SpaceDetailView";

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const space = await getSpace(id);
  if (!space) notFound();

  return <SpaceDetailView space={space} />;
}