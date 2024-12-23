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
exports.BaseRepository = void 0;
class BaseRepository {
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
                throw new Error(`Error while finding entity: ${error instanceof Error ? error.message : String(error)}`);
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
                throw new Error(`Error while creating document: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    find_By_Id(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findById(Id).exec();
            }
            catch (error) {
                console.log(`Error while finding by ID: ${error instanceof Error ? error.message : String(error)}`);
                return null; // Return null if there's an error
            }
        });
    }
    find_One_And_Update(model_1, filter_1, update_1) {
        return __awaiter(this, arguments, void 0, function* (model, filter, update, options = { new: true }) {
            try {
                return yield model.findOneAndUpdate(filter, update, options);
            }
            catch (error) {
                throw new Error(`${'\x1b[35m%s\x1b[0m'} Error while updating entity: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    find(model_1, filter_1) {
        return __awaiter(this, arguments, void 0, function* (model, filter, options = {}) {
            try {
                return yield model.find(filter, null, options);
            }
            catch (error) {
                throw new Error(`Error while finding entities: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    find_By_Id_And_Update(model_1, id_1, updateData_1) {
        return __awaiter(this, arguments, void 0, function* (model, id, updateData, options = {}) {
            try {
                return yield model.findByIdAndUpdate(id, updateData, Object.assign({ new: true }, options));
            }
            catch (error) {
                throw new Error(`Error while finding entities: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
