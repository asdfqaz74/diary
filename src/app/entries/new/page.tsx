import { EditorScreen } from "@/features/editor/components/editor-screen";

export const dynamic = "force-dynamic";

export default async function NewEntryPage() {
  return await EditorScreen();
}
