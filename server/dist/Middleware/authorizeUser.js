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
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("../Utils/index");
const httpStatusCode_1 = require("../Constants/httpStatusCode");
const httpResponse_1 = require("../Constants/httpResponse");
const menteeModel_1 = __importDefault(require("../Model/menteeModel"));
const mentorModel_1 = __importDefault(require("../Model/mentorModel"));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modelMap = {
    admin: menteeModel_1.default, // assuming admin is also in menteeModel
    mentee: menteeModel_1.default,
    mentor: mentorModel_1.default,
};
const authorizeUser = (role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
            if (!refreshToken) {
                res.status(httpStatusCode_1.Status.Unauthorized).json({
                    success: false,
                    message: httpResponse_1.HttpResponse.UNAUTHORIZED,
                });
                return;
            }
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer")) {
                res.status(httpStatusCode_1.Status.Unauthorized).json({
                    success: false,
                    message: httpResponse_1.HttpResponse.UNAUTHORIZED,
                });
                return;
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                res.status(httpStatusCode_1.Status.Unauthorized).json({
                    success: false,
                    message: httpResponse_1.HttpResponse.UNAUTHORIZED,
                });
                return;
            }
            const decode = (0, index_1.verifyAccessToken)(token, role);
            if ((decode === null || decode === void 0 ? void 0 : decode.error) === "TokenExpired") {
                res.status(httpStatusCode_1.Status.Forbidden).json({
                    success: false,
                    message: httpResponse_1.HttpResponse.TOKEN_EXPIRED,
                });
                return;
            }
            if ((decode === null || decode === void 0 ? void 0 : decode.error) === "TamperedToken") {
                res.status(httpStatusCode_1.Status.Unauthorized).json({
                    success: false,
                    message: httpResponse_1.HttpResponse.UNAUTHORIZED,
                });
                return;
            }
            const userId = (_b = decode === null || decode === void 0 ? void 0 : decode.result) === null || _b === void 0 ? void 0 : _b.userId;
            const Model = modelMap[role];
            const user = yield Model.findById(userId);
            if (!user || user.isBlocked || (role === "mentor" && !user.name)) {
                res.status(httpStatusCode_1.Status.Unauthorized).json({
                    success: false,
                    message: httpResponse_1.HttpResponse.UNAUTHORIZED,
                });
                return;
            }
            req.user = new mongoose_1.default.Types.ObjectId(userId);
            next();
        }
        catch (error) {
            throw new index_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status.InternalServerError);
        }
    });
};
exports.default = authorizeUser;
