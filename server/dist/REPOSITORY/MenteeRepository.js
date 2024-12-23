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
exports.MenteeRepository = void 0;
const MenteeModel_1 = __importDefault(require("../MODEL/MenteeModel"));
const BaseRepo_1 = require("./BaseRepo");
class MenteeRepository extends BaseRepo_1.BaseRepository {
    constructor() {
        super(MenteeModel_1.default);
    }
    dbMenteeData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find(MenteeModel_1.default, { isAdmin: false });
            }
            catch (error) {
                throw new Error(`error while Checking mentee data ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    dbChangeMenteeStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(MenteeModel_1.default, id, [{ $set: { "isBlocked": { $not: '$isBlocked' } } }]);
            }
            catch (error) {
                throw new Error(`error while change mentee status in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    dbEditMentee(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(MenteeModel_1.default, formData.id, { $set: { name: formData.name, email: formData.email, phone: formData.phone, bio: formData.bio } });
            }
            catch (error) {
                throw new Error(`error while edit mentee data in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    dbFindMentee(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One({ email });
            }
            catch (error) {
                throw new Error(`error find mentee data in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
    dbAddMentee(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.createDocument({
                    name: formData === null || formData === void 0 ? void 0 : formData.name, email: formData === null || formData === void 0 ? void 0 : formData.email, phone: formData === null || formData === void 0 ? void 0 : formData.phone, bio: formData === null || formData === void 0 ? void 0 : formData.bio
                });
            }
            catch (error) {
                throw new Error(`error add mentee data in repository ${error instanceof Error ? error.message : String(error)} `);
            }
        });
    }
}
exports.MenteeRepository = MenteeRepository;
exports.default = new MenteeRepository();
