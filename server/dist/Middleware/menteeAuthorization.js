"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const menteeModel_1 = __importDefault(require("../Model/menteeModel"));
const jwt_utils_1 = require("../Utils/jwt.utils");
const mongoose_1 = __importDefault(require("mongoose"));
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res
                .status(403)
                .json({
                success: false,
                message: "Unauthorized. No token provided."
            });
            return;
        }
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        const decode = (0, jwt_utils_1.verifyAccessToken)(token);
        if (!decode || !decode.userId) {
            res
                .status(403)
                .json({ success: false, message: "Invalid token." });
            return;
        }
        const menteeData = yield menteeModel_1.default.findById(decode === null || decode === void 0 ? void 0 : decode.userId);
        if (!menteeData || (menteeData === null || menteeData === void 0 ? void 0 : menteeData.isBlocked)) {
            res
                .status(403)
                .json({ message: "Mentee Not Found", success: false });
            return;
        }
        req.user = new mongoose_1.default.Types.ObjectId(decode === null || decode === void 0 ? void 0 : decode.userId);
        next();
    }
    catch (error) {
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!refreshToken || !(0, jwt_utils_1.verifyRefreshToken)(refreshToken)) {
            res.status(401).json({
                success: false,
                message: "Session expired. Please log in again.",
            });
            return;
        }
        res.status(403).json({
            success: false,
            message: "Token expired or invalid.",
        });
        console.log(error instanceof Error ? error.message : String(error));
    }
});
exports.default = authorize;
