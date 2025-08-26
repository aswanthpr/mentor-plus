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
const categorySchema_1 = __importDefault(require("../../Model/categorySchema"));
const baseRepo_1 = require("../baseRepo");
const http_error_handler_util_1 = require("../../Utils/http-error-handler.util");
const httpStatusCode_1 = require("../../Constants/httpStatusCode");
class categoryRespository extends baseRepo_1.baseRepository {
    constructor() {
        super(categorySchema_1.default);
    }
    findCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One({ category });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    createCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.createDocument({ category });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    categoryData(searchQuery, statusFilter, sortField, sortOrder, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pipeline = [];
                if (searchQuery) {
                    pipeline.push({
                        $match: { category: { $regex: searchQuery, $options: "i" } },
                    });
                }
                if (statusFilter !== "all") {
                    pipeline.push({
                        $match: { isBlocked: statusFilter === "blocked" },
                    });
                }
                // Sorting Logic
                if (sortField === "atoz" || sortField === "ztoa") {
                    const sortOrderValue = sortField === "atoz" ? 1 : -1;
                    pipeline.push({ $sort: { category: sortOrderValue } });
                }
                else {
                    // Default Sorting 
                    pipeline.push({ $sort: { createdAt: sortOrder === "asc" ? 1 : -1 } });
                }
                pipeline.push({ $skip: skip });
                pipeline.push({ $limit: limit });
                const countPipeline = [
                    ...JSON.parse(JSON.stringify(pipeline)).slice(0, -2),
                    { $count: "totalDocuments" },
                ];
                const [category, totalCount] = yield Promise.all([
                    this.aggregateData(categorySchema_1.default, pipeline),
                    categorySchema_1.default.aggregate(countPipeline),
                ]);
                return {
                    category,
                    totalDoc: ((_a = totalCount === null || totalCount === void 0 ? void 0 : totalCount[0]) === null || _a === void 0 ? void 0 : _a.totalDocuments) || 0,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    allCategoryData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find(categorySchema_1.default, {});
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //editing category;
    editCategory(id, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(categorySchema_1.default, id, {
                    $set: { category: category },
                });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    changeCategoryStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(categorySchema_1.default, id, [
                    { $set: { isBlocked: { $not: "$isBlocked" } } },
                ]);
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.default = new categoryRespository();
