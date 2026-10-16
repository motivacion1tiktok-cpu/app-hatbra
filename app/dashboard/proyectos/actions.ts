"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteRequestAction(requestId: string) {
  if (!requestId) return { ok: false, error: "ID de solicitud inválido" };
  const supabase = await createClient();

  // 1) Limpia los presupuestos asociados (RLS: quotes_delete para staff)
  await supabase.from("quotes").delete().eq("request_id", requestId);

  // 2) Elimina la solicitud principal (RLS: requests_delete_staff)
  const { error } = await supabase.from("requests").delete().eq("id", requestId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/proyectos");
  revalidatePath("/dashboard/asignaciones");
  return { ok: true };
}