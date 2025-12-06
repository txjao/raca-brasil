import { UserEntity } from "../../model/user";

const TABLE_NAME = "user";

export const CREATE_USER = `
  INSERT INTO ${TABLE_NAME} (nome, cpf, email, senha, role, ativo)
  VALUES (?, ?, ?, ?, ?, ?)
`;

export const FIND_BY = (field: keyof Omit<UserEntity, "role" | "ativo">) => `
  SELECT id, nome, cpf, email, role, ativo
  FROM ${TABLE_NAME}
  WHERE ${field} = ?
  LIMIT 1
`;

export const SEARCH_ALL_USERS = `
  SELECT id, nome, cpf, email, role, ativo
  FROM ${TABLE_NAME}
  ORDER BY id DESC
`;

export const UPDATE_USER = (fields: string[]) =>
  `UPDATE ${TABLE_NAME} SET ${fields.join(", ")} WHERE id = ?`;

export const DELETE_USER = `DELETE FROM ${TABLE_NAME} WHERE id = ?`;
