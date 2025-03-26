import { CorsOptions } from "cors";
import express, { Response, Request } from "express";
import { NextFunction } from "connect";
export declare const corsOptions: CorsOptions;
export declare const corsConfig: CorsOptions;
export declare const limiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const compress: express.RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const sessionConfig: express.RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const jsonParseOrRaw: (req: Request, res: Response, next: NextFunction) => void;
export declare const urlEncoding: import("connect").NextHandleFunction;
export declare const helmetConfig: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const cacheControl: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=index_middleware.d.ts.map