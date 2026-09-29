import CheckinView from "@/app/components/qr/CheckinView";

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ seatId: string }>;
}) {
  const { seatId } = await params;
  return <CheckinView seatId={seatId} />;
}