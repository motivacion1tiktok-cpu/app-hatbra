"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .is("read_at", null);
    setUnread(count ?? 0);
    const { data } = await supabase
      .from("notifications")
      .select("id, type, title, body, link, read_at")
      .order("created_at", { ascending: false })
      .limit(8);
    setItems(data ?? []);
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 60_000);
    return () => clearInterval(t);
  }, [refresh]);

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      const ids = items.filter((i) => !i.read_at).map((i) => i.id);
      if (ids.length) {
        await createClient()
          .from("notifications")
          .update({ read_at: new Date().toISOString() })
          .in("id", ids);
      }
      refresh();
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <p className="border-b border-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-900">
            Notificaciones
          </p>
          {items.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">
              Todo tranquilo por aquí
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {items.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.link ?? "/dashboard"}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block px-4 py-3 hover:bg-slate-50",
                      !n.read_at && "bg-brand-50/50"
                    )}
                  >
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    {n.body && <p className="mt-0.5 text-xs text-slate-500">{n.body}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}