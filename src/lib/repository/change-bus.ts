export type DataChannel = "cars" | "requests" | "settings";

type Listener = () => void;

/**
 * Notifica os componentes quando os dados mudam, para se atualizarem.
 * Usa BroadcastChannel para sincronizar também outros separadores abertos
 * (ex.: painel num separador e site público noutro).
 */
export class ChangeBus {
  private listeners = new Map<DataChannel, Set<Listener>>();
  private broadcast: BroadcastChannel | null = null;

  constructor() {
    if (typeof BroadcastChannel !== "undefined") {
      this.broadcast = new BroadcastChannel("stand-dados");
      this.broadcast.onmessage = (e: MessageEvent<DataChannel>) => this.notify(e.data);
    }
  }

  subscribe(channel: DataChannel, listener: Listener): () => void {
    const set = this.listeners.get(channel) ?? new Set<Listener>();
    set.add(listener);
    this.listeners.set(channel, set);
    return () => set.delete(listener);
  }

  emit(...channels: DataChannel[]): void {
    for (const channel of channels) {
      this.notify(channel);
      this.broadcast?.postMessage(channel);
    }
  }

  private notify(channel: DataChannel): void {
    this.listeners.get(channel)?.forEach((l) => l());
  }
}
