import {
  LayoutDashboard,
  Wrench,
  Search,
  Handshake,
  MessageSquare,
  FileText,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles?: string[];
}

export const ROLE_LABELS: Record<string, string> = {
  client: "Cliente",
  professional: "Profesional",
  pro: "Profesional",
  admin: "Administrador",
};

export const NAVIGATION_LINKS: NavItem[] = [
  {
    title: "Inicio",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mis servicios",
    href: "/dashboard/services",
    icon: Wrench,
    roles: ["professional", "pro"],
  },
  {
    title: "Buscar solicitudes",
    href: "/dashboard/proyectos", // Rutado corregido a /dashboard/proyectos (antes /oportunidades)
    icon: Search,
    roles: ["professional", "pro"],
  },
  {
    title: "Mis ofertas",
    href: "/dashboard/ofertas",
    icon: Handshake,
    roles: ["professional", "pro"],
  },
  {
    title: "Mis proyectos",
    href: "/dashboard/proyectos",
    icon: FileText,
    roles: ["client"],
  },
  {
    title: "Mensajes",
    href: "/dashboard/mensajes",
    icon: MessageSquare,
  },
];