import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profiles";
import { AssignPanel } from "./AssignPanel";

export const metadata = { title: "Asignaciones" };
export const dynamic = "force-dynamic";

export default async function AsignacionesPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "owner" && profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("requests")
    .select("id, title, description, status, category, created_at")
    .order("created_at", { ascending: false })
    .limit(30);

  const { data: pros } = await supabase
    .from("profiles")
    .select("id, full_name, verification_status, is_verified")
    .eq("role", "professional")
    .order("full_name");

  const { data: assignments } = await supabase
    .from("assignments")
    .select("id, request_id, professional_id, status, created_at");

  const verificados = (pros ?? []).filter(
    (p) => p.verification_status === "verified" || p.is_verified === true
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <ClipboardList className="h-6 w-6 text-brand-600" />
          Asignaciones
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Curaduría humana: decide qué profesionales reciben cada solicitud.
        </p>
      </div>

      <AssignPanel
        requests={requests ?? []}
        verificados={verificados}
        assignments={assignments ?? []}
      />
    </div>
  );
}