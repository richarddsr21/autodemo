"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";

/*
 * Autenticação de DEMONSTRAÇÃO: credenciais fixas em site.ts e sessão guardada
 * neste navegador. Na versão final é substituída pela autenticação do Supabase
 * (mesma API: useAdminSession / login / logout).
 */

const KEY = "stand-admin-sessao";
const listeners = new Set<() => void>();
let memoria = false;

function read(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return memoria;
  }
}

function write(ativo: boolean) {
  memoria = ativo;
  try {
    if (ativo) window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
  } catch {
    // Sem armazenamento: a sessão fica só em memória.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** `null` enquanto não se sabe (render no servidor), depois true/false. */
export function useAdminSession(): boolean | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export async function login(email: string, password: string): Promise<boolean> {
  const ok =
    email.trim().toLowerCase() === siteConfig.demoLogin.email && password === siteConfig.demoLogin.password;
  if (ok) write(true);
  return ok;
}

export function logout(): void {
  write(false);
}
