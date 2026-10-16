"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface Result { ok: boolean; error?: string }

export async function assignAction(requestId: string, proIds: string[]): Promise<Result> {
  if (!requestId || !proIds?.length) return { ok: false, error: "Faltan datos para asignar." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("assign_request", {
    p_request_id: requestId,
    p_professional_ids: proIds,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/asignaciones");
  return { ok: true };
}

export async function unassignAction(requestId: string, proId: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("unassign_request", {
    p_request_id: requestId,
    p_professional_id: proId,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/asignaciones");
  return { ok: true };
}

export async function deleteRequestAction(id: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("requests").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/asignaciones");
  return { ok: true };
}