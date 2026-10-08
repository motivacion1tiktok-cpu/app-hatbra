"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CreateRequestResult {
  ok: boolean;
  requestId?: string;
  error?: string;
}

export async function createRequest(formData: {
  title: string;
  category: string;
  description: string;
  estimatedBudget?: number;
}): Promise<CreateRequestResult> {
  const { title, category, description, estimatedBudget } = formData;

  if (!title.trim() || !description.trim()) {
    return { ok: false, error: "El título y la descripción son obligatorios." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "Usuario no autenticado." };
  }

  const { data, error } = await supabase
    .from("requests")
    .insert({
      client_id: user.id,
      title: title.trim(),
      description: `[Categoría: ${category}] ${description.trim()}`,
      status: "published",
      ...(estimatedBudget && estimatedBudget > 0 ? { budget: estimatedBudget } : {}),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error al crear la solicitud:", error);
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/mis-solicitudes");
  revalidatePath("/dashboard/presupuestos");
  revalidatePath("/dashboard/comparador");

  return { ok: true, requestId: data.id };
}
