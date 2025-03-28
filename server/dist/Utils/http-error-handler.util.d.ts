import { Request, Response, NextFunction } from "express";
export declare class HttpError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare const errorHandler: (err: Error | HttpError, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=http-error-handler.util.d.ts.map