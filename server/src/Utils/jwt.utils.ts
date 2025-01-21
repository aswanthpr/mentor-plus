import jwt, { JwtPayload } from "jsonwebtoken";


export const genAccesssToken = (payload: string): string | undefined => {
  try {
    return jwt.sign({userId:payload}, process?.env?.JWT_ACCESS_SECRET as string, {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY as string,
    });
  } catch (error: unknown) {
    console.log(
      `\x1b[37m%s\x1b[0m]`,
      `[Error while generating access token ${error instanceof Error?error.message:String(error)}`
    );
  }
};

export const genRefreshToken = (payload: string): string | undefined => {
  try {
    return jwt.sign({userId:payload}, process?.env?.JWT_REFRESH_SECRET as string, {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY as string,
    });
  } catch (error: unknown) {
    console.log(
      `\x1b[34m%s\x1b[0m]`,
      `Error while generating refresh token ${error instanceof Error?error.message:String(error)}`
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
      `\x1b[35m%s\x1b[0m]`,
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
      `\x1b[36m%s\x1b[0m]`,
      `Error while verifying refresh token ${error instanceof Error ? error.message : String(error)}`
    );
    return null;
  }
};
