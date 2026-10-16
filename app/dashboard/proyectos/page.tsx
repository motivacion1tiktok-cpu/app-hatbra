import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Proyectos" };
export const dynamic = "force-dynamic";

export default async function ProyectosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const role = profile?.role ?? "client";
  const isStaff = role === "owner" || role === "admin";

  const { data: requests } = await supabase
    .from("requests")
    .select("id, title, description, status, created_at, client_id")
    .order("created_at", { ascending: false })
    .limit(20);

  // Visualización por rol (RLS ya filtra lo ajeno; esto ordena la vista):
  // - professional: solicitudes publicadas (oportunidades) + las suyas si las hubiera
  // - client: SOLO las suyas
  // - staff: todo
  const visible = (requests ?? []).filter((r) => {
    if (isStaff) return true;
    if (role === "client") return r.client_id === user?.id;
    return r.status === "published" || r.client_id === user?.id;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <FolderKanban className="h-6 w-6 text-brand-600" />
          {role === "client" ? "Mis proyectos" : "Solicitudes"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {role === "client"
            ? "Tus solicitudes publicadas y su estado actual."
            : "Solicitudes publicadas por los clientes. Abre una para emitir tu presupuesto."}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-medium text-slate-900">
            {role === "client"
              ? "Aún no tienes solicitudes"
              : "No hay solicitudes publicadas ahora mismo"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {role === "client"
              ? "Crea la primera desde el panel de inicio."
              : "Vuelve pronto: los clientes publican nuevas obras a diario."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((r) => (
            <Link
              key={r.id}
              href={`/dashboard/proyectos/${r.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  {r.status}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(r.created_at).toLocaleDateString("es-ES")}
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-slate-900">{r.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{r.description}</p>
              <p className="mt-3 text-xs font-semibold text-brand-600">
                Abrir detalle →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
