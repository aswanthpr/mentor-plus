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
exports.AdminRespository = void 0;
const categorySchema_1 = __importDefault(require("../MODEL/categorySchema"));
const BaseRepo_1 = require("./BaseRepo");
class AdminRespository extends BaseRepo_1.BaseRepository {
    constructor() {
        super(categorySchema_1.default);
    }
    dbFindCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One({ category });
            }
            catch (error) {
                throw new Error(`error while find category in repository ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    dbCreateCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.createDocument({ category });
            }
            catch (error) {
                throw new Error(`error while create category in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
}
exports.AdminRespository = AdminRespository;
