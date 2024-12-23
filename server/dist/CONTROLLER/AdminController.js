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
exports.AdminController = void 0;
class AdminController {
    constructor(_AdminService) {
        this._AdminService = _AdminService;
    }
    getCreateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._AdminService.blCreateCategory(req.body);
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
    getCategoryData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._AdminService.blCategoryData();
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
    getEditCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, category } = req.body;
                console.log(req.body, "thsi is the data", id, category);
                const result = yield this._AdminService.blEditCategory(id, category);
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
    getChangeCategoryStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._AdminService.blChangeCategoryStatus(req.body.id);
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
    getMenteeData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._AdminService.blMenteeData();
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
    getChangeMenteeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._AdminService.blChangeMenteeStatus(req.body.id);
                res
                    .status(result.status)
                    .json({ success: result.success, message: result.message });
            }
            catch (error) {
                throw new Error(`error while getting category in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    getEditMentee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const result = yield this._AdminService.blEditMentee(req.body);
                res.status(result === null || result === void 0 ? void 0 : result.status).json(result);
            }
            catch (error) {
                throw new Error(`error while getting mentee Data  in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    getAddMentee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._AdminService.blAddMentee(req.body);
                res.status(200).json(response);
            }
            catch (error) {
                throw new Error(`error while add mentee Data  in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.AdminController = AdminController;
