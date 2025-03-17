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
const httpStatusCode_1 = require("../Utils/httpStatusCode");
const adminAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //checking fresh token valid
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.adminToken;
        if (!refreshToken || !(0, jwt_utils_1.verifyRefreshToken)(refreshToken)) {
            res.status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized).json({
                success: false,
                message: "Session expired. Please log in again.",
            });
            return;
        }
        //get access token from authorizatoin header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res
                .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized)
                .json({ success: false, message: "Unauthorized. No token provided." });
            return;
        }
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        //jwt verifying
        const decode = (0, jwt_utils_1.verifyAccessToken)(token);
        if ((decode === null || decode === void 0 ? void 0 : decode.error) == "TokenExpired") {
            res
                .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Forbidden)
                .json({ success: false, message: "Token Expired." });
            return;
        }
        if ((decode === null || decode === void 0 ? void 0 : decode.error) == "TamperedToken") {
            res
                .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized)
                .json({ success: false, message: "Token Invalid." });
            return;
        }
        if (decode.role !== "admin") {
            res
                .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized)
                .json({ success: false, message: "user role is invalid" });
            return;
        }
        const adminData = yield menteeModel_1.default.findById(decode === null || decode === void 0 ? void 0 : decode.userId, {
            isAdmin: true,
        });
        if (!adminData) {
            res
                .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized)
                .json({ message: "admin not found", success: false });
            return;
        }
        req.user = { adminId: decode === null || decode === void 0 ? void 0 : decode.userId };
        next();
    }
    catch (error) {
        console.log(`\x1b[35m%s\x1b[0m`, error instanceof Error ? error.message : String(error));
    }
});
exports.default = adminAuthorization;
