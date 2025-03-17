import jwt from "jsonwebtoken";
export declare const genAccesssToken: (userId: string, role: string) => string | undefined;
export declare const genRefreshToken: (userId: string, role: string) => string | undefined;
export declare const verifyAccessToken: (token: string) => jwt.JwtPayload;
export declare const verifyRefreshToken: (token: string) => jwt.JwtPayload;
//# sourceMappingURL=jwt.utils.d.ts.map