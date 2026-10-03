import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profiles";
import { redirect } from "next/navigation";
import Link from "next/link";
import { NAVIGATION, ROLE_LABELS, Role } from "@/app/dashboard/navigation";
import { LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

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
    redirect("/login");
  }

  // Obtener perfil del usuario
  const profile = await getProfile();

  const userRole: Role = (profile?.role as Role) || "client";
  const userName = profile?.full_name?.trim() || user.email?.split("@")[0] || "Usuario";

  // Obtener la navegación según el rol
  const sections = NAVIGATION[userRole] || NAVIGATION["client"];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Lateral */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shadow-sm min-h-screen">
        <div className="space-y-6">
          {/* Logo HATBRA */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center font-extrabold text-white text-lg shadow-sm">
              H
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">HATBRA</span>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                {ROLE_LABELS[userRole] || "Cliente"}
              </p>
            </div>
          </div>

          {/* Menú Principal */}
          <nav className="space-y-4">
            {sections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-xl transition"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
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