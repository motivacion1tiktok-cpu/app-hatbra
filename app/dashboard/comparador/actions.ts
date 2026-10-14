"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AcceptQuoteResult {
  ok: boolean;
  error?: string;
}

/** Única vía de aceptación: RPC atómica en BD (valida dueño, rechaza resto, mueve request). */
export async function acceptQuote(quoteId: string): Promise<AcceptQuoteResult> {
  if (!quoteId) {
    return { ok: false, error: "Presupuesto no válido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_quote", { p_quote_id: quoteId });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/comparador");
  revalidatePath("/dashboard/proyectos");
  return { ok: true };
}

/** Alias de compatibilidad */
export const acceptQuoteAction = acceptQuote;
