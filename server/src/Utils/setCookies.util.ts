
import { Response } from "express";

/**
 * Helper function to set refresh token cookie
 */
export function setCookie(res: Response, refreshToken: string) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // false in dev
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRY || "0", 10),
    path: "/",
  });
  return res; 
}