import { Router } from "express";

const router = Router();

router.get("/hello-world", (req, res) => {
  res.status(200).json({ status: "ok!" });
});

export default router;
