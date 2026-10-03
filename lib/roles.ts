import type React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  Users,
  FolderKanban,
  FilePlus,
  MessageSquare,
  Settings,
} from "lucide-react";
import type { Role } from "../types/role";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Resumen",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["cliente", "propietario", "profesional", "admin"],
  },
  {
    label: "Comparador",
    href: "/dashboard/comparador",
    icon: ClipboardList,
    roles: ["cliente", "propietario", "admin"],
  },
  {
    label: "Proyectos",
    href: "/dashboard/proyectos",
    icon: FolderKanban,
    roles: ["cliente", "propietario", "profesional", "admin"],
  },
  {
    label: "Validaciones",
    href: "/dashboard/validaciones",
    icon: CheckSquare,
    roles: ["admin"],
  },
  {
    label: "Usuarios",
    href: "/dashboard/usuarios",
    icon: Users,
    roles: ["admin"],
  },
];

export function getNavForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}