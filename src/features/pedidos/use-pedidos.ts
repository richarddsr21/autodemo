"use client";

import type { Pedido, PedidoFilter, PedidoInput } from "@/lib/models";
import { useRepoQuery, useRepositories, type QueryState } from "@/lib/repository/provider";

export function usePedidos(filter: PedidoFilter = {}): QueryState<Pedido[]> {
  return useRepoQuery("requests", JSON.stringify(filter), (r) => r.requests.list(filter));
}

export function usePedidoMutations() {
  const { repos, bus } = useRepositories();
  const done = <T>(p: Promise<T>) =>
    p.then((v) => {
      bus.emit("requests");
      return v;
    });
  return {
    create: (input: PedidoInput) => done(repos.requests.create(input)),
    setTratado: (id: string, tratado: boolean) => done(repos.requests.setTratado(id, tratado)),
    remove: (id: string) => done(repos.requests.remove(id)),
  };
}
