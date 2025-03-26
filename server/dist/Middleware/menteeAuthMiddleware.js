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
const httpStatusCode_1 = require("../Utils/httpStatusCode");
const menteeAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        //checking fresh token valid
        if (!refreshToken || !(0, jwt_utils_1.verifyRefreshToken)(refreshToken, "mentee")) {
            res.status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized).json({
                success: false,
                message: "Session expired. Please log in again.",
            });
            return;
        }
        //get access token from authorizatoin header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized).json({
                success: false,
                message: "Unauthorized. No token provided.",
            });
            return;
        }
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
        if (!token) {
            res
                .status(httpStatusCode_1.Status.Unauthorized)
                .json({
                success: false,
                message: "You do not have permission to access this resource.",
                user: false,
            });
            return;
        }
        //jwt verifying
        const decode = (0, jwt_utils_1.verifyAccessToken)(token, "mentee");
        if ((decode === null || decode === void 0 ? void 0 : decode.error) == "TokenExpired") {
            res
                .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Forbidden)
                .json({ success: false, message: "Token Expired." });
            return;
        }
        if ((decode === null || decode === void 0 ? void 0 : decode.error) == "TamperedToken" || !(decode === null || decode === void 0 ? void 0 : decode.isValid)) {
            res
                .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized)
                .json({ success: false, message: "Token Invalid." });
            return;
        }
        if (!(decode === null || decode === void 0 ? void 0 : decode.isValid)) {
            res
                .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized)
                .json({ success: false, message: "User not Valid." });
            return;
        }
        if (((_b = decode === null || decode === void 0 ? void 0 : decode.result) === null || _b === void 0 ? void 0 : _b.role) !== "mentee") {
            res
                .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized)
                .json({ success: false, message: "user role is invalid" });
            return;
        }
        const menteeData = yield menteeModel_1.default.findById((_c = decode === null || decode === void 0 ? void 0 : decode.result) === null || _c === void 0 ? void 0 : _c.userId);
        if (!menteeData || (menteeData === null || menteeData === void 0 ? void 0 : menteeData.isBlocked)) {
            res
                .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized)
                .json({ message: "Mentee Not Found", success: false });
            return;
        }
        req.user = new mongoose_1.default.Types.ObjectId((_d = decode === null || decode === void 0 ? void 0 : decode.result) === null || _d === void 0 ? void 0 : _d.userId);
        next();
    }
    catch (error) {
        console.log(error instanceof Error ? error.message : String(error));
    }
});
exports.default = menteeAuthorization;
