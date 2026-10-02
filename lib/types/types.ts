import type { LucideIcon } from "lucide-react";

export type Role = "owner" | "admin" | "client" | "professional";
export const ROLES: Role[] = ["owner", "admin", "client", "professional"];
export type ProfessionalStatus = "pending" | "verified" | "rejected";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}