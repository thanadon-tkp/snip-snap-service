import { Router } from "express";
import {
  getSnippetById,
  getSnippetByUser,
  postCreateSnippet,
  putUpdateSnippet,
  deleteSnippet,
} from "../controllers/snippetController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/all", authenticate, getSnippetByUser);
router.get("/:id", authenticate, getSnippetById);
router.post("/", authenticate, postCreateSnippet);
router.put("/", authenticate, putUpdateSnippet);
router.delete("/:id", authenticate, deleteSnippet);

export default router;
