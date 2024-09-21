import { Router } from "express";
import { verifyToken } from "../services/tokenAuthService.js";
import { createMemo, getMemoList } from "../controllers/memoController.js";

const router = Router();

/**
 * メモ新規作成API
 */
router.post("/create", verifyToken, createMemo);

/**
 * メモ一覧取得API
 */
router.get("/list", verifyToken, getMemoList);

export default router;