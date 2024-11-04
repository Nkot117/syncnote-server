import { Router } from "express";

import {
  deleteUser,
  loginUser,
  refreshToken,
  registerUser,
  verifyEmail,
} from "../controllers/userController.js";
import { validation } from "../middleware/validation.js";
import { userRegisterValidator } from "../validators/userValidator.js";
import { verifyToken } from "../services/tokenAuthService.js";

const router = Router();

/**
 * ユーザー登録API
 */
router.post("/register", userRegisterValidator, validation, registerUser);

/**
 * メールアドレス認証API
 */
router.get("/verify-email", verifyEmail);

/**
 * ログインAPI
 */
router.post("/login", loginUser);

/**
 * トークンリフレッシュAPI
 */
router.post("/refresh-token", refreshToken);

/**
 * ユーザー削除API
 */
router.delete("/delete", verifyToken, deleteUser);

export default router;
