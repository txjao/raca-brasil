interface IDbConnection {
  DB_HOST: string | number;
  DB_PORT: string | number;
  DB_USER: string | number;
  DB_PASS: string | number;
  DB_NAME: string | number;
}

export function dbAuth(conn: IDbConnection) {
  const missing: string[] = [];

  if (!conn.DB_HOST) missing.push("DB_HOST");
  if (!conn.DB_PORT) missing.push("DB_PORT");
  if (!conn.DB_USER) missing.push("DB_USER");
  if (!conn.DB_PASS) missing.push("DB_PASS");
  if (!conn.DB_NAME) missing.push("DB_NAME");

  if (missing.length > 0) {
    throw new Error(`Variáveis de banco ausentes: ${missing.join(", ")}`);
  }
}
