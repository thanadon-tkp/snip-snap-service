import { Router } from "express";
import { postSignIn, postSignUp, postRefreshToken, postLogout } from "../controllers/authController";
import { getUserByToken } from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/sign_in", postSignIn);
router.post("/sign_up", postSignUp);
router.post("/refresh_token", postRefreshToken);
router.post("/logout", postLogout);

router.get("/get_users", authenticate, getUserByToken);

export default router;
