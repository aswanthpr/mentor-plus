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
exports.AdminService = void 0;
class AdminService {
    constructor(_CategoryRepository, _MenteeRepository) {
        this._CategoryRepository = _CategoryRepository;
        this._MenteeRepository = _MenteeRepository;
    }
    blCreateCategory(Data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category } = Data;
                if (!category) {
                    return { success: false, message: "input data is missing", status: 400 };
                }
                const result = yield this._CategoryRepository.dbFindCategory(category);
                if (result) {
                    return { success: false, message: "category is existing", status: 409 };
                }
                const response = yield this._CategoryRepository.dbCreateCategory(category);
                if ((response === null || response === void 0 ? void 0 : response.category) != category) {
                    return { success: false, message: "unexpected error happend", status: 409 };
                }
                return { success: true, message: "category created successfully", status: 201 };
            }
            catch (error) {
                throw new Error(`error while create category in service ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //get category data to admin
    blCategoryData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._CategoryRepository.dbcategoryData();
                if (!result) {
                    return { success: false, message: "No categories found" };
                }
                return {
                    success: true,
                    message: "Data retrieved successfully",
                    categories: result,
                };
            }
            catch (error) {
                throw new Error(`Error while getting category data in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //category edit controll
    blEditCategory(id, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!category || !id) {
                    return { success: false, message: "credential is  missing" };
                }
                const resp = yield this._CategoryRepository.dbFindCategory(category);
                console.log(resp, "thsi is resp");
                if (resp) {
                    return { success: false, message: "category already exitst" };
                }
                const result = yield this._CategoryRepository.dbEditCategory(id, category);
                console.log(result, "this is edit categor result");
                if (!result) {
                    return { success: false, message: "category not found" };
                }
                return { success: true, message: "category edited successfully" };
            }
            catch (error) {
                throw new Error(`Error while eding category  in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    blChangeCategoryStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    return {
                        success: false,
                        message: "credential is missing",
                        status: 400,
                    };
                }
                const result = yield this._CategoryRepository.dbChangeCategoryStatus(id);
                if (!result) {
                    return { success: false, message: "category not found", status: 400 };
                }
                return {
                    success: true,
                    message: "category Edited successfully",
                    status: 200,
                };
            }
            catch (error) {
                throw new Error(`Error while change category status in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    blMenteeData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._MenteeRepository.dbMenteeData();
                if (!result) {
                    return { success: false, message: "Users not  found", status: 400, };
                }
                return {
                    success: true,
                    message: "Data retrieved successfully",
                    status: 200,
                    Data: result,
                };
            }
            catch (error) {
                throw new Error(`Error while get mentee data in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    blChangeMenteeStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!id) {
                    return {
                        success: false,
                        message: "credential is missing",
                        status: 400,
                    };
                }
                const result = yield this._MenteeRepository.dbChangeMenteeStatus(id);
                if (!result) {
                    return { success: false, message: "mentee not found", status: 400 };
                }
                return {
                    success: true,
                    message: "mentee Edited successfully",
                    status: 200,
                };
            }
            catch (error) {
                throw new Error(`Error while update  mentee status in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    blEditMentee(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(formData);
                if (!formData) {
                    return { success: false, message: "credential is  missing" };
                }
                const result = yield this._MenteeRepository.dbEditMentee(formData);
                console.log(result, "this is edit mentee result");
                if (!result) {
                    return { success: false, message: "mentee not found" };
                }
                return { success: true, message: "Mentee updated successfully!", status: 200 };
            }
            catch (error) {
                throw new Error(`Error while Edit  mentee data in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    blAddMentee(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, bio } = formData;
                if (!name || !email || !phone || !bio) {
                    return { success: false, message: " credential is missing" };
                }
                const result = yield this._MenteeRepository.dbFindMentee(email);
                if (result) {
                    return { success: false, message: "email is existing" };
                }
                const response = yield this._MenteeRepository.dbAddMentee(formData);
                return { success: true, message: "mentee added successfully", status: 200, mentee: response };
            }
            catch (error) {
                throw new Error(`Error while add  mentee data in service: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.AdminService = AdminService;
