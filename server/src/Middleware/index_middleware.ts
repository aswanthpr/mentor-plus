import { CorsOptions } from "cors";
import { rateLimit } from "express-rate-limit";
import compression from "compression";
import session from "express-session";
import express, { Response, Request } from "express";
import { NextFunction } from "connect";
import helmet from "helmet";

//default cors config
export const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_ORIGIN_URL,
  methods: ["GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "Authorization",
    "Set-Cookie",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

//socket cors config
export const corsConfig: CorsOptions = {
  origin: process.env.CLIENT_ORIGIN_URL as string,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 5 minutes
  limit: 50, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
  message: "Too many requests from this IP, please try again later.",
  headers: true, // Show rate limit info in headers
});

export const compress = compression({
  level: 6, // Compression level (0-9)
  threshold: 0, // Minimum response size to compress (in bytes)
  filter: (req, res) => {
    // Custom logic to decide if response should be compressed
    if (req.headers["x-no-compression"]) {
      //if the header present it will not compress the response
      return false;
    }
    return compression.filter(req, res);
  },
});
//session
export const sessionConfig = session({
  secret: process.env?.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
});

// determine request body parse to json or raw state
export const jsonParseOrRaw = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.originalUrl === "/mentee/booking/webhook" ||
    req.originalUrl === "/mentee/wallet/webhook"
  ) {
    next(); // Do nothing with the body because  need it in a raw state.
  } else {
    express.json()(req, res, next);
  }
};
//url encoding for the body data
export const urlEncoding = express.urlencoded({ extended: true });

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", process.env.CLIENT_ORIGIN_URL as string, "wss:"], //Allow WebSockets
    },
  },
});
export const  cacheControl = (req:Request, res:Response, next:NextFunction) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};