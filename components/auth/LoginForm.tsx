'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// proxy.ts redirige a /login?next=/ruta. Solo aceptamos rutas internas.
function getSafeNext(): string {
  const next = new URLSearchParams(window.location.search).get('next');
  if (next && next.startsWith('/') && !next.startsWith('//')) return next;
  return '/dashboard';
}

function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) {
    return 'El correo o la contraseña no son correctos.';
  }
  if (m.includes('email not confirmed')) {
    return 'Aún no has confirmado tu correo. Revisa tu bandeja de entrada.';
  }
  if (m.includes('too many requests') || m.includes('rate limit')) {
    return 'Demasiados intentos. Espera un minuto y vuelve a probar.';
  }
  return 'No se pudo iniciar sesión. Inténtalo de nuevo.';
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(translateError(authError.message));
        setLoading(false);
        return;
      }

      router.replace(getSafeNext());
      router.refresh();
    } catch {
      setError('No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.');
      setLoading(false);
    }
  }

  const inputClass =
    'mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3.5 py-2.5 text-[15px] text-stone-900 placeholder:text-stone-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/25';

  return (
    <main className="grid min-h-screen bg-stone-50 lg:grid-cols-[1.05fr_1fr]">
      {/* Panel de marca: solo en pantallas grandes */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-stone-950 p-12 text-stone-100 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-orange-600/20 blur-3xl"
        />
        <span className="relative text-xl font-bold tracking-tight">
          HAT<span className="text-orange-500">BRA</span>
        </span>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight">
            Decide tu reforma antes de empezar.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-stone-400">
            Ve cómo quedará tu espacio, compara presupuestos y elige profesional
            sin perder tiempo ni dinero en materiales.
          </p>
        </div>

        <p className="relative text-sm text-stone-500">
          Reformas, decoración, construcción, jardín y piscinas.
        </p>
      </aside>

      {/* Formulario */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <span className="mb-8 block text-xl font-bold tracking-tight text-stone-900 lg:hidden">
            HAT<span className="text-orange-600">BRA</span>
          </span>

          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
            Inicia sesión
          </h2>
          <p className="mt-1.5 text-[15px] text-stone-600">
            Accede a tus proyectos y presupuestos.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-stone-800">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@correo.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-stone-800">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute inset-y-0 right-0 mt-1.5 rounded-r-lg px-3.5 text-sm font-medium text-stone-500 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600/40"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Entrando…' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-8 text-sm text-stone-600">
            ¿Todavía no tienes cuenta?{' '}
            <Link
              href="/register"
              className="font-semibold text-orange-700 hover:text-orange-800 hover:underline"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
