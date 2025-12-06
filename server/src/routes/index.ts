import { Router } from "express";
import { checkDatabase } from "../controllers/healthController";

const router = Router();

router.get("/hello-world", (req, res) => {
  res.status(200).json({ status: "ok!" });
});

router.get("/health/db", checkDatabase);

export default router;
