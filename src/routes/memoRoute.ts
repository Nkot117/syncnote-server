import { Router } from "express";
import { verifyToken } from "../services/tokenAuthService.js";
import { createMemo, deleteMemo, getMemo, getMemoList, updateMemo } from "../controllers/memoController.js";

const router = Router();

/**
 * メモ新規作成API
 */
router.post("/create", verifyToken, createMemo);

/**
 * メモ一覧取得API
 */
router.get("/list", verifyToken, getMemoList);

/**
 * メモ１件取得API
 */
router.get("/:id", verifyToken, getMemo);

/**
 * メモ更新API
 */
router.patch("/:id", verifyToken, updateMemo);

/**
 * メモ削除API
 */
router.delete("/:id", verifyToken, deleteMemo);

export default router;