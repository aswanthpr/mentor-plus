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
exports.baseRepository = void 0;
const http_error_handler_util_1 = require("../Utils/http-error-handler.util");
const httpStatusCode_1 = require("../Constants/httpStatusCode");
class baseRepository {
    constructor(model) {
        this.model = model;
    }
    // find using email
    find_One(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne(filter).exec();
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    // new mentee create
    createDocument(docData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = new this.model(docData);
                return yield entity.save();
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    find_By_Id(Id, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findById(Id, filter).exec();
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    find_One_And_Update(model_1, filter_1, update_1) {
        return __awaiter(this, arguments, void 0, function* (model, filter, update, options = { new: true }) {
            try {
                return yield model.findOneAndUpdate(filter, update, options).exec();
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    find(model_1, filter_1) {
        return __awaiter(this, arguments, void 0, function* (model, filter, options = {}) {
            try {
                return yield model.find(filter, null, options).exec();
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    find_By_Id_And_Update(model_1, id_1, updateData_1) {
        return __awaiter(this, arguments, void 0, function* (model, id, updateData, options = { new: true }, populate) {
            try {
                const query = model.findByIdAndUpdate(id, updateData, Object.assign({ new: true }, options));
                if (populate) {
                    if (typeof populate === "string") {
                        query.populate({ path: populate });
                    }
                    else {
                        query.populate(populate);
                    }
                }
                return yield query.exec();
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    // aggregation pipine resuable code
    aggregateData(model, aggregationPipeline) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Execute the aggregation pipeline
                return yield model.aggregate(aggregationPipeline).exec();
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    deleteDocument(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.deleteOne({ _id: Id }).exec();
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    deleteMany(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.deleteMany(filter).exec();
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    insert_Many(model, documents) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield model.insertMany(documents);
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    countDocument(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.countDocuments(filter);
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.baseRepository = baseRepository;
