import { Request, Response, NextFunction } from "express";
import { logErrorToFile } from "../Config/logger";
export class HttpError extends Error {
    statusCode : number;

    constructor( message: string,statusCode: number=500) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error | HttpError, req: Request, res: Response, next: NextFunction) => {
    logErrorToFile(err); // this log error to error log file
    const statusCode = err instanceof HttpError ? err.statusCode : 500;
    
    console.error(`[${new Date().toISOString()}] ${err.message}`,err.stack);
    
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  };
  
