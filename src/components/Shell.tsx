"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/lotes", label: "Lotes" },
  { href: "/importar", label: "Importar Tracking" },
  { href: "/configuracoes", label: "Configurações" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 bg-shinerayBlack text-white flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="text-lg font-semibold">Shineray</div>
          <div className="text-xs text-white/70">Inspeção de Montagem</div>
        </div>
        <nav className="p-2 space-y-1 flex-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={[
                "block rounded-lg px-3 py-2 text-sm",
                pathname?.startsWith(n.href) ? "bg-white/10" : "hover:bg-white/10",
              ].join(" ")}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="text-xs text-white/70">{email}</div>
          <button onClick={signOut} className="mt-2 w-full rounded-lg bg-shinerayRed px-3 py-2 text-sm">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <header className="md:hidden sticky top-0 z-10 bg-shinerayBlack text-white px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">Inspeção</div>
          <button onClick={signOut} className="rounded-lg bg-shinerayRed px-3 py-2 text-sm">
            Sair
          </button>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
