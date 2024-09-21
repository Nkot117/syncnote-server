import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/userModel.js";
import { sendRegistrationMail } from "../services/mailService.js";
import { tokenDecode } from "../services/tokenAuthService.js";
import Memo from "../models/memoModel.js";

/**
 * ユーザー登録処理
 */
async function registerUser(req: Request, res: Response) {
  console.log("registerUser called");
  const { name, email, password } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(
      password,
      process.env.SALT_ROUNDS || 10
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

  if (!token) {
    return res.status(400).json({ message: "無効なトークンです" });
  }

  try {
    const decodedToken = tokenDecode(token);
    console.log(decodedToken);
    if (!decodedToken) {
      return res.status(400).json({ message: "無効なトークンです" });
    }

    const { userId, email } = decodedToken as JwtPayload;
    const user = await User.updateOne(
      { _id: userId, email },
      { emailVerified: true }
    );
    console.log(user);
    if (user.modifiedCount === 0) {
      return res.status(400).json({ message: "ユーザーが見つかりません" });
    }

    return res
      .status(200)
      .json({ message: "メールアドレス認証が完了しました" });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ message: "メールアドレス認証に失敗しました" });
  }
}

/**
 * ユーザーログイン処理
 */
async function loginUser(req: Request, res: Response) {
  console.log("loginUser called");

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "ユーザーが見つかりません" });
    }

    if (user.emailVerified === false) {
      return res
        .status(400)
        .json({ message: "メールアドレスが認証されていません" });
    }

    const descriptedPassword = await bcrypt.compare(password, user.password);

    if (descriptedPassword) {
      const { password: _, ...userWithoutPassword } = user.toObject();
      const token = jwt.sign(
        { id: user._id },
        process.env.TOKEN_SECRET_KEY || "",
        { expiresIn: "24h" }
      );

      return res.status(200).json({ userWithoutPassword, token });
    } else {
      return res.status(400).json({ message: "パスワードが違います" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ログインに失敗しました" });
  }
}

/**
 * ユーザー情報の削除処理
 */
async function deleteUser(req: Request, res: Response) {
  console.log("deleteUser called");

  const userId = req.user._id;

  try {
    await Memo.deleteMany({ userId: userId });
    await User.findOneAndDelete({ _id: userId });
    return res.status(200).json({ message: "ユーザー情報を削除しました" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "ユーザー情報の削除に失敗しました" });
  }
}

export { registerUser, verifyEmail, loginUser, deleteUser };
