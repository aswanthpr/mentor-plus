"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.genRefreshToken = exports.genAccesssToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const genAccesssToken = (userId, role) => {
    var _a;
    try {
        return jsonwebtoken_1.default.sign({ userId, role }, (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.JWT_ACCESS_SECRET, {
            expiresIn: '1m',
        });
    }
    catch (error) {
        console.log(`\x1b[37m%s\x1b[0m]`, `[Error while generating access token ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.genAccesssToken = genAccesssToken;
const genRefreshToken = (userId, role) => {
    var _a;
    try {
        return jsonwebtoken_1.default.sign({ userId, role }, (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.JWT_REFRESH_SECRET, {
            expiresIn: "14d",
        });
    }
    catch (error) {
        console.log(`\x1b[34m%s\x1b[0m]`, `Error while generating refresh token ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.genRefreshToken = genRefreshToken;
const verifyAccessToken = (token) => {
    var _a;
    try {
        return jsonwebtoken_1.default.verify(token, (_a = process.env) === null || _a === void 0 ? void 0 : _a.JWT_ACCESS_SECRET);
    }
    catch (error) {
        console.log(`\x1b[35m%s\x1b[0m]`, `Error while verifying access token ${error instanceof Error ? error.message : String(error)}`);
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return { isValid: false, error: "TokenExpired" };
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return { isValid: false, error: "TamperedToken" };
        }
        console.error(`Unexpected error during token verification:`, String(error));
        return { isValid: false, error: "UnknownError" };
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    var _a;
    try {
        return jsonwebtoken_1.default.verify(token, (_a = process.env) === null || _a === void 0 ? void 0 : _a.JWT_REFRESH_SECRET);
    }
    catch (error) {
        console.log(`\x1b[36m%s\x1b[0m]`, `Error while verifying refresh token ${error instanceof Error ? error.message : String(error)}`);
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return { isValid: false, error: "TokenExpired" };
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return { isValid: false, error: "TamperedToken" };
        }
        console.error(`Unexpected error during token verification:`, String(error));
        return { isValid: false, error: "UnknownError" };
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
