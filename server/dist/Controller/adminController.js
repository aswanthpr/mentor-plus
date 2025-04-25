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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const httpStatusCode_1 = require("../Constants/httpStatusCode");
class adminController {
    constructor(_adminService) {
        this._adminService = _adminService;
    }
    adminRefreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this._adminService.adminRefreshToken((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.adminToken);
                res
                    .status(result.status)
                    .cookie("adminToken", result === null || result === void 0 ? void 0 : result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    maxAge: 14 * 24 * 60 * 60 * 1000,
                })
                    .json({
                    success: result === null || result === void 0 ? void 0 : result.success,
                    message: result === null || result === void 0 ? void 0 : result.message,
                    accessToken: result === null || result === void 0 ? void 0 : result.accessToken,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminService.createCategory(req.body);
                res.status(response.status).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    categoryData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { searchQuery, statusFilter, sortField, sortOrder, page, limit } = req.query;
                const { message, success, categories, totalPage, status } = yield this._adminService.categoryData(String(searchQuery), String(statusFilter), String(sortField), String(sortOrder), Number(page), Number(limit));
                res.status(status).json({ message, success, categories, totalPage });
            }
            catch (error) {
                next(error);
            }
        });
    }
    editCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, category } = req.body;
                const result = yield this._adminService.editCategory(id, category);
                if (result.success) {
                    res.status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok).json(result);
                }
                else {
                    res.status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Conflict).json(result);
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    changeCategoryStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminService.changeCategoryStatus(req.body.id);
                res
                    .status(result.status)
                    .json({ success: result.success, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //-----------------------------------------------------------------------------------------------
    menteeData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, sortField, sortOrder, statusFilter, page, limit } = req.query;
                const { message, status, success, totalPage, Data } = yield this._adminService.menteeData(String(search), String(sortField), String(sortOrder), String(statusFilter), Number(page), Number(limit));
                res.status(status).json({ message, success, totalPage, Data });
            }
            catch (error) {
                next(error);
            }
        });
    }
    changeMenteeStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this._adminService.changeMenteeStatus((_a = req.body) === null || _a === void 0 ? void 0 : _a.id);
                res
                    .status(result.status)
                    .json({ success: result.success, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    editMentee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, success, message } = yield this._adminService.editMentee(req.body);
                res.status(status).json({ success, message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addMentee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminService.addMentee(req.body);
                res.status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    //-----------------------------------------------------------
    mentorData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { searchQuery, sortField, sortOrder, page, limit, activeTab } = req.query;
                const result = yield this._adminService.mentorData(String(searchQuery), String(activeTab), String(sortField), String(sortOrder), Number(page), Number(limit));
                res.status(result.status).json({
                    success: result.success,
                    message: result.message,
                    mentorData: result.mentorData,
                    totalPage: result === null || result === void 0 ? void 0 : result.totalPage,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    mentorVerify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminService.mentorVerify(req.body);
                res.status(result.status).json({
                    success: result.success,
                    message: result.message,
                    metnorData: result.result,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //mentor status change
    changeMentorStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminService.mentorStatusChange(req.body.id);
                res
                    .status(result.status)
                    .json({ success: result.success, message: result.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    adminLogout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("adminToken");
                res
                    .status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok)
                    .json({ success: true, message: "Logout successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDashboardData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { timeRange } = req.query;
                const { message, status, success, salesData } = yield this._adminService.dashboardData(String(timeRange));
                res.status(status).json({ success, message, status, salesData });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.adminController = adminController;
