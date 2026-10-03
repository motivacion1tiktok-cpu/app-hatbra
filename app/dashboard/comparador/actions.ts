"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function acceptQuoteAction(quoteId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesión no válida o expirada." };
  }

  // Invoca la RPC atómica accept_quote corregida con client_id
  const { error } = await supabase.rpc("accept_quote", {
    p_quote_id: quoteId,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/comparador");
  revalidatePath("/dashboard/proyectos");

  return { success: true };
}