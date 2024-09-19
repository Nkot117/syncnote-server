import { Request, Response } from "express";
import CryptoJS from "crypto-js";

import User from "../models/userModel.js";
import { sendRegistrationMail } from "../services/mailService.js";

/**
 * ユーザー登録処理
 */
async function registerUser(req: Request, res: Response) {
  const { name, email, password } = req.body;

  try {
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY || ""
    );

    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
      emailVerified: false,
    });

    sendRegistrationMail(email, "token");

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ユーザー登録に失敗しました" });
  }
}

export { registerUser };
