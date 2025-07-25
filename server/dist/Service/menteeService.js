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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_utils_1 = require("../Utils/jwt.utils");
const hashPass_util_1 = __importDefault(require("../Utils/hashPass.util"));
const httpStatusCode_1 = require("../Constants/httpStatusCode");
const cloudinary_util_1 = require("../Config/cloudinary.util");
const httpResponse_1 = require("../Constants/httpResponse");
const http_error_handler_util_1 = require("../Utils/http-error-handler.util");
const mentorDTO_1 = require("../dto/mentor/mentorDTO");
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
            var _a, _b;
            try {
                const decode = (0, jwt_utils_1.verifyAccessToken)(refreshToken, 'mentee');
                if (!((_a = decode === null || decode === void 0 ? void 0 : decode.result) === null || _a === void 0 ? void 0 : _a.userId)) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.TOKEN_EXPIRED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Forbidden,
                        result: null,
                    };
                }
                const result = yield this._menteeRepository.findById((_b = decode === null || decode === void 0 ? void 0 : decode.result) === null || _b === void 0 ? void 0 : _b.userId);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        result: null,
                    };
                }
                return { success: true, message: "success", result: result, status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    editMenteeProfile(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!formData) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        result: null,
                    };
                }
                const result = yield this._menteeRepository.editMentee(formData);
                if (!result) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NotFound,
                        result: null,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status.Ok,
                    result: result,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
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
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                    };
                }
                if (currentPassword == newPassword) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.NEW_PASS_REQUIRED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const result = yield this._menteeRepository.findById(_id);
                if (!result) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS, status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.NotFound };
                }
                const passCompare = yield bcrypt_1.default.compare(currentPassword, `${result === null || result === void 0 ? void 0 : result.password}`);
                if (!passCompare) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.PASSWORD_INCORRECT,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                    };
                }
                const hashPass = yield (0, hashPass_util_1.default)(newPassword);
                const response = yield this._menteeRepository.changePassword(_id, hashPass);
                if (!response) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_UPDATE_FAILED, status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest };
                }
                return { success: true, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS, status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    profileChange(image, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!image || !id) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS, status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest };
                }
                const profileUrl = yield (0, cloudinary_util_1.uploadImage)(image === null || image === void 0 ? void 0 : image.buffer);
                const result = yield this._menteeRepository.profileChange(profileUrl, id);
                if (!result) {
                    return { success: false, message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_NOT_FOUND, status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                    status: httpStatusCode_1.Status.Ok,
                    profileUrl: result.profileUrl,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    refreshToken(refresh) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!refresh) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.UNAUTHORIZED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                const decode = (0, jwt_utils_1.verifyRefreshToken)(refresh, "mentee");
                if (!(decode === null || decode === void 0 ? void 0 : decode.isValid) ||
                    !((_a = decode === null || decode === void 0 ? void 0 : decode.result) === null || _a === void 0 ? void 0 : _a.userId) ||
                    (decode === null || decode === void 0 ? void 0 : decode.error) == "TamperedToken" ||
                    (decode === null || decode === void 0 ? void 0 : decode.error) == "TokenExpired") {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.UNAUTHORIZED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Unauthorized,
                    };
                }
                const userId = (_b = decode === null || decode === void 0 ? void 0 : decode.result) === null || _b === void 0 ? void 0 : _b.userId;
                const accessToken = (0, jwt_utils_1.genAccesssToken)(userId, "mentee");
                const refreshToken = (0, jwt_utils_1.genRefreshToken)(userId, "mentee");
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.TOKEN_GENERATED,
                    accessToken,
                    refreshToken,
                    status: httpStatusCode_1.Status.Ok,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
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
                if (!mentorData) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                        skills: undefined,
                    };
                }
                //calculating total pages
                const totalPage = Math.ceil((mentorData === null || mentorData === void 0 ? void 0 : mentorData.count) / limitNo);
                //finding categoryData
                const categoryData = yield this._categoryRepository.allCategoryData();
                if (!categoryData) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                        skills: undefined,
                    };
                }
                // finding skills
                const categoryWithSkill = yield this._mentorRepository.categoryWithSkills();
                //dto mapping 
                const mentorDto = mentorDTO_1.MentorDTO.multiple(mentorData === null || mentorData === void 0 ? void 0 : mentorData.mentor);
                return {
                    success: false,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_FOUND,
                    status: httpStatusCode_1.Status.Ok,
                    mentor: mentorDto,
                    category: categoryData,
                    skills: categoryWithSkill,
                    totalPage,
                    currentPage: pageNo,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //this is for getting mentee home question data
    homeData(filter, search, sortField, sortOrder, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!filter || page < 1 || limit < 1 || !sortField || !sortOrder) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        homeData: [],
                        totalPage: 0,
                    };
                }
                const pageNo = page || 1;
                const limitNo = limit || 6;
                const skip = (pageNo - 1) * limitNo;
                const response = yield this._questionRepository.allQuestionData(filter, search, sortOrder, sortField, skip, limit);
                if (!response) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                        homeData: [],
                        totalPage: 0,
                    };
                }
                const totalPage = Math.ceil((response === null || response === void 0 ? void 0 : response.count) / limitNo);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    status: httpStatusCode_1.Status.Ok,
                    homeData: response === null || response === void 0 ? void 0 : response.question,
                    totalPage,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
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
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        success: false,
                        mentor: [],
                    };
                }
                const response = yield this._mentorRepository.findMentorsByCategory(category, mentorId);
                if (!response) {
                    return {
                        status: httpStatusCode_1.Status.Ok,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        success: false,
                        mentor: [],
                    };
                }
                return {
                    status: httpStatusCode_1.Status.Ok,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    success: true,
                    mentor: response,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.menteeService = menteeService;
