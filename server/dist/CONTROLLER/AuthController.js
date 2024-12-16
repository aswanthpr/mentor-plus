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
exports.AuthController = void 0;
class AuthController {
    constructor(_AuthService) {
        this._AuthService = _AuthService;
    }
    menteeSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "signup req body");
                yield this._AuthService.mentee_Signup(req.body);
                yield this._AuthService.
                    res.json({ success: true, message: 'otp successfully send to mail' });
            }
            catch (error) {
                console.error('error during mentee registration');
                throw new Error(`error while mentee Signup ${error instanceof Error ? error.message : error}`);
            }
        });
    }
}
exports.AuthController = AuthController;
