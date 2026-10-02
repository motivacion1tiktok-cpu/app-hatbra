"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/proyectos");
        }, 2000);
      }
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex flex-col justify-center items-center p-4 font-sans text-[#0F1729]">
      <div className="w-full max-w-md bg-white rounded-[28px] border border-[#E4E7EC] p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Establecer Nueva Contraseña</h1>
          <p className="text-sm text-[#667085] mt-1">
            Ingresa tu nueva contraseña para actualizar el acceso a tu cuenta.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h2 className="font-bold text-emerald-900 text-lg">¡Contraseña actualizada!</h2>
            <p className="text-xs text-emerald-700">
              Tu contraseña se ha cambiado correctamente. Redirigiendo al panel...
            </p>
          </div>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-[#667085]">
                Nueva Contraseña
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

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-[#667085]">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-[#98A2B3] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#F9FAFB] border border-[#D0D5DD] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2456F5] focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2456F5] text-white rounded-xl font-semibold text-sm hover:bg-[#1f48d0] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
                </>
              ) : (
                "Guardar Nueva Contraseña"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}