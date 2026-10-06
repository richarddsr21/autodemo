import { createStore, get, set, type UseStore } from "idb-keyval";

/**
 * Acesso a IndexedDB via idb-keyval.
 *
 * - Sem IndexedDB (ex.: alguns modos privados) ou com erro: usa memória.
 * - IndexedDB lento ou bloqueado (ex.: outro separador a criar a base de dados):
 *   a operação dá erro ao fim de algum tempo, para o ecrã não ficar preso a
 *   "carregar". Nunca se devolve "vazio" por engano (isso podia levar a gravar
 *   os dados de exemplo por cima dos dados reais); as escritas pendentes
 *   continuam e concluem quando a base de dados responder.
 */

const TEMPO_LIMITE_MS = 10_000;

export class StorageTimeoutError extends Error {
  constructor() {
    super("O armazenamento do navegador não respondeu a tempo.");
    this.name = "StorageTimeoutError";
  }
}

let store: UseStore | null = null;
const memoria = new Map<string, unknown>();
let idbIndisponivel = false;

function getStore(): UseStore | null {
  if (idbIndisponivel || typeof indexedDB === "undefined") return null;
  store ??= createStore("stand-demo", "dados");
  return store;
}

function comTempoLimite<T>(p: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new StorageTimeoutError()), TEMPO_LIMITE_MS);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e: unknown) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

function desativarIdb(e: unknown) {
  if (!idbIndisponivel) console.warn("IndexedDB indisponível; os dados ficam só em memória nesta sessão.", e);
  idbIndisponivel = true;
}

export async function readKey<T>(key: string): Promise<T | undefined> {
  const s = getStore();
  if (s) {
    try {
      return await comTempoLimite(get<T>(key, s));
    } catch (e) {
      if (e instanceof StorageTimeoutError) throw e;
      desativarIdb(e);
    }
  }
  return memoria.get(key) as T | undefined;
}

export async function writeKey<T>(key: string, value: T): Promise<void> {
  const s = getStore();
  if (s) {
    try {
      await comTempoLimite(set(key, value, s));
      return;
    } catch (e) {
      if (e instanceof StorageTimeoutError) throw e;
      desativarIdb(e);
    }
  }
  memoria.set(key, value);
}

export const KEYS = {
  carros: "carros",
  pedidos: "pedidos",
  definicoes: "definicoes",
  versaoSeed: "versao-seed",
} as const;
