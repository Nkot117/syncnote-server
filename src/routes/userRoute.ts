import { Router } from "express";


import {
  loginUser,
  registerUser,
  verifyEmail,
} from "../controllers/userController.js";
import { validation } from "../middleware/validation.js";
import { userRegisterValidator } from "../validators/userValidator.js";

const router = Router();

/**
 * ユーザー登録API
 */
router.post(
  "/register",
  userRegisterValidator,
  validation,
  registerUser
);

/**
 * メールアドレス認証API
 */
router.get("/verify-email", verifyEmail);

/**
 * ログインAPI
 */
router.post("/login", loginUser);

export default router;
