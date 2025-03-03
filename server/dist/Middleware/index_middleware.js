"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.helmetConfig = exports.urlEncoding = exports.jsonParseOrRaw = exports.sessionConfig = exports.compress = exports.limiter = exports.corsConfig = exports.corsOptions = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const compression_1 = __importDefault(require("compression"));
const express_session_1 = __importDefault(require("express-session"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
//default cors config
exports.corsOptions = {
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
    credentials: true
};
//socket cors config
exports.corsConfig = {
    origin: process.env.CLIENT_ORIGIN_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
exports.limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000, // 5 minutes
    limit: 200, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
    standardHeaders: true, // add the `RateLimit-*` headers to the response
    legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
    message: "Too many requests from this IP, please try again later.",
    headers: true, // Show rate limit info in headers
});
exports.compress = (0, compression_1.default)({
    level: 6, // Compression level (0-9)
    threshold: 0, // Minimum response size to compress (in bytes)
    filter: (req, res) => {
        // Custom logic to decide if response should be compressed
        if (req.headers["x-no-compression"]) {
            //if the header present it will not compress the response
            return false;
        }
        return compression_1.default.filter(req, res);
    },
});
//session
exports.sessionConfig = (0, express_session_1.default)({
    secret: (_a = process.env) === null || _a === void 0 ? void 0 : _a.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
});
// determine request body parse to json or raw state
const jsonParseOrRaw = (req, res, next) => {
    if (req.originalUrl === "/mentee/webhook") {
        next(); // Do nothing with the body because  need it in a raw state.
    }
    else {
        express_1.default.json()(req, res, next);
    }
};
exports.jsonParseOrRaw = jsonParseOrRaw;
//url encoding for the body data
exports.urlEncoding = express_1.default.urlencoded({ extended: true });
exports.helmetConfig = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            connectSrc: ["'self'", process.env.CLIENT_ORIGIN_URL, "wss:"], //Allow WebSockets
        },
    },
});
