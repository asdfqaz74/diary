"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function deleteEntryAction(entryDate: string) {
  await requireUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.rpc("delete_entry_for_date", {
    p_entry_date: entryDate,
  });

  if (error) {
    throw error;
  }

  revalidatePath("/");
  revalidatePath("/entries/new");
  revalidatePath(`/entries/${entryDate}`);
  revalidatePath(`/entries/${entryDate}/edit`);

  redirect("/");
}
