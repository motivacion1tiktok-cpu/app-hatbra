import {
  LayoutDashboard, FilePlus2, FileText, MessageSquare, Search, Handshake,
  Users, UserCheck, ShieldAlert, BarChart3, Layers, Wrench,
} from "lucide-react";
import type { NavSection, Role } from "./types";

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Propietario",
  admin: "Administrador",
  client: "Cliente",
  professional: "Profesional",
};

export const NAVIGATION: Record<Role, NavSection[]> = {
  owner: [
    {
      title: "Gestión",
      items: [
        { label: "Resumen", href: "/dashboard", icon: LayoutDashboard, exact: true },
        { label: "Usuarios", href: "/dashboard/usuarios", icon: Users },
        { label: "Validaciones", href: "/dashboard/validaciones", icon: UserCheck },
        { label: "Solicitudes", href: "/dashboard/solicitudes", icon: FileText },
        { label: "Disputas", href: "/dashboard/disputas", icon: ShieldAlert },
      ],
    },
    {
      title: "Core",
      items: [
        { label: "Verticales", href: "/dashboard/verticales", icon: Layers },
        { label: "Analíticas", href: "/dashboard/analiticas", icon: BarChart3 },
      ],
    },
  ],
  admin: [
    {
      title: "Gestión",
      items: [
        { label: "Resumen", href: "/dashboard", icon: LayoutDashboard, exact: true },
        { label: "Usuarios", href: "/dashboard/usuarios", icon: Users },
        { label: "Validaciones", href: "/dashboard/validaciones", icon: UserCheck },
        { label: "Solicitudes", href: "/dashboard/solicitudes", icon: FileText },
      ],
    },
    {
      title: "Moderación",
      items: [
        { label: "Disputas", href: "/dashboard/disputas", icon: ShieldAlert },
        { label: "Analíticas", href: "/dashboard/analiticas", icon: BarChart3 },
      ],
    },
  ],
  client: [
    {
      title: "Principal",
      items: [
        { label: "Inicio", href: "/dashboard", icon: LayoutDashboard, exact: true },
        { label: "Nueva solicitud", href: "/dashboard/solicitudes/nueva", icon: FilePlus2, exact: true },
        { label: "Mis solicitudes", href: "/dashboard/solicitudes", icon: FileText },
        { label: "Presupuestos", href: "/dashboard/presupuestos", icon: Handshake },
        { label: "Mensajes", href: "/dashboard/mensajes", icon: MessageSquare },
      ],
    },
  ],
  professional: [
    {
      title: "Principal",
      items: [
        { label: "Inicio", href: "/dashboard", icon: LayoutDashboard, exact: true },
        { label: "Mis servicios", href: "/dashboard/services", icon: Wrench },
        { label: "Buscar solicitudes", href: "/dashboard/oportunidades", icon: Search },
        { label: "Mis ofertas", href: "/dashboard/ofertas", icon: Handshake },
        { label: "Mensajes", href: "/dashboard/mensajes", icon: MessageSquare },
      ],
    },
  ],
};