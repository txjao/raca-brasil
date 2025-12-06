import { pool } from "../db/connection";

export class HealthRepository {
  async ping(): Promise<void> {
    const connection = await pool.getConnection();

    try {
      await connection.query("SELECT 1");
    } finally {
      connection.release();
    }
  }
}
