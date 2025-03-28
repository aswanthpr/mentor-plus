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
const baseRepo_1 = require("./baseRepo");
const mentorModel_1 = __importDefault(require("../Model/mentorModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_error_handler_util_1 = require("../Utils/http-error-handler.util");
const httpStatusCode_1 = require("../Constants/httpStatusCode");
class mentorRepository extends baseRepo_1.baseRepository {
    constructor() {
        super(mentorModel_1.default);
    }
    findMentor(email, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = [];
                if (email)
                    query.push({ email });
                if (phone)
                    query.push({ phone });
                if (query.length === 0) {
                    throw new Error("At least one of email or phone must be provided");
                }
                return yield this.find_One({ $or: query });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    createMentor(mentorData, imageUrl, fileUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.createDocument({
                    name: mentorData.name,
                    email: mentorData.email,
                    phone: mentorData.phone,
                    password: mentorData.password,
                    bio: mentorData.bio,
                    jobTitle: mentorData.jobTitle,
                    category: mentorData.category,
                    linkedinUrl: mentorData.linkedinUrl,
                    githubUrl: mentorData.githubUrl,
                    skills: mentorData.skills,
                    resume: fileUrl,
                    profileUrl: imageUrl,
                });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //finding all mentors
    findAllMentor(skip, limit, activeTab, search, sortField, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const sortOptions = sortOrder === "asc" ? 1 : -1;
                const pipeline = [];
                if (search) {
                    pipeline.push({
                        $match: {
                            $or: [
                                { name: { $regex: search, $options: "i" } },
                                { email: { $regex: search, $options: "i" } },
                                { jobTitle: { $regex: search, $options: "i" } },
                                { bio: { $regex: search, $options: "i" } },
                                { category: { $regex: search, $options: "i" } },
                                { skills: { $elemMatch: { $regex: search, $options: "i" } } },
                            ],
                        },
                    });
                }
                pipeline.push({
                    $match: {
                        verified: activeTab === "verified",
                    },
                });
                if (sortField === "createdAt") {
                    pipeline.push({
                        $sort: {
                            createdAt: sortOptions,
                        },
                    });
                }
                pipeline.push({
                    $skip: skip,
                });
                pipeline.push({
                    $limit: limit,
                });
                const countPipeline = [
                    ...pipeline.slice(0, (pipeline === null || pipeline === void 0 ? void 0 : pipeline.length) - 2),
                    {
                        $count: "totalDocuments",
                    },
                ];
                const [mentors, totalDocuments] = yield Promise.all([
                    this.aggregateData(mentorModel_1.default, pipeline),
                    mentorModel_1.default.aggregate(countPipeline),
                ]);
                return { mentors, totalDoc: (_a = totalDocuments[0]) === null || _a === void 0 ? void 0 : _a.totalDocuments };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    findVerifiedMentor(aggregateData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const matchStage = ((_a = aggregateData === null || aggregateData === void 0 ? void 0 : aggregateData.find((stage) => "$match" in stage)) === null || _a === void 0 ? void 0 : _a["$match"]) || {};
                const [mentor, count] = yield Promise.all([
                    this.aggregateData(mentorModel_1.default, aggregateData),
                    this.countDocument(matchStage),
                ]);
                return { mentor, count };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //changing mentor status
    verifyMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(mentorModel_1.default, id, [
                    { $set: { verified: { $not: "$verified" } } },
                ]);
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //changing mentor status;
    changeMentorStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(mentorModel_1.default, id, [
                    { $set: { isBlocked: { $not: "$isBlocked" } } },
                ]);
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    findMentorAndUpdate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One_And_Update(mentorModel_1.default, { email }, { $set: { password: password } });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //finding mentor by his id
    findMentorById(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id(mentorId, { isBlocked: false });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //change password by id and new password
    changeMentorPassword(mentorId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(mentorModel_1.default, mentorId, {
                    $set: { password: password },
                });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    changeMentorProfileImage(profileUrl, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return ((_a = (yield this.find_By_Id_And_Update(mentorModel_1.default, id, { $set: { profileUrl: profileUrl } }, { new: true, fields: { profileUrl: 1 } }))) !== null && _a !== void 0 ? _a : null);
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    updateMentorById(mentorData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateFields = {
                    name: mentorData === null || mentorData === void 0 ? void 0 : mentorData.name,
                    phone: mentorData === null || mentorData === void 0 ? void 0 : mentorData.phone,
                    email: mentorData === null || mentorData === void 0 ? void 0 : mentorData.email,
                    category: mentorData === null || mentorData === void 0 ? void 0 : mentorData.category,
                    jobTitle: mentorData === null || mentorData === void 0 ? void 0 : mentorData.jobTitle,
                    githubUrl: mentorData === null || mentorData === void 0 ? void 0 : mentorData.githubUrl,
                    linkedinUrl: mentorData === null || mentorData === void 0 ? void 0 : mentorData.linkedinUrl,
                    bio: mentorData === null || mentorData === void 0 ? void 0 : mentorData.bio,
                    resume: mentorData === null || mentorData === void 0 ? void 0 : mentorData.resume,
                    skills: mentorData.skills,
                };
                return yield this.find_By_Id_And_Update(mentorModel_1.default, `${mentorData === null || mentorData === void 0 ? void 0 : mentorData._id}`, {
                    $set: updateFields,
                });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    categoryWithSkills() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const aggregationPipeline = [
                    {
                        $unwind: "$skills",
                    },
                    {
                        $group: {
                            _id: "null",
                            skills: {
                                $addToSet: "$skills",
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            skills: 1,
                        },
                    },
                ];
                return yield this.aggregateData(mentorModel_1.default, aggregationPipeline);
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    findMentorsByCategory(category, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.aggregateData(mentorModel_1.default, [
                    {
                        $match: {
                            category: category,
                            _id: { $ne: new mongoose_1.default.Types.ObjectId(mentorId) },
                        },
                    },
                    // {
                    //   // Randomly sample 10 mentors
                    //   $sample: { size: 10 }
                    // }
                ]);
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.default = new mentorRepository();
