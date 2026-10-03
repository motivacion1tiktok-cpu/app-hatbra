import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AllowedRole = "client" | "professional" | "admin" | "owner";

export async function getCurrentUserRole(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Consultar el rol en la tabla de perfiles/usuarios
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role || "client";
}

export async function requireRole(allowedRoles: AllowedRole[]) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const role = await getCurrentUserRole();

  if (!role || !allowedRoles.includes(role as AllowedRole)) {
    redirect("/dashboard?error=unauthorized");
  }

  return { user, role };
}