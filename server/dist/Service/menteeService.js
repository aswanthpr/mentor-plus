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
exports.menteeService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_utils_1 = require("../Utils/jwt.utils");
const hashPass_util_1 = __importDefault(require("../Utils/hashPass.util"));
const httpStatusCode_1 = require("../Utils/httpStatusCode");
const cloudinary_util_1 = require("../Config/cloudinary.util");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
class menteeService {
    constructor(_menteeRepository, _mentorRepository, _categoryRepository, _questionRepository) {
        this._menteeRepository = _menteeRepository;
        this._mentorRepository = _mentorRepository;
        this._categoryRepository = _categoryRepository;
        this._questionRepository = _questionRepository;
    }
    menteeProfile(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const decode = jsonwebtoken_1.default.verify(refreshToken, (_a = process.env) === null || _a === void 0 ? void 0 : _a.JWT_ACCESS_SECRET);
                if (!decode) {
                    return {
                        success: false,
                        message: "Your session has expired. Please log in again.",
                        status: 403,
                        result: null,
                    };
                }
                const result = yield this._menteeRepository.findById(decode.userId);
                if (!result) {
                    return {
                        success: false,
                        message: "invalid credential",
                        status: 403,
                        result: null,
                    };
                }
                return { success: true, message: "success", result: result, status: 200 };
            }
            catch (error) {
                throw new Error(`Error while bl metneeProfile in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    editMenteeProfile(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(formData);
                if (!formData) {
                    return {
                        success: false,
                        message: "credential is  missing",
                        status: httpStatusCode_1.Status.BadRequest,
                        result: null,
                    };
                }
                const result = yield this._menteeRepository.editMentee(formData);
                console.log(result, "this is edit mentee result");
                if (!result) {
                    return {
                        success: false,
                        message: "mentee not found",
                        status: 401,
                        result: null,
                    };
                }
                return {
                    success: true,
                    message: "edit successfully",
                    status: httpStatusCode_1.Status.Ok,
                    result: result,
                };
            }
            catch (error) {
                throw new Error(`Error while bl metneeProfile edit in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //metnee profile pass chagne
    passwordChange(currentPassword, newPassword, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!currentPassword || !newPassword || !_id) {
                    return {
                        success: false,
                        message: "credentials not found",
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                if (currentPassword == newPassword) {
                    return {
                        success: false,
                        message: "new password cannto be same as current password",
                        status: 401,
                    };
                }
                const result = yield this._menteeRepository.findById(_id);
                if (!result) {
                    return { success: false, message: "invalid credential ", status: 401 };
                }
                const passCompare = yield bcrypt_1.default.compare(currentPassword, `${result === null || result === void 0 ? void 0 : result.password}`);
                if (!passCompare) {
                    return {
                        success: false,
                        message: "incorrect current  password",
                        status: 401,
                    };
                }
                const hashPass = yield (0, hashPass_util_1.default)(newPassword);
                const response = yield this._menteeRepository.changePassword(_id, hashPass);
                if (!response) {
                    return { success: false, message: "updation failed", status: 503 };
                }
                return { success: true, message: "updation successfull", status: 200 };
            }
            catch (error) {
                throw new Error(`Error while bl metneeProfile password change in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    profileChange(image, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!image || !id) {
                    return { success: false, message: "credential not found", status: 400 };
                }
                const profileUrl = yield (0, cloudinary_util_1.uploadImage)(image === null || image === void 0 ? void 0 : image.buffer);
                const result = yield this._menteeRepository.profileChange(profileUrl, id);
                if (!result) {
                    return { success: false, message: "user not found", status: 401 };
                }
                return {
                    success: true,
                    message: "updation successfull",
                    status: httpStatusCode_1.Status.Ok,
                    profileUrl: result.profileUrl,
                };
            }
            catch (error) {
                throw new Error(`Error while bl metnee Profile  change in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    refreshToken(refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!refresh) {
                    return { success: false, message: "RefreshToken missing", status: 401 };
                }
                const decode = (0, jwt_utils_1.verifyRefreshToken)(refresh);
                if (!decode) {
                    return {
                        success: false,
                        message: "Your session has expired. Please log in again.",
                        status: httpStatusCode_1.Status.NotFound,
                    };
                }
                const { userId } = decode;
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId);
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId);
                return {
                    success: true,
                    message: "Token refresh successfully",
                    accessToken,
                    refreshToken,
                    status: httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                console.error("Error while generating access or refresh token:", error);
                return { success: false, message: "Internal server error", status: 500 };
            }
        });
    }
    //metnor data fetching for explore
    exploreData(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, categories, skill, page, limit, sort } = params;
                const pageNo = parseInt(page, 10) || 1;
                const limitNo = parseInt(limit, 10) || 1;
                const skip = (pageNo - 1) * limitNo;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const matchStage = { verified: true };
                if (search) {
                    matchStage.$or = [
                        { name: { $regex: search, $options: "i" } },
                        { bio: { $regex: search, $options: "i" } },
                        { jobTitle: { $regex: search, $options: "i" } },
                        { category: { $regex: search, $options: "i" } },
                        { skills: { $in: [new RegExp(search, "i")] } },
                    ];
                }
                if (categories && categories.length > 0) {
                    matchStage.category = { $in: categories };
                }
                if (skill && skill.length > 0) {
                    matchStage.skills = { $in: skill };
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const sortStage = {};
                if (sort === "A-Z") {
                    sortStage["name"] = 1; // Sort by name (ascending)
                }
                else if (sort === "Z-A") {
                    sortStage["name"] = -1; // Sort by name (descending)
                }
                else {
                    sortStage["createdAt"] = -1; // Default sorting: latest first
                }
                const aggregationPipeline = [
                    { $match: matchStage },
                    // Lookup reviews for each mentor
                    {
                        $lookup: {
                            from: "reviews",
                            localField: "_id",
                            foreignField: "mentorId",
                            as: "reviews",
                        },
                    },
                    // Lookup mentee details for each review
                    {
                        $lookup: {
                            from: "mentees",
                            localField: "reviews.menteeId",
                            foreignField: "_id",
                            as: "mentees",
                        },
                    },
                    // Process each review to attach the corresponding mentee
                    {
                        $addFields: {
                            reviews: {
                                $map: {
                                    input: "$reviews",
                                    as: "review",
                                    in: {
                                        $mergeObjects: [
                                            "$$review",
                                            {
                                                mentee: {
                                                    $arrayElemAt: [
                                                        {
                                                            $filter: {
                                                                input: "$mentees",
                                                                as: "mentee",
                                                                cond: {
                                                                    $eq: ["$$mentee._id", "$$review.menteeId"],
                                                                },
                                                            },
                                                        },
                                                        0,
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                    // Compute the average rating
                    {
                        $addFields: {
                            averageRating: { $avg: "$reviews.rating" },
                        },
                    },
                    // Remove extra mentees array
                    {
                        $project: {
                            mentees: 0,
                        },
                    },
                    { $sort: sortStage },
                    { $skip: skip },
                    { $limit: limitNo },
                ];
                const mentorData = yield this._mentorRepository.findVerifiedMentor(aggregationPipeline);
                console.log(mentorData, "mentordata");
                if (!mentorData) {
                    return {
                        success: false,
                        message: "Data not found",
                        status: httpStatusCode_1.Status.NotFound,
                        skills: undefined,
                    };
                }
                //calculating total pages
                const totalPage = Math.ceil((mentorData === null || mentorData === void 0 ? void 0 : mentorData.count) / limitNo);
                //finding categoryData
                const categoryData = yield this._categoryRepository.categoryData();
                if (!categoryData) {
                    return {
                        success: false,
                        message: "Data not found",
                        status: httpStatusCode_1.Status.NotFound,
                        skills: undefined,
                    };
                }
                // finding skills
                const categoryWithSkill = yield this._mentorRepository.categoryWithSkills();
                return {
                    success: false,
                    message: "Data fetch successfully ",
                    status: httpStatusCode_1.Status.Ok,
                    mentor: mentorData === null || mentorData === void 0 ? void 0 : mentorData.mentor,
                    category: categoryData,
                    skills: categoryWithSkill,
                    totalPage,
                    currentPage: pageNo,
                };
            }
            catch (error) {
                console.error("\x1b[34m%s\x1b[0m", "Error while generating access or refresh token:", error);
                return {
                    success: false,
                    message: "Internal server error",
                    status: 500,
                    skills: undefined,
                };
            }
        });
    }
    //this is for getting mentee home question data
    homeData(filter, search, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(filter, search, page, limit);
                if (!filter || !page || !limit) {
                    return {
                        success: false,
                        message: "credentials not found",
                        status: httpStatusCode_1.Status.BadRequest,
                        homeData: [],
                        totalPage: 0,
                    };
                }
                const pageNo = page || 1;
                const limitNo = limit || 6;
                const skip = (pageNo - 1) * limitNo;
                const response = yield this._questionRepository.allQuestionData(filter, search, skip, limit);
                if (!response) {
                    return {
                        success: false,
                        message: "Data not found",
                        status: httpStatusCode_1.Status.NotFound,
                        homeData: [],
                        totalPage: 0,
                    };
                }
                const totalPage = Math.ceil((response === null || response === void 0 ? void 0 : response.count) / limitNo);
                return {
                    success: true,
                    message: "Data successfully fetched",
                    status: httpStatusCode_1.Status.Ok,
                    homeData: response === null || response === void 0 ? void 0 : response.question,
                    totalPage,
                };
            }
            catch (error) {
                console.error("\x1b[34m%s\x1b[0m", "Error while generating access or refresh token:", error);
                return {
                    success: false,
                    message: "Internal server error",
                    status: httpStatusCode_1.Status.InternalServerError,
                    homeData: [],
                    totalPage: 0
                };
            }
        });
    }
    // /mentee/explor/mentor/:id
    getMentorDetailes(category, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mentorId) {
                    return {
                        status: httpStatusCode_1.Status.BadRequest,
                        message: "credential not found",
                        success: false,
                        mentor: [],
                    };
                }
                const response = yield this._mentorRepository.findMentorsByCategory(category, mentorId);
                if (!response) {
                    return {
                        status: httpStatusCode_1.Status.Ok,
                        message: "Data not found",
                        success: false,
                        mentor: [],
                    };
                }
                return {
                    status: httpStatusCode_1.Status.Ok,
                    message: "Data fetched successfully",
                    success: true,
                    mentor: response,
                };
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)} error while gettign mentor data in mentee service`);
            }
        });
    }
}
exports.menteeService = menteeService;
