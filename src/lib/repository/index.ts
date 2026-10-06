import {
  LocalCarRepository,
  LocalMaintenanceRepository,
  LocalRequestRepository,
  LocalSettingsRepository,
} from "./local/local-repositories";
import type { Repositories } from "./types";

/**
 * Ponto único onde se escolhe a implementação da camada de dados.
 * Para passar a Supabase basta devolver aqui as implementações Supabase.
 */
export function createRepositories(): Repositories {
  const settings = new LocalSettingsRepository();
  return {
    cars: new LocalCarRepository(),
    requests: new LocalRequestRepository(),
    settings,
    maintenance: new LocalMaintenanceRepository(settings),
  };
}

export type * from "./types";
