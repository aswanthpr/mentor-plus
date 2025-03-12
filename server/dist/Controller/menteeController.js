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
exports.menteeController = void 0;
class menteeController {
    constructor(_menteeService) {
        this._menteeService = _menteeService;
    }
    //for creating new access token
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this._menteeService.refreshToken((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken);
                if (result === null || result === void 0 ? void 0 : result.success) {
                    res.cookie("refreshToken", result === null || result === void 0 ? void 0 : result.refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 14 * 24 * 60 * 60 * 1000,
                    });
                }
                res.status(result.status).json({
                    success: result === null || result === void 0 ? void 0 : result.success,
                    message: result === null || result === void 0 ? void 0 : result.message,
                    accessToken: result === null || result === void 0 ? void 0 : result.accessToken,
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`error while geting refreshToken${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    menteeLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.path.split("/"));
                res.clearCookie("refreshToken");
                res
                    .status(200)
                    .json({ success: true, message: "Logged out successfully" });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`Error while mentee  logout ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    menteeProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                const result = yield this._menteeService.menteeProfile(token);
                res.status(result === null || result === void 0 ? void 0 : result.status).json({
                    success: result === null || result === void 0 ? void 0 : result.success,
                    message: result === null || result === void 0 ? void 0 : result.message,
                    result: result === null || result === void 0 ? void 0 : result.result,
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`Error while get mentee  profile data ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    menteeProfileEdit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "this is req.body of profile edit data");
                const result = yield this._menteeService.editMenteeProfile(req.body);
                res.status(result === null || result === void 0 ? void 0 : result.status).json(result);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`Error while get mentee  profile editing ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //mentee profile password change
    passwordChange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "thsi isthe passwords");
                const { currentPassword, newPassword, _id } = req.body;
                const result = yield this._menteeService.passwordChange(currentPassword, newPassword, _id);
                res.status(result === null || result === void 0 ? void 0 : result.status).json(result);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`Error while get mentee  profile password changing ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    profileChange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const profileImage = req.files &&
                    req.files.profileImage
                    ? req.files
                        .profileImage[0]
                    : null;
                const result = yield this._menteeService.profileChange(profileImage, _id);
                res.status(result.status).json(result);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`Error while get mentee  profile changing ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //get mentor data in explore
    exploreData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, categories, skill, page = "1", limit, sort } = req.query;
                // Convert query params into correct types
                const searchStr = typeof search === "string" ? search : undefined;
                const pageStr = typeof page === "string" ? page : "1";
                const limitStr = typeof limit === "string" ? limit : "3";
                const sortStr = typeof sort === "string" ? sort : "A-Z";
                // Convert categories and skill into arrays
                const categoriesArray = Array.isArray(categories)
                    ? categories.map(String)
                    : typeof categories === "string"
                        ? [categories]
                        : [];
                const skillArray = Array.isArray(skill)
                    ? skill.map(String)
                    : typeof skill === "string"
                        ? [skill]
                        : [];
                const { status, message, success, category, mentor, skills, currentPage, totalPage, } = yield this._menteeService.exploreData({
                    search: searchStr,
                    categories: categoriesArray,
                    skill: skillArray,
                    page: pageStr,
                    limit: limitStr,
                    sort: sortStr,
                });
                res
                    .status(status)
                    .json({
                    message,
                    success,
                    category,
                    mentor,
                    skills,
                    currentPage,
                    totalPage,
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`Error getting mentor data in explore ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    homeData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { filter } = req.params;
                const { status, success, message, homeData } = yield this._menteeService.homeData(filter);
                const userId = req.user;
                res.status(status).json({ success, message, homeData, userId });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
                throw new Error(`Error getting mentor data in explore ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    // /mentee/explore/mentor/:id
    getSimilarMentors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category, mentorId } = req.query;
                const { status, message, success, mentor } = yield this._menteeService.getMentorDetailes(category, mentorId);
                res.status(status).json({ success, message, mentor });
            }
            catch (error) {
                throw new Error(`Error while  getting mentor data in explore ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.menteeController = menteeController;
