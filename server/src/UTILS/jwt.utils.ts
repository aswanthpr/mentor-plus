import jwt, { JwtPayload } from "jsonwebtoken";

const accessTokenSecret: string | undefined =
  process?.env?.JWT_ACCESS_SECRET || "Thisistheaccesstokenscertkey";
const accessTokenExpiry: string | undefined =
  process?.env?.ACCESS_TOKEN_EXPIRY || "15m";
const refreshTokenScret: string | undefined =
  process?.env?.JWT_REFRESH_SECRET || "Thisistherefreshtokensecret";
const refreshTokenExpiry: string | undefined =
  process?.env?.REFRESH_TOKEN_EXPIRY;

export const genAccesssToken = (payload: string): string | undefined => {
  try {
    return jwt.sign({userId:payload}, accessTokenSecret, {
      expiresIn:accessTokenExpiry,
    });
  } catch (error: any) {
    console.log(
      `\x1b[37m%s\x1b[0m]`,
      `[Error while generating access token ${error.message}`
    );
  }
};

export const genRefreshToken = (payload: string): string | undefined => {
  try {
    return jwt.sign({userId:payload}, refreshTokenScret, {
      expiresIn: refreshTokenExpiry,
    });
  } catch (error: any) {
    console.log(
      `\x1b[37m%s\x1b[0m]`,
      `Error while generating refresh token ${error.message}`
    );
  }
};
