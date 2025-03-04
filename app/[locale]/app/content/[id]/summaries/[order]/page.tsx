import SummaryServer from "@/components/summary/SummaryServer";

export default async function Page({
  params,
}: {
  params: { id: string; locale: string; order: string };
}) {
  const contentId = params.id;
  const order = parseInt(params.order);

  return (
    <SummaryServer
      contentId={contentId}
      order={order}
    />
  )
}
