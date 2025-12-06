import bcrypt from "bcrypt";
import { CreateUserDTO, UpdateUserDTO, UserEntity, UserRole } from "../model/user";
import { UserRepository } from "../repository/userRepository";
import { decryptTransportPayload } from "../utils/passwordCrypto";
import { isValidRole } from "../utils/roleValidation";
import { isEmailValid } from "../utils/emailValidation";

type ServiceErrorCode = "NOT_FOUND" | "CONFLICT" | "VALIDATION";

export class ServiceError extends Error {
  constructor(
    public readonly code: ServiceErrorCode,
    message: string
  ) {
    super(message);
  }
}

const SALT_ROUNDS = 10;

export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  private sanitizeUser(user: UserEntity): UserEntity {
    return user;
  }

  private validateEmail(email: string) {
    if (!isEmailValid(email)) throw new ServiceError("VALIDATION", "Email invalida");
  }

  private validateRole(role: string): asserts role is UserRole {
    if (!isValidRole(role)) throw new ServiceError("VALIDATION", "Role invalida");
  }

  async createUser(data: CreateUserDTO): Promise<UserEntity> {
    this.validateEmail(data.email);
    this.validateRole(data.role);

    const existing = await this.userRepository.findOneBy("cpf", data.cpf);
    if (existing) throw new ServiceError("CONFLICT", "Cpf já cadastrado");

    const plaintext = decryptTransportPayload(data.senha);
    const hashedPassword = await bcrypt.hash(plaintext, SALT_ROUNDS);

    const created = await this.userRepository.create({
      ...data,
      senha: hashedPassword,
      ativo: data.ativo ?? true,
    });
    return this.sanitizeUser(created);
  }

  async listUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository.list();
    return users.map((user) => this.sanitizeUser(user));
  }

  async getUser(cpf: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy("cpf", cpf);
    if (!user) {
      throw new ServiceError("NOT_FOUND", "Usuário não encontrado");
    }
    return this.sanitizeUser(user);
  }

  async updateUser(cpf: string, data: UpdateUserDTO): Promise<UserEntity> {
    if (
      data.nome === undefined &&
      data.email === undefined &&
      data.senha === undefined &&
      data.role === undefined &&
      data.ativo === undefined
    ) {
      throw new ServiceError("VALIDATION", "Nenhum campo para atualizar");
    }

    if (data.email) {
      this.validateEmail(data.email);

      const existing = await this.userRepository.findOneBy("email", data.email);

      if (existing && existing.cpf !== cpf) {
        throw new ServiceError("CONFLICT", "Email já cadastrado");
      }
    }

    if (data.role) {
      this.validateRole(data.role);
    }

    const updatePayload: UpdateUserDTO & { senha?: string } = { ...data };

    if (data.senha) {
      const plaintext = decryptTransportPayload(data.senha);
      updatePayload.senha = await bcrypt.hash(plaintext, SALT_ROUNDS);
    }

    const updated = await this.userRepository.update(cpf, updatePayload);

    if (!updated) throw new ServiceError("NOT_FOUND", "Usuario nao encontrado");

    return this.sanitizeUser(updated);
  }

  async deleteUser(cpf: string): Promise<void> {
    const deleted = await this.userRepository.delete(cpf);
    if (!deleted) {
      throw new ServiceError("NOT_FOUND", "Usuario nao encontrado");
    }
  }
}
