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

function tokenDecode(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET_KEY || "") as JwtPayload;
  } catch (error) {
    throw new Error("JWT decode failed");
  }
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
  console.log("verifyToken called");
  
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: "認証に失敗しました" });
  }

  try {
    const token = authorization.split(" ")[1];
    const decodedToken = tokenDecode(token);
    console.log(decodedToken);
    if (!decodedToken) {
      return res.status(401).json({ message: "認証に失敗しました" });
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

export { verifyToken, tokenDecode };
