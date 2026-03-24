import {
  saveDraftAction,
  saveDraftChangesAction,
} from "@/features/editor/actions";
import { EditorWorkspace } from "@/features/editor/components/editor-workspace";
import { getEditorData } from "@/features/editor/lib/get-editor-data";

type EditorScreenProps = {
  entryDate?: string;
};

export async function EditorScreen({ entryDate }: EditorScreenProps) {
  const editorData = await getEditorData(entryDate);

  return (
    <main className="px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-[76rem]">
        <EditorWorkspace
          {...editorData}
          saveDraft={saveDraftAction}
          saveDraftChanges={saveDraftChangesAction}
        />
      </div>
    </main>
  );
}
