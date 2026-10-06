import { siteConfig } from "@/config/site";
import { sampleCars } from "@/data/seed";
import type { Car, CarFilter, CarInput, Pedido, PedidoFilter, PedidoInput, Settings } from "@/lib/models";
import { applyCarFilter } from "@/lib/repository/filter";
import type {
  CarRepository,
  DataExport,
  MaintenanceRepository,
  RequestRepository,
  SettingsRepository,
} from "@/lib/repository/types";
import { carSlugBase, newId, uniqueSlug } from "@/lib/slug";
import { KEYS, readKey, writeKey } from "./store";

/** Lê as viaturas; na primeira visita grava os dados de exemplo. */
async function readCars(): Promise<Car[]> {
  const cars = await readKey<Car[]>(KEYS.carros);
  if (cars !== undefined) return cars;
  const seed = sampleCars();
  await writeKey(KEYS.carros, seed);
  return seed;
}

export class LocalCarRepository implements CarRepository {
  async list(filter?: CarFilter): Promise<Car[]> {
    return applyCarFilter(await readCars(), filter);
  }

  async get(slug: string): Promise<Car | null> {
    return (await readCars()).find((c) => c.slug === slug) ?? null;
  }

  async getById(id: string): Promise<Car | null> {
    return (await readCars()).find((c) => c.id === id) ?? null;
  }

  async create(input: CarInput): Promise<Car> {
    const cars = await readCars();
    const car: Car = {
      ...input,
      id: newId(),
      slug: uniqueSlug(carSlugBase(input), cars.map((c) => c.slug)),
      criadoEm: new Date().toISOString(),
    };
    await writeKey(KEYS.carros, [car, ...cars]);
    return car;
  }

  async update(id: string, input: Partial<CarInput>): Promise<Car> {
    const cars = await readCars();
    const atual = cars.find((c) => c.id === id);
    if (!atual) throw new Error("Viatura não encontrada.");
    const merged = { ...atual, ...input };
    const mudouNome =
      merged.marca !== atual.marca ||
      merged.modelo !== atual.modelo ||
      merged.versao !== atual.versao ||
      merged.ano !== atual.ano;
    const car: Car = {
      ...merged,
      slug: mudouNome
        ? uniqueSlug(carSlugBase(merged), cars.filter((c) => c.id !== id).map((c) => c.slug))
        : atual.slug,
    };
    await writeKey(
      KEYS.carros,
      cars.map((c) => (c.id === id ? car : c)),
    );
    return car;
  }

  async remove(id: string): Promise<void> {
    const cars = await readCars();
    await writeKey(
      KEYS.carros,
      cars.filter((c) => c.id !== id),
    );
  }
}

async function readPedidos(): Promise<Pedido[]> {
  return (await readKey<Pedido[]>(KEYS.pedidos)) ?? [];
}

export class LocalRequestRepository implements RequestRepository {
  async list(filter: PedidoFilter = {}): Promise<Pedido[]> {
    return (await readPedidos())
      .filter((p) => (filter.tipo ? p.tipo === filter.tipo : true))
      .filter((p) => (filter.tratado !== undefined ? p.tratado === filter.tratado : true))
      .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
  }

  async create(input: PedidoInput): Promise<Pedido> {
    const pedido: Pedido = { ...input, id: newId(), criadoEm: new Date().toISOString(), tratado: false };
    await writeKey(KEYS.pedidos, [pedido, ...(await readPedidos())]);
    return pedido;
  }

  async setTratado(id: string, tratado: boolean): Promise<Pedido> {
    const pedidos = await readPedidos();
    const atual = pedidos.find((p) => p.id === id);
    if (!atual) throw new Error("Pedido não encontrado.");
    const pedido = { ...atual, tratado };
    await writeKey(
      KEYS.pedidos,
      pedidos.map((p) => (p.id === id ? pedido : p)),
    );
    return pedido;
  }

  async remove(id: string): Promise<void> {
    await writeKey(
      KEYS.pedidos,
      (await readPedidos()).filter((p) => p.id !== id),
    );
  }
}

export class LocalSettingsRepository implements SettingsRepository {
  async get(): Promise<Settings> {
    const guardadas = await readKey<Partial<Settings>>(KEYS.definicoes);
    return { ...siteConfig.defaults, ...guardadas };
  }

  async update(input: Partial<Settings>): Promise<Settings> {
    const guardadas = (await readKey<Partial<Settings>>(KEYS.definicoes)) ?? {};
    const novas = { ...guardadas, ...input };
    await writeKey(KEYS.definicoes, novas);
    return { ...siteConfig.defaults, ...novas };
  }
}

export class LocalMaintenanceRepository implements MaintenanceRepository {
  constructor(private readonly settings: SettingsRepository) {}

  async resetToSample(): Promise<void> {
    await writeKey(KEYS.carros, sampleCars());
    await writeKey(KEYS.pedidos, []);
    await writeKey(KEYS.definicoes, {});
  }

  async exportAll(): Promise<DataExport> {
    return {
      exportadoEm: new Date().toISOString(),
      carros: await readCars(),
      pedidos: await readPedidos(),
      definicoes: await this.settings.get(),
    };
  }
}
