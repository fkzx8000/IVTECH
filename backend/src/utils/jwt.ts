import { SignJWT, jwtVerify } from "jose";
import { env } from "../config/env.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function signToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
