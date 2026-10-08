"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const supabase = createClient();

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Consultar la tabla de perfiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, email")
        .eq("id", user.id)
        .single();

      if (profile) {
        setRole(profile.role);
        setUserName(profile.full_name || user.email?.split("@")[0] || "Usuario");
      }
    }

    getUserData();
  }, []);

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      {/* ... buscador o elementos de la izquierda ... */}

      <div className="flex items-center gap-4 ml-auto">
        {/* Campana de Notificaciones */}
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
          <span className="sr-only">Notificaciones</span>
          🔔
        </button>

        {/* Badge de Usuario y Rol */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-700">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium text-gray-900">{userName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full w-fit font-medium ${
              role === "pro" || role === "professional" 
                ? "bg-blue-100 text-blue-700" 
                : "bg-green-100 text-green-700"
            }`}>
              {role === "pro" || role === "professional" ? "Profesional" : "Cliente"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}