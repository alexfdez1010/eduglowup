import DashboardOverview from '@/components/dashboard/DashboardOverview';

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { weekSelector: string };
}) {
  const locale = params.locale;
  const weekSelector = parseInt(searchParams.weekSelector) || 0;

  return <DashboardOverview locale={locale} weekSelector={weekSelector} />;
}
