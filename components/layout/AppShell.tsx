"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { Role } from "@/types/role";

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string;
  userName?: string;
  userRole?: Role;
}

export function AppShell({
  children,
  userEmail,
  userName,
  userRole = "cliente",
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Menú Lateral dinámico */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={userRole}
      />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userEmail={userEmail}
          userName={userName}
          userRole={userRole}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}