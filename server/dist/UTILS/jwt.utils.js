"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRefreshToken = exports.genAccesssToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const accessTokenSecret = ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.JWT_ACCESS_SECRET) || "Thisistheaccesstokenscertkey";
const accessTokenExpiry = ((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b.ACCESS_TOKEN_EXPIRY) || "15m";
const refreshTokenScret = ((_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.JWT_REFRESH_SECRET) || "Thisistherefreshtokensecret";
const refreshTokenExpiry = (_d = process === null || process === void 0 ? void 0 : process.env) === null || _d === void 0 ? void 0 : _d.REFRESH_TOKEN_EXPIRY;
const genAccesssToken = (payload) => {
    try {
        return jsonwebtoken_1.default.sign({ userId: payload }, accessTokenSecret, {
            expiresIn: accessTokenExpiry,
        });
    }
    catch (error) {
        console.log(`\x1b[37m%s\x1b[0m]`, `[Error while generating access token ${error.message}`);
    }
};
exports.genAccesssToken = genAccesssToken;
const genRefreshToken = (payload) => {
    try {
        return jsonwebtoken_1.default.sign({ userId: payload }, refreshTokenScret, {
            expiresIn: refreshTokenExpiry,
        });
    }
    catch (error) {
        console.log(`\x1b[37m%s\x1b[0m]`, `Error while generating refresh token ${error.message}`);
    }
};
exports.genRefreshToken = genRefreshToken;
