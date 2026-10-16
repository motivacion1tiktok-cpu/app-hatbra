"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteQuoteAction(quoteId: string) {
  if (!quoteId) return { ok: false, error: "ID inválido" };
  const supabase = await createClient();

  const { error } = await supabase.from("quotes").delete().eq("id", quoteId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/proyectos");
  return { ok: true };
}
