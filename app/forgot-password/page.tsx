"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const origin = window.location.origin;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${origin}/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
      } else {
        setSent(true);
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
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#667085] hover:text-[#0F1729] transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio de Sesión
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Recuperar Contraseña</h1>
          <p className="text-sm text-[#667085] mt-1">
            Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {sent ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h2 className="font-bold text-emerald-900 text-lg">Correo enviado</h2>
            <p className="text-xs text-emerald-700">
              Hemos enviado un enlace de recuperación a <span className="font-semibold">{email}</span>. Revisa tu bandeja de entrada o la carpeta de spam.
            </p>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2456F5] text-white rounded-xl font-semibold text-sm hover:bg-[#1f48d0] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                </>
              ) : (
                "Enviar Enlace de Recuperación"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
