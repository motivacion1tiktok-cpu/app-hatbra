"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        router.push("/dashboard/proyectos");
      }
    } catch (err: any) {
      setError("Ocurrió un error inesperado al registrar la cuenta.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-center items-center p-4 font-sans text-[#0F1729]">
      <div className="w-full max-w-md bg-white rounded-[28px] border border-[#E4E7EC] p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#2456F5] rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto shadow-md">
            H
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Crear cuenta en HATBRA</h1>
          <p className="text-sm text-[#667085]">
            Regístrate para solicitar y gestionar tus presupuestos
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-[#667085]">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre y Apellidos"
                required
                className="w-full bg-[#F9FAFB] border border-[#D0D5DD] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2456F5] focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-[#667085]">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full bg-[#F9FAFB] border border-[#D0D5DD] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2456F5] focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-[#667085]">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#F9FAFB] border border-[#D0D5DD] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2456F5] focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2456F5] text-white rounded-xl font-semibold text-sm hover:bg-[#1f48d0] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Registrando...
              </>
            ) : (
              <>
                Registrarme ahora <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#F2F4F7] text-center">
          <p className="text-sm text-[#667085]">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="text-[#2456F5] font-bold hover:underline ml-1"
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}