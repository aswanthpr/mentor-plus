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
exports.menteeRepository = void 0;
const menteeModel_1 = __importDefault(require("../Model/menteeModel"));
const baseRepo_1 = require("./baseRepo");
class menteeRepository extends baseRepo_1.baseRepository {
    constructor() {
        super(menteeModel_1.default);
    }
    menteeData(skip, limit, search, sortOrder, sortField, statusFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pipeline = [
                    { $match: { isAdmin: false } },
                ];
                // Search
                if (search) {
                    pipeline.push({
                        $match: {
                            $or: [
                                { name: { $regex: search, $options: "i" } },
                                { email: { $regex: search, $options: "i" } },
                                { phone: { $regex: search, $options: "i" } },
                            ],
                        },
                    });
                }
                // Status Filter
                if (statusFilter !== "all") {
                    pipeline.push({
                        $match: { isBlocked: statusFilter === "blocked" },
                    });
                }
                // Sorting
                if (sortField === "createdAt") {
                    pipeline.push({ $sort: { createdAt: sortOrder === "asc" ? 1 : -1 } });
                }
                // Pagination
                pipeline.push({ $skip: skip });
                pipeline.push({ $limit: limit });
                // Count Pipeline
                const countPipeline = [
                    ...JSON.parse(JSON.stringify(pipeline)).slice(0, -2),
                    { $count: "totalDocuments" },
                ];
                // Execute Aggregations
                const [mentees, totalCount] = yield Promise.all([
                    this.aggregateData(menteeModel_1.default, pipeline),
                    menteeModel_1.default.aggregate(countPipeline),
                ]);
                return {
                    mentees,
                    totalDoc: ((_a = totalCount === null || totalCount === void 0 ? void 0 : totalCount[0]) === null || _a === void 0 ? void 0 : _a.totalDocuments) || 0,
                };
            }
            catch (error) {
                throw new Error(`error while Checking mentee data ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    changeMenteeStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(menteeModel_1.default, id, [
                    { $set: { isBlocked: { $not: "$isBlocked" } } },
                ]);
            }
            catch (error) {
                throw new Error(`error while change mentee status in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    editMentee(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(menteeModel_1.default, formData === null || formData === void 0 ? void 0 : formData._id, {
                    $set: {
                        name: formData === null || formData === void 0 ? void 0 : formData.name,
                        email: formData === null || formData === void 0 ? void 0 : formData.email,
                        phone: formData === null || formData === void 0 ? void 0 : formData.phone,
                        bio: formData === null || formData === void 0 ? void 0 : formData.bio,
                        education: formData === null || formData === void 0 ? void 0 : formData.education,
                        currentPosition: formData === null || formData === void 0 ? void 0 : formData.currentPosition,
                        linkedinUrl: formData === null || formData === void 0 ? void 0 : formData.linkedinUrl,
                        githubUrl: formData === null || formData === void 0 ? void 0 : formData.githubUrl,
                    },
                });
            }
            catch (error) {
                throw new Error(`error while edit mentee data in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    findMentee(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One({ email });
            }
            catch (error) {
                throw new Error(`error find mentee data in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    addMentee(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.createDocument({
                    name: formData === null || formData === void 0 ? void 0 : formData.name,
                    email: formData === null || formData === void 0 ? void 0 : formData.email,
                    phone: formData === null || formData === void 0 ? void 0 : formData.phone,
                    bio: formData === null || formData === void 0 ? void 0 : formData.bio,
                });
            }
            catch (error) {
                throw new Error(`error add mentee data in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    googleAddMentee(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.createDocument({
                    name: formData === null || formData === void 0 ? void 0 : formData.name,
                    email: formData === null || formData === void 0 ? void 0 : formData.email,
                    profileUrl: formData === null || formData === void 0 ? void 0 : formData.profileUrl,
                    verified: formData === null || formData === void 0 ? void 0 : formData.verified,
                });
            }
            catch (error) {
                throw new Error(`error google add mentee data in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id(id, { isBlocked: false });
            }
            catch (error) {
                throw new Error(`error fetch metnee data by id  in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    changePassword(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(menteeModel_1.default, id, {
                    $set: { password: password },
                });
            }
            catch (error) {
                throw new Error(`error fetch metnee password change by id  in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    profileChange(image, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(menteeModel_1.default, id, {
                    $set: { profileUrl: image },
                });
            }
            catch (error) {
                throw new Error(`error fetch metnee password change by id  in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    updateMentee(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield menteeModel_1.default.updateOne({ email }, { $set: { verified: true } });
                console.log(data, 'verify data from repo');
                return data;
            }
            catch (error) {
                throw new Error(`error while updating mentee${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One({ email }); //find one in base repo
            }
            catch (error) {
                console.log('Error while finding user with email', email, error);
                throw new Error(`Error while finding user by Email${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    create_Mentee(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.createDocument(userData);
            }
            catch (error) {
                console.log(`error while doing signup ${error}`);
                throw new Error(`error while mentee Signup${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    mainLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One({ email });
            }
            catch (error) {
                throw new Error(`error  in DBMainLogin  while Checking User ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    forgot_PasswordChange(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One_And_Update(menteeModel_1.default, { email: email }, { $set: { password: password } });
            }
            catch (error) {
                console.log(`error while find and update on DBforget_passwordChange ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //admin data fetch
    adminLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One({ email });
            }
            catch (error) {
                console.log(`error while finding admin ${error instanceof Error ? error.message : String(error)}`);
                return null;
            }
        });
    }
    _find() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.find_One({ isAdmin: true });
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.menteeRepository = menteeRepository;
exports.default = new menteeRepository();
