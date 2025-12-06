import { HealthRepository } from "../repository/healthConnection";

export interface DbHealthStatus {
  status: "ok";
  detail: string;
}

export class HealthService {
  constructor(private readonly healthRepository = new HealthRepository()) {}

  async checkDatabase(): Promise<DbHealthStatus> {
    await this.healthRepository.ping();

    return {
      status: "ok",
      detail: "Database reachable",
    };
  }
}
