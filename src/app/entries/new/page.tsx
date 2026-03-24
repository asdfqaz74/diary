import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getTodayIsoDate } from "@/lib/date";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NewEntryPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .maybeSingle();
  const entryDate = getTodayIsoDate(profile?.timezone ?? "Asia/Seoul");

  redirect(`/entries/${entryDate}/edit`);
}
