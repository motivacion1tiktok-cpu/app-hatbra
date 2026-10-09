"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { ROLES, type Role } from "@/lib/types";
import { NAVIGATION_LINKS as NAVIGATION, ROLE_LABELS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

interface SidebarProps {
  role?: Role;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ role = ROLES.CLIENT, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Filtrar los enlaces del menú según el rol del usuario autenticado
  const filteredNav = NAVIGATION.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });

  return (
    <>
      {/* Overlay para pantallas móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Contenedor principal del Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Cabecera del Sidebar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <Logo />
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Lista de Navegación */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Principal
          </p>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
                  isActive
                    ? "bg-brand-50 text-brand-600 font-bold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-brand-600" : "text-slate-400")} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

        {/* Pie del Sidebar: Indicador de Rol */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200/60 shadow-xs flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Rol Activo
            </span>
            <span className="text-xs font-bold text-brand-600 capitalize">
              {ROLE_LABELS[role] || role}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}