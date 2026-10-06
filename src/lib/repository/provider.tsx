"use client";

import { createContext, useContext, useEffect, useEffectEvent, useState, type ReactNode } from "react";
import { ChangeBus, type DataChannel } from "./change-bus";
import { createRepositories } from "./index";
import type { Repositories } from "./types";

interface RepositoryContextValue {
  repos: Repositories;
  bus: ChangeBus;
}

const RepositoryContext = createContext<RepositoryContextValue | null>(null);

export function RepositoryProvider({ children }: { children: ReactNode }) {
  const [value] = useState<RepositoryContextValue>(() => ({ repos: createRepositories(), bus: new ChangeBus() }));
  return <RepositoryContext value={value}>{children}</RepositoryContext>;
}

export function useRepositories(): RepositoryContextValue {
  const ctx = useContext(RepositoryContext);
  if (!ctx) throw new Error("useRepositories tem de ser usado dentro de <RepositoryProvider>.");
  return ctx;
}

export interface QueryState<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
}

/**
 * Lê dados de um repositório e volta a ler sempre que o canal muda.
 * `key` identifica a consulta (ex.: filtro serializado).
 */
export function useRepoQuery<T>(
  channel: DataChannel,
  key: string,
  load: (repos: Repositories) => Promise<T>,
  /** Dados gerados no servidor, mostrados até chegarem os dados locais. */
  initialData?: T,
): QueryState<T> {
  const { repos, bus } = useRepositories();
  const [state, setState] = useState<{ key: string | null; data?: T; error?: Error }>(() => ({
    key: initialData !== undefined ? key : null,
    data: initialData,
  }));
  const run = useEffectEvent(() => load(repos));

  useEffect(() => {
    let ativo = true;
    const carregar = () => {
      run().then(
        (data) => ativo && setState({ key, data }),
        (e: unknown) =>
          ativo && setState((s) => ({ key, data: s.data, error: e instanceof Error ? e : new Error(String(e)) })),
      );
    };
    carregar();
    const unsubscribe = bus.subscribe(channel, carregar);
    return () => {
      ativo = false;
      unsubscribe();
    };
  }, [bus, channel, key]);

  return { data: state.data, loading: state.key !== key, error: state.error ?? null };
}
