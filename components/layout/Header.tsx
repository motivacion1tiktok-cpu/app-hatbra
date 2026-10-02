"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/ui/Logo";

interface HeaderProps {
  userName: string;
  onMenuClick: () => void;
}

export function Header({ userName, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const initial = userName?.trim().charAt(0).toUpperCase() || "U";

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Logo className="lg:hidden" />
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="hidden text-sm font-medium text-slate-700 sm:block">
          {userName || "Mi cuenta"}
        </span>
        <button
          onClick={signOut}
          className="ml-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-red-600 transition-colors"
          aria-label="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:block">Salir</span>
        </button>
      </div>
    </header>
  );
}