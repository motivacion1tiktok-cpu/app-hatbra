import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { WizardForm } from "./WizardForm";

export default async function NuevoProyectoPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Cabecera */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al panel
        </Link>
        <div className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-brand-500" />
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Publicar Nueva Solicitud</h1>
        </div>
        <p className="text-xs text-slate-300">
          Crea tu proyecto en 2 sencillos pasos para empezar a recibir presupuestos de profesionales verificados.
        </p>
      </div>

      {/* Formulario Asistente */}
      <WizardForm />
    </div>
  );
}