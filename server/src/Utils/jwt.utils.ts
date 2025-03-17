import jwt, { JsonWebTokenError, TokenExpiredError, JwtPayload } from "jsonwebtoken";


export const genAccesssToken = (userId: string,role:string): string | undefined => {
  try {
    return jwt.sign({userId,role}, process?.env?.JWT_ACCESS_SECRET as string, {
      expiresIn:'1m',
    });
  } catch (error: unknown) {
    console.log(
      `\x1b[37m%s\x1b[0m]`,
      `[Error while generating access token ${error instanceof Error?error.message:String(error)}`
    );
  }
};

export const genRefreshToken = (userId: string,role:string): string | undefined => {
  try {
    return jwt.sign({userId,role}, process?.env?.JWT_REFRESH_SECRET as string, {
      expiresIn:"14d",
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
    if (error instanceof TokenExpiredError) {
      return { isValid: false, error: "TokenExpired" }; 
    }
    if (error instanceof JsonWebTokenError) {
      return { isValid: false, error: "TamperedToken" }; 
    }

    console.error(`Unexpected error during token verification:`, String(error));
    return { isValid: false, error: "UnknownError" };
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
    if (error instanceof TokenExpiredError) {
      return { isValid: false, error: "TokenExpired" }; 
    }
    if (error instanceof JsonWebTokenError) {
      return { isValid: false, error: "TamperedToken" }; 
    }

    console.error(`Unexpected error during token verification:`, String(error));
    return { isValid: false, error: "UnknownError" };

  }
};
