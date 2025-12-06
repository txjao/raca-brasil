import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { pool } from "../db/connection";
import { CreateUserDTO, UpdateUserDTO, UserEntity } from "../model/user";
import {
  CREATE_USER,
  DELETE_USER,
  FIND_BY,
  SEARCH_ALL_USERS,
  UPDATE_USER,
} from "../db/querys/userQuery";

export type UserRow = RowDataPacket & UserEntity;

interface UserRowWithPassword extends UserRow {
  senha: string;
}

export class UserRepository {
  private mapRowToEntity(row: UserRow | UserRowWithPassword): UserEntity {
    return {
      id: row.id,
      nome: row.nome,
      cpf: row.cpf,
      email: row.email,
      role: row.role,
      ativo: Boolean(row.ativo),
    };
  }

  async create(data: CreateUserDTO & { senha: string }): Promise<UserEntity> {
    const [result] = await pool.query<ResultSetHeader>(CREATE_USER, [
      data.nome,
      data.cpf,
      data.email,
      data.senha,
      data.role,
      data.ativo ?? true,
    ]);

    const insertedId = result.insertId;
    const created = await this.findOneBy("id", insertedId);

    if (!created) {
      throw new Error("Falha ao recuperar usuario criado");
    }

    return created;
  }

  async findOneBy<Field extends keyof Omit<UserEntity, "role" | "ativo">>(
    field: Field,
    value: number | string
  ): Promise<UserEntity | null> {
    const [rows] = await pool.query<UserRow[]>(FIND_BY(field), [value]);
    if (rows.length === 0) return null;
    return this.mapRowToEntity(rows[0]);
  }

  async list(): Promise<UserEntity[]> {
    const [rows] = await pool.query<UserRow[]>(SEARCH_ALL_USERS);
    return rows.map((row) => this.mapRowToEntity(row));
  }

  async update(cpf: string, data: UpdateUserDTO & { senha?: string }): Promise<UserEntity | null> {
    const allowedFields: Record<string, keyof UpdateUserDTO> = {
      nome: "nome",
      cpf: "cpf",
      email: "email",
      senha: "senha",
      role: "role",
      ativo: "ativo",
    };

    const fields: string[] = [];
    const values: Array<string | number | boolean> = [];

    for (const [column, key] of Object.entries(allowedFields)) {
      const value = data[key];
      if (value === undefined) continue;

      fields.push(`${column} = ?`);
      values.push(value);
    }

    if (fields.length === 0) {
      return this.findOneBy("cpf", cpf);
    }

    values.push(cpf);

    const [result] = await pool.query<ResultSetHeader>(UPDATE_USER(fields), values);

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findOneBy("cpf", cpf);
  }

  async delete(cpf: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(DELETE_USER, [cpf]);
    return result.affectedRows > 0;
  }
}
