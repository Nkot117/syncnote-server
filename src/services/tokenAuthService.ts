import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/userModel.js";
import { Document } from "mongoose";

interface UserDocument extends IUser, Document {}

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}

async function tokenDecode(
  token: string
): Promise<JwtPayload | jwt.TokenExpiredError | null> {
  return new Promise((resolve) => {
    jwt.verify(token, process.env.TOKEN_SECRET_KEY || "", (error, decoded) => {
      console.log(error);
      if (error) {
        if (error instanceof jwt.TokenExpiredError) {
          resolve(error);
        } else {
          resolve(null);
        }
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  console.log("verifyToken called");

  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: "認証に失敗しました" });
  }

  try {
    const token = authorization.split(" ")[1];
    const decodedToken = await tokenDecode(token);

    // ExpiredErrorの場合は、トークン有効期限切れエラーを返す
    // それ以外のエラーの場合は、認証エラーを返す
    if (!decodedToken) {
      return res.status(401).json({ message: "認証に失敗しました" });
    }

    if (decodedToken instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "トークンの有効期限が切れました" });
    }

    const { id } = decodedToken as JwtPayload;
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ message: "認証に失敗しました" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "認証に失敗しました" });
  }
}

function createAccessToken(user: UserDocument) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.TOKEN_SECRET_KEY || "",
    { expiresIn: "24h" }
  );
}

function createRefreshToken(user: UserDocument) {
  return jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET_KEY || "", {
    expiresIn: "7d",
  });
}

export { verifyToken, tokenDecode, createAccessToken, createRefreshToken };
