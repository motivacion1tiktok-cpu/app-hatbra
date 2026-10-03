import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Home,
  PlusCircle,
  FolderKanban,
  GitCompare,
  Briefcase,
  MessageSquare,
  LogOut,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Obtener perfil para conocer el rol
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role || "client";
  const userName = profile?.full_name || user.email?.split("@")[0] || "Usuario";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Lateral */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shadow-sm">
        <div className="space-y-6">
          {/* Logo HATBRA */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center font-extrabold text-white text-lg shadow-sm">
              H
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">HATBRA</span>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {userRole === "professional" ? "Panel Profesional" : "Panel Cliente"}
              </p>
            </div>
          </div>

          {/* Menú Principal */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Principal
            </div>

            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition"
            >
              <Home className="w-4 h-4 text-slate-400" />
              Inicio
            </Link>

            {/* Enlaces para Clientes */}
            <Link
              href="/dashboard/nuevo-proyecto"
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4 text-slate-400" />
              Nueva solicitud
            </Link>

            <Link
              href="/dashboard/comparador"
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition"
            >
              <GitCompare className="w-4 h-4 text-slate-400" />
              Comparador de ofertas
            </Link>

            {/* Enlaces para Profesionales */}
            <Link
              href="/dashboard/presupuestos"
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition"
            >
              <Briefcase className="w-4 h-4 text-slate-400" />
              Oportunidades / Presupuestos
            </Link>

            <Link
              href="/dashboard/mensajes"
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition"
            >
              <MessageSquare className="w-4 h-4 text-slate-400" />
              Mensajes
            </Link>
          </nav>
        </div>

        {/* Footer del Usuario */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{userRole}</p>
            </div>
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              title="Cerrar sesión"
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}