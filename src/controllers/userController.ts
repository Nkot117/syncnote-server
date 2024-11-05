import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/userModel.js";
import { sendRegistrationMail } from "../services/mailService.js";
import {
  createAccessToken,
  createRefreshToken,
  tokenDecode,
} from "../services/tokenAuthService.js";
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

    const { password: _, ...userWithoutPassword } = user.toObject();
    return res.status(200).json({ userWithoutPassword });
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
    const decodedToken = await tokenDecode(token);
    if (!decodedToken) {
      return res.status(400).json({ message: "無効なトークンです" });
    }

    const { userId, email } = decodedToken as JwtPayload;
    const user = await User.updateOne(
      { _id: userId, email },
      { emailVerified: true }
    );
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
      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);

      return res
        .status(200)
        .json({ userWithoutPassword, accessToken, refreshToken });
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

async function refreshToken(req: Request, res: Response) {
  console.log("refreshToken called");

  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "リフレッシュトークンが必要です" });
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET_KEY || ""
    );

    if (!decodedToken) {
      return res
        .status(400)
        .json({ message: "リフレッシュトークンが無効です" });
    }

    const { id } = decodedToken as JwtPayload;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "ユーザーが見つかりません" });
    }

    const accessToken = createAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "リフレッシュトークンの更新に失敗しました" });
  }
}

export { registerUser, verifyEmail, loginUser, deleteUser, refreshToken };
