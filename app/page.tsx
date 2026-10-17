import Link from "next/link";
import {
  ArrowRight, ClipboardList, HardHat, Home, ShieldCheck, Sparkles,
} from "lucide-react";

const NAV = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Para profesionales", href: "#profesionales" },
];

const STEPS = [
  {
    icon: Home,
    title: "Describe tu proyecto",
    text: "Cuéntanos qué necesitas en menos de 2 minutos. Gratis y sin compromiso.",
  },
  {
    icon: ClipboardList,
    title: "HATBRA asigna a los mejores",
    text: "Nuestro equipo selecciona y asigna a profesionales verificados para tu obra. Tú no buscas: te buscan a ti.",
  },
  {
    icon: ShieldCheck,
    title: "Compara y decide tranquilo",
    text: "Recibes presupuestos claros de profesionales que HATBRA ya verificó. Eliges con confianza.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* ═══ Barra de anuncio ═══ */}
      <div className="bg-brand-600 px-4 py-2.5 text-center text-xs font-semibold text-white sm:text-sm">
        Presupuesto gratis y sin compromiso — gestiona tu reforma 100% online.
      </div>

      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden">
        {/* Fondo: degradado de marca + grid técnico */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-brand-950/60 via-slate-950 to-slate-950"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_50%_-20%,rgba(249,115,22,0.25),transparent_60%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        />

        {/* Header */}
        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 font-black text-white shadow-sm">
              H
            </span>
            <span className="text-lg font-bold tracking-tight text-white">HATBRA</span>
          </Link>

          {/* Nav píldora — desktop */}
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-slate-300 hover:text-white sm:block"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Empezar gratis
            </Link>
          </div>
        </header>

        {/* Contenido del hero */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-400">
            <ShieldCheck className="h-4 w-4" />
            Profesionales verificados por HATBRA
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Tu reforma, en manos de los{" "}
            <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              profesionales adecuados
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Publica lo que necesitas. HATBRA selecciona y asigna a los profesionales
            verificados para tu obra. Compara presupuestos claros y decide con total tranquilidad.
          </p>

          <div className="mt-10">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-600/30 transition hover:shadow-xl hover:shadow-brand-600/40"
            >
              Solicita tu presupuesto gratis
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Sin compromiso · Respuesta en 24 h · Sin tarjeta de crédito
          </p>
        </div>
      </section>

      {/* ═══ Cómo funciona ═══ */}
      <section id="como-funciona" className="border-t border-white/5 bg-slate-950 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-500">
              <Sparkles className="h-4 w-4" /> Cómo funciona
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Tu hogar transformado en 3 pasos
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              La diferencia de HATBRA: no te lanzamos a un listado de desconocidos.
              Cada profesional llega a tu obra verificado y asignado por nuestro equipo.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-colors hover:border-brand-500/40"
              >
                <span className="absolute right-6 top-5 text-4xl font-black text-white/5">
                  {i + 1}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-200"
            >
              Empezar ahora <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Para profesionales ═══ */}
      <section id="profesionales" className="border-t border-white/5 bg-slate-950 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-950/50 via-slate-900 to-slate-950 p-10 sm:p-14">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl"
            />
            <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400">
                  <HardHat className="h-4 w-4" /> Para profesionales
                </span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
                  Obras listas para ti, sin buscarlas
                </h2>
                <p className="mt-3 text-slate-400">
                  Verificamos tu perfil y te asignamos solicitudes que encajan con tu oficio.
                  Tú solo presupuestas lo que te interesa — nosotros te traemos los clientes.
                </p>
              </div>
              <Link
                href="/register"
                className="shrink-0 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                Únete como profesional <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-white/5 bg-slate-950 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-black text-white">
              H
            </span>
            <span className="text-sm font-bold text-white">HATBRA</span>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 HATBRA · Reformas y construcción · Más verticales próximamente
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <Link href="/login" className="hover:text-slate-300">Iniciar sesión</Link>
            <Link href="/register" className="hover:text-slate-300">Crear cuenta</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}