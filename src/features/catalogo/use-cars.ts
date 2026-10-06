"use client";

import type { Car, CarFilter, CarInput } from "@/lib/models";
import { useRepoQuery, useRepositories, type QueryState } from "@/lib/repository/provider";

export function useCars(filter: CarFilter = {}, initialData?: Car[]): QueryState<Car[]> {
  return useRepoQuery("cars", JSON.stringify(filter), (r) => r.cars.list(filter), initialData);
}

export function useCar(slug: string): QueryState<Car | null> {
  return useRepoQuery("cars", slug, (r) => r.cars.get(slug));
}

export function useCarById(id: string): QueryState<Car | null> {
  return useRepoQuery("cars", `id:${id}`, (r) => r.cars.getById(id));
}

export function useCarMutations() {
  const { repos, bus } = useRepositories();
  const done = <T>(p: Promise<T>) =>
    p.then((v) => {
      bus.emit("cars");
      return v;
    });
  return {
    create: (input: CarInput) => done(repos.cars.create(input)),
    update: (id: string, input: Partial<CarInput>) => done(repos.cars.update(id, input)),
    remove: (id: string) => done(repos.cars.remove(id)),
  };
}
