import dotenv from "dotenv";
import mysql, { PoolOptions } from "mysql2/promise";
import { dbAuth } from "./utils/handleDataBaseConnection";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

dbAuth({
  DB_HOST: DB_HOST ?? "",
  DB_PORT: DB_PORT ?? 3306,
  DB_USER: DB_USER ?? "",
  DB_PASS: DB_PASS ?? "",
  DB_NAME: DB_NAME ?? "",
});

const poolOptions: PoolOptions = {
  host: DB_HOST,
  port: Number(DB_PORT ?? 3306),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "Z",
};

export const pool = mysql.createPool(poolOptions);
