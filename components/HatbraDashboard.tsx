"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  House,
  FilePlus2,
  FolderOpen,
  Handshake,
  MessageSquare,
  ChevronsLeftRight,
  ChevronDown,
  Copy,
  Check,
  Sparkles,
  LogOut,
} from "lucide-react";

const ROUTES = {
  home: "/dashboard",
  nuevo: "/dashboard/nuevo-proyecto",
  proyectos: "/dashboard/proyectos",
  presupuestos: "/dashboard/propuestas",
  mensajes: "/dashboard/notificaciones",
};

const NAV = [
  { label: "Inicio", href: ROUTES.home, icon: House },
  { label: "Nuevo proyecto", href: ROUTES.nuevo, icon: FilePlus2 },
  { label: "Mis proyectos", href: ROUTES.proyectos, icon: FolderOpen },
  { label: "Presupuestos", href: ROUTES.presupuestos, icon: Handshake },
  { label: "Mensajes", href: ROUTES.mensajes, icon: MessageSquare },
];

const PROJECT_TYPES = ["Reformar", "Construir", "Decorar", "Mejorar", "Diseñar", "Mantener"];

const STEPS = [
  { title: "Cuéntanos", text: "Describe qué quieres cambiar y sube fotos." },
  { title: "Visualiza", text: "La IA recrea tu espacio y crea versiones." },
  { title: "Recibe propuestas", text: "Profesionales verificados te presupuestan." },
  { title: "Empieza la obra", text: "Sigue cada avance desde aquí." },
];

const display = "font-[family-name:var(--font-display)]";

type Props = {
  email: string;
  userId: string;
  role: string;
  activeRequests?: number;
  quotes?: number;
  unreadMessages?: number;
  currentStep?: number;
};

export default function HatbraDashboard({
  email,
  userId,
  role,
  activeRequests = 0,
  quotes = 0,
  unreadMessages = 0,
  currentStep = 0,
}: Props) {
  const router = useRouter();
  const name = email ? email.split("@")[0] : "Usuario";

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6F8] font-[family-name:var(--font-body)] text-[#0F1729]">
      <Sidebar email={email} onLogout={handleLogout} />

      <main className="relative flex-1 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60rem_28rem_at_80%_-10%,#DCE5FF,transparent)]"
        />

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 lg:px-10">
          {/* Cabecera limpia con Logout */}
          <header className="mb-8 flex items-center justify-between">
            <p className="text-sm text-[#667085]">Hola, <span className="font-semibold text-[#0F1729]">{name}</span></p>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full border border-[#E4E7EC] bg-white px-3 py-1 text-xs font-medium capitalize text-[#667085] sm:inline">
                Cuenta de {role}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-[#E4E7EC] bg-white px-3 py-1.5 text-xs font-medium text-[#667085] transition hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
              >
                <LogOut className="h-3.5 w-3.5" />
                Salir
              </button>
            </div>
          </header>

          <h1 className={`${display} max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl`}>
            Mira tu espacio terminado antes de mover un mueble.
          </h1>

          {/* Hero */}
          <section className="mt-10 grid gap-5 lg:grid-cols-[1.7fr_1fr]">
            <BeforeAfter />

            <div className="flex flex-col justify-between rounded-[28px] bg-[#0F1729] p-7 text-white">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                  <Sparkles className="h-3.5 w-3.5" /> Visualización con IA
                </span>
                <h2 className={`${display} mt-5 text-2xl font-semibold leading-tight`}>
                  ¿Qué quieres hacer con tu espacio?
                </h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {PROJECT_TYPES.map((t) => (
                    <Link
                      key={t}
                      href={`${ROUTES.nuevo}?tipo=${t.toLowerCase()}`}
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 transition hover:border-white hover:bg-white hover:text-[#0F1729]"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={ROUTES.nuevo}
                className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[#2456F5] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(36,86,245,.8)] transition hover:bg-[#3a68ff]"
              >
                Empezar mi proyecto
              </Link>
            </div>
          </section>

          {/* Resumen */}
          <section
            aria-label="Resumen"
            className="mt-5 grid divide-y divide-[#E4E7EC] rounded-[28px] border border-[#E4E7EC] bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          >
            <Stat
              label="Proyectos activos"
              value={activeRequests}
              empty="Cuando envíes tu primer proyecto, lo verás aquí."
              href={ROUTES.proyectos}
            />
            <Stat
              label="Presupuestos"
              value={quotes}
              empty="Los profesionales te enviarán sus propuestas aquí."
              href={ROUTES.presupuestos}
            />
            <Stat
              label="Mensajes sin leer"
              value={unreadMessages}
              empty="No tienes mensajes pendientes."
              href={ROUTES.mensajes}
            />
          </section>

          {/* Proceso */}
          <section className="mt-5 rounded-[28px] border border-[#E4E7EC] bg-white p-7">
            <h2 className={`${display} text-xl font-semibold`}>Así avanza tu proyecto</h2>
            <ol className="mt-6 grid gap-6 sm:grid-cols-4">
              {STEPS.map((s, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <li key={s.title} className="relative">
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                          done
                            ? "bg-[#2456F5] text-white"
                            : active
                            ? "bg-[#0F1729] text-white ring-4 ring-[#2456F5]/20"
                            : "bg-[#F0F2F5] text-[#667085]"
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" /> : i + 1}
                      </span>
                      <span className="hidden h-px flex-1 bg-[#E4E7EC] sm:block" />
                    </div>
                    <p className="mt-3 font-medium">{s.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#667085]">{s.text}</p>
                  </li>
                );
              })}
            </ol>
          </section>

          <AccountDetails email={email} userId={userId} role={role} />
        </div>
      </main>
    </div>
  );
}

function Sidebar({ email, onLogout }: { email: string; onLogout: () => void }) {
  const name = email ? email.split("@")[0] : "Usuario";

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-[#E4E7EC] bg-white/80 px-4 py-6 backdrop-blur md:flex">
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2456F5] font-bold text-white">
            H
          </span>
          <span className={`${display} text-lg font-semibold tracking-tight`}>HATBRA</span>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ label, href, icon: Icon }, i) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                i === 0
                  ? "bg-[#0F1729] text-white"
                  : "text-[#667085] hover:bg-[#F0F2F5] hover:text-[#0F1729]"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Pie del Sidebar limpio */}
      <div className="border-t border-[#E4E7EC] pt-4 px-2 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0F1729] text-xs font-semibold text-white uppercase">
            {name.charAt(0)}
          </span>
          <p className="text-xs font-medium text-[#0F1729] truncate">{email}</p>
        </div>
      </div>
    </aside>
  );
}

function BeforeAfter() {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative aspect-[16/10] select-none overflow-hidden rounded-[28px] bg-[#0F1729] shadow-[0_30px_60px_-30px_rgba(15,23,41,.5)]">
      <div className="absolute inset-0">
        <Room after />
      </div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Room after={false} />
      </div>

      <span className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur">
        Antes
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-[#0F1729] backdrop-blur">
        Con IA
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-white"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-0 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#0F1729] shadow-xl">
          <ChevronsLeftRight className="h-5 w-5" />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Comparar el espacio antes y después"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

function Room({ after }: { after: boolean }) {
  const wall = after ? "#DCE6FF" : "#D6D3CC";
  const floor = after ? "#B9834F" : "#A9A49B";
  const sofa = after ? "#2456F5" : "#8E8B85";
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <rect width="800" height="500" fill={wall} />
      <rect y="330" width="800" height="170" fill={floor} />
      {after &&
        [370, 410, 450].map((y) => (
          <line key={y} x1="0" x2="800" y1={y} y2={y} stroke="#A06F3F" strokeWidth="2" />
        ))}
      <rect x="90" y="70" width="200" height="180" rx="10" fill={after ? "#FFF3D6" : "#BFC8CE"} />
      <path d="M190 70v180M90 160h200" stroke={after ? "#fff" : "#9AA4AA"} strokeWidth="6" />
      {after && <ellipse cx="540" cy="420" rx="230" ry="40" fill="#F2E8D8" />}
      <rect x="390" y="200" width="300" height="90" rx="26" fill={sofa} opacity=".92" />
      <rect x="370" y="260" width="340" height="100" rx="28" fill={sofa} />
      <path d="M740 140v220" stroke={after ? "#0F1729" : "#6B6A66"} strokeWidth="5" />
      <circle cx="740" cy="130" r="26" fill={after ? "#FFD98A" : "#B7B4AC"} />
      {after && <circle cx="740" cy="130" r="70" fill="#FFD98A" opacity=".25" />}
    </svg>
  );
}

function Stat({ label, value, empty, href }: { label: string; value: number; empty: string; href: string }) {
  return (
    <Link href={href} className="group p-7 transition first:rounded-t-[28px] hover:bg-[#F8F9FB] sm:first:rounded-l-[28px] sm:first:rounded-tr-none sm:last:rounded-r-[28px]">
      <p className="text-sm text-[#667085]">{label}</p>
      <p className={`${display} mt-2 text-5xl font-semibold tracking-tight`}>{value}</p>
      {value === 0 && <p className="mt-2 text-sm leading-relaxed text-[#667085]">{empty}</p>}
    </Link>
  );
}

function AccountDetails({ email, userId, role }: { email: string; userId: string; role: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <details className="group mt-5 rounded-2xl border border-[#E4E7EC] bg-white/70">
      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-sm font-medium text-[#667085] hover:text-[#0F1729]">
        Detalles de la cuenta
        <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
      </summary>
      <dl className="grid gap-4 border-t border-[#E4E7EC] px-6 py-5 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-[#667085]">Correo</dt>
          <dd className="mt-1 break-all font-medium">{email}</dd>
        </div>
        <div>
          <dt className="text-[#667085]">Rol</dt>
          <dd className="mt-1 font-medium capitalize">{role}</dd>
        </div>
        <div>
          <dt className="text-[#667085]">ID de usuario</dt>
          <dd className="mt-1 flex items-center gap-2 font-mono text-xs">
            <span className="truncate">{userId}</span>
            <button
              onClick={copy}
              aria-label="Copiar ID de usuario"
              className="shrink-0 rounded-md p-1.5 text-[#667085] hover:bg-[#F0F2F5] hover:text-[#0F1729]"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </dd>
        </div>
      </dl>
    </details>
  );
}