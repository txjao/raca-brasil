import { Router } from "express";
import { checkDatabase } from "../controllers/healthController";
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from "../controllers/userController";

const router = Router();

router.get("/health/db", checkDatabase);

router.post("/users", createUser);
router.get("/users", listUsers);
router.get("/users/:cpf", getUser);
router.put("/users/:cpf", updateUser);
router.delete("/users/:cpf", deleteUser);

export default router;
