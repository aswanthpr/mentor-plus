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
class adminController {
    constructor(_adminService) {
        this._adminService = _adminService;
    }
    adminRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("Received refresh token from cookies:", req.cookies.refreshToken);
                const result = yield this._adminService.adminRefreshToken((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.adminToken);
                res.status(result.status)
                    .cookie("adminToken", result === null || result === void 0 ? void 0 : result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: "lax",
                    maxAge: 14 * 24 * 60 * 60 * 1000,
                })
                    .json({ success: result === null || result === void 0 ? void 0 : result.success, message: result === null || result === void 0 ? void 0 : result.message, accessToken: result === null || result === void 0 ? void 0 : result.accessToken });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while geting refreshToken${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminService.createCategory(req.body);
                res.status(response.status).json(response);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "internal server error" });
                throw new Error(`error while create category in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    categoryData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminService.categoryData();
                if (result.success) {
                    res.status(200).json(result);
                }
                else {
                    res.status(409).json(result);
                }
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while getting category in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    editCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, category } = req.body;
                console.log(req.body, "thsi is the data", id, category);
                const result = yield this._adminService.editCategory(id, category);
                if (result.success) {
                    res.status(200).json(result);
                }
                else {
                    res.status(409).json(result);
                }
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while getting category in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    changeCategoryStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminService.changeCategoryStatus(req.body.id);
                res
                    .status(result.status)
                    .json({ success: result.success, message: result.message });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while getting category in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //-----------------------------------------------------------------------------------------------
    menteeData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminService.menteeData();
                res.status(result.status).json(result);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while getting category in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    changeMenteeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminService.changeMenteeStatus(req.body.id);
                res
                    .status(result.status)
                    .json({ success: result.success, message: result.message });
            }
            catch (error) {
                throw new Error(`error while getting category in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    editMentee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const { status, success, message } = yield this._adminService.editMentee(req.body);
                res.status(status).json({ success, message });
            }
            catch (error) {
                throw new Error(`error while getting mentee Data  in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    addMentee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._adminService.addMentee(req.body);
                res.status(200).json(response);
            }
            catch (error) {
                throw new Error(`error while add mentee Data  in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //-----------------------------------------------------------
    mentorData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminService.mentorData();
                res.status(result.status).json({ success: result.success, message: result.message, mentorData: result.mentorData });
            }
            catch (error) {
                throw new Error(`error while get mentor Data  in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    mentorVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, 'lkasndflnf');
                const result = yield this._adminService.mentorVerify(req.body);
                res.status(result.status).json({ success: result.success, message: result.message, metnorData: result.result });
            }
            catch (error) {
                throw new Error(`error while mentor verify  in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //mentor status change
    changeMentorStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminService.mentorStatusChange(req.body.id);
                res.status(result.status).json({ success: result.success, message: result.message });
            }
            catch (error) {
                throw new Error(`error while mentor stutus  in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    adminLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('adminToken');
                res.status(200).json({ success: true, message: "Logout successfully" });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Internal server error" });
                throw new Error(`Error while mentee  logout ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    getDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { timeRange } = req.query;
                const { message, status, success, salesData } = yield this._adminService.dashboardData(String(timeRange));
                res.status(status).json({ success, message, status, salesData });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Internal server error" });
                throw new Error(`Error while dashboard ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.adminController = adminController;
