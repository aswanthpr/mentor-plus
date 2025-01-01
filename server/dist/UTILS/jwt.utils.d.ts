import jwt from "jsonwebtoken";
export declare const genAccesssToken: (payload: string) => string | undefined;
export declare const genRefreshToken: (payload: string) => string | undefined;
export declare const verifyAccessToken: (token: string) => jwt.JwtPayload | null;
export declare const verifyRefreshToken: (token: string) => jwt.JwtPayload | null;
//# sourceMappingURL=jwt.utils.d.ts.map