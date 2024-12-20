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
                throw new Error(`error while finding ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    // new mentee create
    createMentee(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = new this.model(userData);
                return yield entity.save();
            }
            catch (error) {
                throw new Error(`${'\x1b[35m%s\x1b[0m'}error while creating entity:${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    find_By_Id(Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findById(Id).exec();
            }
            catch (error) {
                console.log('error while find_By_Id ', error instanceof Error ? error.message : String(error));
            }
        });
    }
    find_One_And_Update(model_1, filter_1, update_1) {
        return __awaiter(this, arguments, void 0, function* (model, filter, update, options = { new: true }) {
            try {
                return yield model.findOneAndUpdate(filter, update, options);
            }
            catch (error) {
                throw new Error(`${'\x1b[35m%s\x1b[0m'}error while creating entity:${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
