import { Router } from "express";
import { verifyToken } from "../services/tokenAuthService.js";
import { createMemo } from "../controllers/memoController.js";

const router = Router();

/**
 * メモ新規作成API
 */
router.post("/create", verifyToken, createMemo);

export default router;