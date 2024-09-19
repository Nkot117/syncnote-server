import { Request, Response } from "express";
import CryptoJS from "crypto-js";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../models/userModel.js";
import { sendRegistrationMail } from "../services/mailService.js";

/**
 * ユーザー登録処理
 */
async function registerUser(req: Request, res: Response) {
  console.log("registerUser called");
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

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.TOKEN_SECRET_KEY || "",
      { expiresIn: "24h" }
    );

    sendRegistrationMail(name, email, token, "welcomeEmail");

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ユーザー登録に失敗しました" });
  }
}

/**
 * メールアドレス認証・アカウント有効化処理
 */
async function verifyEmail(req: Request, res: Response) {
  console.log("verifyEmail called");
  const token = req.query.token as string;
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY || "");
  if (!decodedToken) {
    return res.status(400).json({ message: "無効なトークンです" });
  }
  try {
    const { userId, email } = decodedToken as JwtPayload;
    await User.updateOne({ _id: userId, email }, { emailVerified: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "メールアドレス認証に失敗しました" });
  }
}

export { registerUser, verifyEmail };
