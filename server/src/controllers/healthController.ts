import { Request, Response } from "express";
import { HealthService } from "../service/healthService";

const healthService = new HealthService();

export async function checkDatabase(req: Request, res: Response) {
  try {
    const result = await healthService.checkDatabase();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(503).json({
      status: "error",
      message: "Database unreachable",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
