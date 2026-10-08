"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppShellProps {
  children: React.ReactNode;
  /** Rol activo (define navegación del Sidebar y badge del Header). */
  role: string;
  userName: string;
}

export function AppShell({ children, role, userName }: AppShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userName={userName} role={role} onMenuClick={() => setOpen(true)} />
      <Sidebar role={role} open={open} onClose={() => setOpen(false)} />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}