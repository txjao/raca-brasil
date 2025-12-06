import { Request, Response } from "express";
import { CreateUserDTO, UpdateUserDTO } from "../model/user";
import { ServiceError, UserService } from "../service/userService";

const userService = new UserService();

function mapErrorToStatus(error: ServiceError): number {
  if (error.code === "NOT_FOUND") return 404;
  if (error.code === "CONFLICT") return 409;
  return 400;
}

export async function createUser(req: Request, res: Response) {
  try {
    const body = req.body as CreateUserDTO;
    const user = await userService.createUser(body);

    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof ServiceError) {
      return res.status(mapErrorToStatus(error)).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno ao criar usuario" });
  }
}

export async function listUsers(req: Request, res: Response) {
  try {
    const users = await userService.listUsers();

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno ao listar usuarios", error });
  }
}

export async function getUser(req: Request, res: Response) {
  const cpf = req.params.cpf;

  if (!cpf) {
    return res.status(400).json({ message: "CPF invalido" });
  }

  try {
    const user = await userService.getUser(cpf);

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof ServiceError) {
      return res.status(mapErrorToStatus(error)).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno ao buscar usuario" });
  }
}

export async function updateUser(req: Request, res: Response) {
  const cpf = req.params.cpf;
  if (!cpf) {
    return res.status(400).json({ message: "CPF invalido" });
  }

  try {
    const body = req.body as UpdateUserDTO;
    const user = await userService.updateUser(cpf, body);

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof ServiceError) {
      return res.status(mapErrorToStatus(error)).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno ao atualizar usuario" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const cpf = req.params.cpf;
  if (!cpf) {
    return res.status(400).json({ message: "CPF invalido" });
  }

  try {
    await userService.deleteUser(cpf);

    return res.status(204).send();
  } catch (error) {
    if (error instanceof ServiceError) {
      return res.status(mapErrorToStatus(error)).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno ao remover usuario" });
  }
}
