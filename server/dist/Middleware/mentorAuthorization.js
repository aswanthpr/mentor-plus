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
const jwt_utils_1 = require("../Utils/jwt.utils");
const mentorModel_1 = __importDefault(require("../Model/mentorModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const httpStatusCode_1 = require("../Utils/httpStatusCode");
const mentorAuthorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.status(httpStatusCode_1.Status.Forbidden).json({ success: false, message: "Unauthorized. No token provided.", user: false });
            return;
        }
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
        if (!token) {
            res.status(httpStatusCode_1.Status.Forbidden).json({ success: false, message: "You do not have permission to access this resource.", user: false });
            return;
        }
        const decode = (0, jwt_utils_1.verifyAccessToken)(token);
        if (!decode || !decode.userId) {
            res.status(httpStatusCode_1.Status.Forbidden).json({ success: false, message: "You do not have permission to access this resource.", user: false });
            return;
        }
        const menteeData = yield mentorModel_1.default.findById(decode === null || decode === void 0 ? void 0 : decode.userId);
        if (!menteeData || (menteeData === null || menteeData === void 0 ? void 0 : menteeData.isBlocked)) {
            res.status(httpStatusCode_1.Status.Forbidden).json({ message: 'You do not have permission to access this resource.', success: false, user: false });
            return;
        }
        req.user = new mongoose_1.default.Types.ObjectId(decode === null || decode === void 0 ? void 0 : decode.userId);
        next();
    }
    catch (error) {
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.mentorToken;
        if (!refreshToken || !(0, jwt_utils_1.verifyRefreshToken)(refreshToken)) {
            res.status(httpStatusCode_1.Status.Unauthorized).json({
                success: false,
                message: "You are not authorized. Please log in.",
            });
            return;
        }
        res.status(httpStatusCode_1.Status.Forbidden).json({
            success: false,
            message: "You do not have permission to access this resource.",
        });
        console.log(error instanceof Error ? error.message : String(error));
    }
});
exports.default = mentorAuthorize;
