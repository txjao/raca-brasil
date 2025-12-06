export type UserRole = "ADMIN" | "PROPRIETARIO" | "FUNCIONARIO_CLIENTE" | "FUNCIONARIO_RACA_BRASIL";

export interface UserEntity {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  role: UserRole;
  ativo: boolean;
}

export interface CreateUserDTO {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  role: UserRole;
  ativo?: boolean;
}

export interface UpdateUserDTO {
  nome?: string;
  cpf?: string;
  email?: string;
  senha?: string;
  role?: UserRole;
  ativo?: boolean;
}
