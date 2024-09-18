import { Router } from "express";

import { registerUser } from "../controllers/userController.js";

const router = Router();

/**
 * ユーザー登録API
 */
router.post("/register", registerUser);

export default router;