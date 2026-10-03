"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AcceptQuoteResult {
  ok: boolean;
  error?: string;
}

export async function acceptQuote(quoteId: string): Promise<AcceptQuoteResult> {
  if (!quoteId) return { ok: false, error: "Presupuesto no válido." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_quote", { p_quote_id: quoteId });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/comparador");
  return { ok: true };
}