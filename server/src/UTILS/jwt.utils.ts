import jwt, { JwtPayload } from "jsonwebtoken";

const accessTokenSecret: string | undefined =
  process?.env?.JWT_ACCESS_SECRET || "Thisistheaccesstokenscertkey";
const accessTokenExpiry: string | undefined =
  process?.env?.ACCESS_TOKEN_EXPIRY ;
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

export const verifyAccessToken=(token:string)=>{
  try {
   return  jwt.verify(
    token,
      process.env?.JWT_ACCESS_SECRET as string 
    ) as JwtPayload
  } catch (error:unknown) {
    console.log(
      `\x1b[37m%s\x1b[0m]`,
      `Error while verifying access token ${error instanceof Error? error.message:String(error)}`
    );
    return null;
  }
}


export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(
      token,
      process.env?.JWT_REFRESH_SECRET as string
    ) as JwtPayload;
  } catch (error: unknown) {
    console.log(
      `\x1b[37m%s\x1b[0m]`,
      `Error while verifying refresh token ${error instanceof Error ? error.message : String(error)}`
    );
    return null; // Explicitly return null to indicate the error.
  }
};
