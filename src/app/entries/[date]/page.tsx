import { notFound } from "next/navigation";
import { deleteEntryAction } from "@/features/entries/actions";
import { EntryDetailScreen } from "@/features/entries/components/entry-detail-screen";
import { getEntryDetailData } from "@/features/entries/lib/get-entry-detail-data";
import { isIsoDateString } from "@/lib/date";

export const dynamic = "force-dynamic";

type EntryDetailPageProps = {
  params: Promise<{
    date: string;
  }>;
};

export default async function EntryDetailPage({
  params,
}: EntryDetailPageProps) {
  const { date } = await params;

  if (!isIsoDateString(date)) {
    notFound();
  }

  const data = await getEntryDetailData(date);
  const deleteAction = deleteEntryAction.bind(null, date);

  return <EntryDetailScreen data={data} deleteAction={deleteAction} />;
}
