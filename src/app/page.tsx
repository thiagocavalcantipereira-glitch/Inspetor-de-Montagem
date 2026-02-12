"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = "/dashboard";
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (!email || !password) return setMsg("Informe e-mail e senha.");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMsg(error.message);
      window.location.href = "/dashboard";
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return setMsg(error.message);
      setMsg("Usuário criado. Agora faça login.");
      setMode("login");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-shinerayRed text-white grid place-items-center font-bold">S</div>
          <div>
            <div className="text-lg font-semibold">Inspeção de Montagem</div>
            <div className="text-xs text-neutral-500">Acesso interno Shineray</div>
          </div>
        </div>

        <form className="mt-6 space-y-3" onSubmit={submit}>
          <div>
            <label className="text-sm">E-mail</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Senha</label>
            <input type="password" className="mt-1 w-full rounded-xl border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {msg && <div className="text-sm text-red-600">{msg}</div>}

          <button className="w-full rounded-xl bg-shinerayRed text-white py-2 font-medium">
            {mode === "login" ? "Entrar" : "Criar usuário"}
          </button>

          <button type="button" className="w-full rounded-xl border py-2 text-sm" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "Criar um usuário (Admin)" : "Voltar para login"}
          </button>
        </form>

        <div className="mt-4 text-xs text-neutral-500">
          Dica: crie 1 usuário admin primeiro e depois crie os inspetores.
        </div>
      </div>
    </div>
  );
}
