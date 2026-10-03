"use client";

import { NotificationBell } from "@/components/layout/NotificationBell";
import { User, ShieldCheck, Menu } from "lucide-react";
import type { Role } from "../../types/role";

export interface HeaderProps {
  userEmail?: string;
  userName?: string;
  userRole?: Role;
  onMenuClick?: () => void;
}

export function Header({
  userEmail,
  userName,
  userRole = "cliente",
  onMenuClick,
}: HeaderProps) {
  const displayName = userName || userEmail || "Usuario";

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Botón de menú móvil + Título */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="font-extrabold text-base text-slate-900 tracking-tight">
            HATBRA
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-50 text-brand-600 border border-brand-200/60">
            Panel
          </span>
        </div>
      </div>

      {/* Zona derecha: Notificaciones + Perfil */}
      <div className="flex items-center gap-3">
        {/* 🔔 CAMPANA DE NOTIFICACIONES */}
        <NotificationBell />

        {/* Separador vertical */}
        <div className="h-5 w-[1px] bg-slate-200 my-auto" />

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[140px]">
              {displayName}
            </p>
            <p className="text-[10px] font-medium text-slate-400 capitalize flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              {userRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}