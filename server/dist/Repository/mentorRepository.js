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
                throw new Error(`error while finding mentor ${error instanceof Error ? error.message : String(error)}`);
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
                throw new Error(`error while creating mentor ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //finding all mentors
    findAllMentor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find(mentorModel_1.default, {});
            }
            catch (error) {
                throw new Error(`error while finding mentor data from data base${error instanceof Error ? error.message : String(error)}`);
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
                throw new Error(`error while finding mentor data from data base${error instanceof Error ? error.message : String(error)}`);
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
                throw new Error(`error while verify mentor data from data base${error instanceof Error ? error.message : String(error)}`);
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
                throw new Error(`error while changing mentor status from data base${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    findMentorAndUpdate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One_And_Update(mentorModel_1.default, { email }, { $set: { password: password } });
            }
            catch (error) {
                throw new Error(`error while changing mentor password from data base${error instanceof Error ? error.message : String(error)}`);
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
                throw new Error(`error while changing mentor password from data base${error instanceof Error ? error.message : String(error)}`);
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
                throw new Error(`Error while change mentro password${error instanceof Error ? error.message : String(error)}`);
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
                throw new Error(`Error while change mentro password${error instanceof Error ? error.message : String(error)}`);
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
                throw new Error(`Error while finding mentor by id and updatae${error instanceof Error ? error.message : String(error)}`);
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
                throw new Error(`Error while finding category with skills ${error instanceof Error ? error.message : String(error)}`);
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
                throw new Error(`Error while finding  mentors by category  ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = new mentorRepository();
