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
exports.walletController = void 0;
const httpStatusCode_1 = require("../Constants/httpStatusCode");
class walletController {
    constructor(__walletService) {
        this.__walletService = __walletService;
    }
    // mentee add money to wallet 
    addMoneyToWallet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { amount } = req.body;
                const response = yield ((_a = this.__walletService) === null || _a === void 0 ? void 0 : _a.addMoenyToWallet(amount, req.user));
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    walletStripeWebHook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signature = req.headers["stripe-signature"];
                yield this.__walletService.walletStripeWebHook(signature, req.body);
                res.status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok).json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //fetch wallet data
    getWalletData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { role, search, filter, page, limit } = req.query;
                console.log(role, search, filter, page, limit);
                const { status, message, walletData, success, totalPage } = yield this.__walletService.getWalletData(req.user, String(role), String(search), String(filter), Number(page), Number(limit));
                res.status(status).json({ message, success, walletData, totalPage });
            }
            catch (error) {
                next(error);
            }
        });
    }
    withdrawMentorEarnings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { amount } = req.body;
                const { message, status, result, success } = yield this.__walletService.withdrawMentorEarnings(amount, req.user);
                console.log(result, success);
                res.status(status).json({ message, success, result });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.walletController = walletController;
