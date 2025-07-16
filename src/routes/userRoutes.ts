import { Router } from "express";
import { getUserByToken } from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/get_by_token", authenticate, getUserByToken);

export default router;
