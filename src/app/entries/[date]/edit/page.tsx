import { notFound } from "next/navigation";
import { EditorScreen } from "@/features/editor/components/editor-screen";
import { isIsoDateString } from "@/lib/date";

export const dynamic = "force-dynamic";

type EntryEditPageProps = {
  params: Promise<{
    date: string;
  }>;
};

export default async function EntryEditPage({ params }: EntryEditPageProps) {
  const { date } = await params;

  if (!isIsoDateString(date)) {
    notFound();
  }

  return <EditorScreen entryDate={date} />;
}
