"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.genRefreshToken = exports.genAccesssToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genAccesssToken = (payload) => {
    var _a;
    try {
        return jsonwebtoken_1.default.sign({ userId: payload }, (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.JWT_ACCESS_SECRET, {
            expiresIn: '1h',
        });
    }
    catch (error) {
        console.log(`\x1b[37m%s\x1b[0m]`, `[Error while generating access token ${error instanceof Error ? error.message : String(error)}`);
    }
};
exports.genAccesssToken = genAccesssToken;
const genRefreshToken = (payload) => {
    var _a;
    try {
        return jsonwebtoken_1.default.sign({ userId: payload }, (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.JWT_REFRESH_SECRET, {
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
        return null;
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
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
