import { Router } from "express";

import { loginUser, registerUser, verifyEmail } from "../controllers/userController.js";

const router = Router();

/**
 * ユーザー登録API
 */
router.post("/register", registerUser);

/**
 * メールアドレス認証API
 */
router.get("/verify-email", verifyEmail);

/**
 * ログインAPI
 */
router.post("/login", loginUser);

export default router;
