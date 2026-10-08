"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, Check, Loader2 } from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  link: string;
  read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadNotifications() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("notifications")
        .select("id, title, body, link, read, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        setNotifications(data as NotificationItem[]);
      }
      setLoading(false);
    }

    loadNotifications();
  }, [supabase]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAsRead(id: string) {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
        aria-label="Ver notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <span className="font-extrabold text-xs text-slate-800">
              Notificaciones
            </span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-brand-50 text-brand-600 font-bold px-2 py-0.5 rounded-full">
                {unreadCount} sin leer
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1" />
                <span className="text-xs">Cargando...</span>
              </div>
            ) : notifications.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400 italic">
                No tienes notificaciones
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 transition flex items-start justify-between gap-2 ${
                    !n.read ? "bg-brand-50/30" : "bg-white"
                  }`}
                >
                  <Link
                    href={n.link || "#"}
                    onClick={() => {
                      if (!n.read) markAsRead(n.id);
                      setOpen(false);
                    }}
                    className="space-y-0.5 flex-1"
                  >
                    <p className="text-xs font-bold text-slate-900">{n.title}</p>
                    <p className="text-[11px] text-slate-600">{n.body}</p>
                  </Link>

                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(n.id)}
                      className="text-slate-400 hover:text-brand-600 p-1"
                      title="Marcar como leída"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
