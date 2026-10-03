"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface SubmitQuoteResult {
  ok: boolean;
  error?: string;
}

export async function submitQuote(formData: {
  requestId: string;
  totalAmount: number;
  estimatedDays: number;
  description: string;
}): Promise<SubmitQuoteResult> {
  const { requestId, totalAmount, estimatedDays, description } = formData;

  if (!requestId || !totalAmount || totalAmount <= 0) {
    return { ok: false, error: "Introduce un importe válido." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, error: "Usuario no autenticado." };
  }

  // Obtener nombre del perfil para provider_name si existe
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const providerName = profile?.full_name || user.email || "Profesional HATBRA";

  // Insertar en la tabla quotes de la BD
  const { error } = await supabase.from("quotes").insert({
    request_id: requestId,
    provider_id: user.id,
    user_id: user.id,
    provider_name: providerName,
    total_amount: totalAmount,
    estimated_days: estimatedDays,
    description: description,
    status: "sent",
  });

  if (error) {
    console.error("Error al enviar presupuesto:", error);
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/presupuestos");
  revalidatePath("/dashboard/comparador");
  return { ok: true };
}