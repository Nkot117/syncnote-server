import jwt, { JwtPayload } from "jsonwebtoken";

export function tokenDecode(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET_KEY || "") as JwtPayload;
  } catch (error) {
    throw new Error("JWT decode failed");
  }
} 
