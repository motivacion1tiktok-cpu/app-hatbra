"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import type { Role } from "../../types/role";
import { getNavForRole } from "@/lib/roles";

export interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  userRole?: Role;
}

export function Sidebar({ open = false, onClose, userRole = "cliente" }: SidebarProps) {
  const pathname = usePathname();
  const items = getNavForRole(userRole);

  return (
    <>
      {/* Backdrop para móviles */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Principal */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out flex flex-col justify-between ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                H
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 tracking-tight text-base leading-none">
                  HATBRA
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 capitalize">
                  {userRole}
                </span>
              </div>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Menú Dinámico según Rol */}
          <nav className="space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Gestión
            </p>
            {items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-brand-50 text-brand-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-brand-600" : "text-slate-400"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}