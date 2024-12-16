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
const MenteeModel_1 = __importDefault(require("../MODEL/MenteeModel"));
const BaseRepo_1 = require("./BaseRepo");
class AuthRepository extends BaseRepo_1.BaseRepository {
    constructor() {
        super(MenteeModel_1.default);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('this is auth repoo');
                return yield this.findOne({ email }); //find one in base repo
            }
            catch (error) {
                console.log('Error while finding user with email', email, error);
                throw new Error('Error while finding user by Email');
            }
        });
    }
    create_Mentee(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.createMentee(userData);
            }
            catch (error) {
                console.log(`error while doing signup ${error}`);
                throw new Error("error while mentee Signup");
            }
        });
    }
}
exports.default = new AuthRepository();
