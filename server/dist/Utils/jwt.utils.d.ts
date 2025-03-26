import jwt from "jsonwebtoken";
export declare const genAccesssToken: (userId: string, role: string) => string | undefined;
export declare const genRefreshToken: (userId: string, role: string) => string | undefined;
export declare const verifyAccessToken: (token: string, user: string) => {
    result: jwt.JwtPayload;
    isValid: boolean;
    error?: undefined;
} | {
    isValid: boolean;
    error: string;
    result?: undefined;
};
export declare const verifyRefreshToken: (token: string, user: string) => {
    result: jwt.JwtPayload;
    isValid: boolean;
    error?: undefined;
} | {
    isValid: boolean;
    error: string;
    result?: undefined;
};
//# sourceMappingURL=jwt.utils.d.ts.map