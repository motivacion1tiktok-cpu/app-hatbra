"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION, ROLE_LABELS, Role } from "@/app/dashboard/navigation";

const ROLES: Role[] = ["owner", "admin", "client", "professional"];

interface SidebarProps {
  role: Role;
  userName?: string;
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ role, userName, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  // Defensa: rol inesperado -> nav de client. La seguridad vive en RLS/proxy.
  const roleKey: Role = (ROLES as string[]).includes(role) ? (role as Role) : "client";
  const sections = NAVIGATION[roleKey];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shadow-sm min-h-screen">
      <div className="space-y-6">
        {/* Logo corporativo HATBRA */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center font-extrabold text-white text-lg shadow-sm">
            H
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">HATBRA</span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {ROLE_LABELS[roleKey]}
            </p>
          </div>
        </div>

        {/* Mapeo dinámico de secciones según el rol */}
        <nav className="space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition ${
                      isActive
                        ? "bg-brand-50 text-brand-600 font-extrabold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-600" : "text-slate-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}