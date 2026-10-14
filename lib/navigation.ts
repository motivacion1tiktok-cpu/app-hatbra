import {
  LayoutDashboard, FilePlus2, FolderKanban, Handshake,
  MessageSquare, UserCheck, Wrench,
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
        { label: "Validaciones", href: "/dashboard/validations", icon: UserCheck },
        { label: "Proyectos", href: "/dashboard/proyectos", icon: FolderKanban },
      ],
    },
  ],
  admin: [
    {
      title: "Gestión",
      items: [
        { label: "Resumen", href: "/dashboard", icon: LayoutDashboard, exact: true },
        { label: "Validaciones", href: "/dashboard/validations", icon: UserCheck },
        { label: "Proyectos", href: "/dashboard/proyectos", icon: FolderKanban },
      ],
    },
  ],
  client: [
    {
      title: "Principal",
      items: [
        { label: "Inicio", href: "/dashboard", icon: LayoutDashboard, exact: true },
        { label: "Nueva solicitud", href: "/dashboard/nuevo-proyecto", icon: FilePlus2, exact: true },
        { label: "Mis proyectos", href: "/dashboard/proyectos", icon: FolderKanban },
        { label: "Presupuestos", href: "/dashboard/comparador", icon: Handshake },
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
        { label: "Mis ofertas", href: "/dashboard/propuestas", icon: Handshake },
        { label: "Mensajes", href: "/dashboard/mensajes", icon: MessageSquare },
      ],
    },
  ],
};