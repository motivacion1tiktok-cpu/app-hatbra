export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Fail-closed: aborta con error claro si faltan credenciales. */
export function assertSupabaseConfig(): { url: string; anonKey: string } {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "[HATBRA] Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Rellena .env.local y reinicia npm run dev."
    );
  }
  return { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY };
}