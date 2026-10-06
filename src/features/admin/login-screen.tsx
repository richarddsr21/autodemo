"use client";

import { Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { login } from "./auth";

const inputDark =
  "h-12 w-full rounded-xl border border-line bg-surface-2 px-4 text-text placeholder:text-muted focus:border-gold focus:outline-none";

export function LoginScreen() {
  const [email, setEmail] = useState<string>(siteConfig.demoLogin.email);
  const [password, setPassword] = useState<string>(siteConfig.demoLogin.password);
  const [mostrar, setMostrar] = useState(false);
  const [erro, setErro] = useState("");
  const [aEntrar, setAEntrar] = useState(false);

  const entrar = async (e: FormEvent) => {
    e.preventDefault();
    setAEntrar(true);
    const ok = await login(email, password);
    setAEntrar(false);
    if (!ok) setErro("E-mail ou palavra-passe incorretos.");
  };

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <p className="bg-gold px-4 py-2 text-center text-sm font-semibold text-on-gold">
        Versão de demonstração · os dados ficam guardados apenas neste navegador
      </p>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            <Image src={siteConfig.logo} alt="" width={72} height={72} className="rounded-2xl ring-1 ring-gold/30" />
            <h1 className="mt-6 text-3xl font-semibold">Painel do stand</h1>
            <p className="mt-2 text-muted">Entre para gerir as viaturas e os pedidos.</p>
          </div>

          <form onSubmit={entrar} className="mt-8 space-y-4 rounded-2xl border border-line bg-surface p-6 sm:p-8" noValidate>
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium">
                E-mail
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputDark}
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium">
                Palavra-passe
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={mostrar ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputDark} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setMostrar((v) => !v)}
                  aria-label={mostrar ? "Esconder palavra-passe" : "Mostrar palavra-passe"}
                  className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:text-text"
                >
                  {mostrar ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                </button>
              </div>
            </div>
            {erro && (
              <p role="alert" className="rounded-lg bg-red-950/60 px-3 py-2 text-sm text-red-200">
                {erro}
              </p>
            )}
            <button type="submit" disabled={aEntrar} className={buttonClass("primary", "lg", "w-full")}>
              <LogIn className="size-5" aria-hidden="true" />
              Entrar
            </button>
            <p className="text-center text-xs text-muted">
              Demonstração: os dados de acesso já estão preenchidos.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
