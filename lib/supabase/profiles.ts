import { cache } from "react";
import { createClient } from "./server";

export interface ProfileRow {
  full_name: string | null;
  role: string;
}

/** Perfil del usuario autenticado, deduplicado por request (layout y pages comparten la llamada). */
export const getProfile = cache(async (): Promise<ProfileRow | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return data ?? null;
});
