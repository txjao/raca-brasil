import { UserRole } from "../model/user";

const allowedRoles: readonly UserRole[] = [
  "ADMIN",
  "PROPRIETARIO",
  "FUNCIONARIO_CLIENTE",
  "FUNCIONARIO_RACA_BRASIL",
];

export function isValidRole(role: string): role is UserRole {
  return allowedRoles.includes(role as UserRole);
}
