import type { Car, CarFilter, CarInput, Pedido, PedidoFilter, PedidoInput, Settings } from "@/lib/models";

/**
 * Contratos da camada de dados. Os componentes só conhecem estas interfaces;
 * a implementação concreta (local/IndexedDB hoje, Supabase amanhã) escolhe-se
 * em `createRepositories()`.
 */

export interface CarRepository {
  list(filter?: CarFilter): Promise<Car[]>;
  get(slug: string): Promise<Car | null>;
  getById(id: string): Promise<Car | null>;
  create(input: CarInput): Promise<Car>;
  update(id: string, input: Partial<CarInput>): Promise<Car>;
  remove(id: string): Promise<void>;
}

export interface RequestRepository {
  list(filter?: PedidoFilter): Promise<Pedido[]>;
  create(input: PedidoInput): Promise<Pedido>;
  setTratado(id: string, tratado: boolean): Promise<Pedido>;
  remove(id: string): Promise<void>;
}

export interface SettingsRepository {
  /** Devolve as definições completas (valores guardados sobre os valores por omissão). */
  get(): Promise<Settings>;
  update(input: Partial<Settings>): Promise<Settings>;
}

export interface DataExport {
  exportadoEm: string;
  carros: Car[];
  pedidos: Pedido[];
  definicoes: Settings;
}

/** Operações de manutenção (repor dados de exemplo, exportar). */
export interface MaintenanceRepository {
  resetToSample(): Promise<void>;
  exportAll(): Promise<DataExport>;
}

export interface Repositories {
  cars: CarRepository;
  requests: RequestRepository;
  settings: SettingsRepository;
  maintenance: MaintenanceRepository;
}
