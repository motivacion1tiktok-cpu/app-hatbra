import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-black text-white shadow-sm">
        H
      </span>
      <span className="text-lg font-bold tracking-tight text-slate-900">HATBRA</span>
    </Link>
  );
}
