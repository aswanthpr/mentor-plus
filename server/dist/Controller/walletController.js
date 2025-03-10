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
class walletController {
    constructor(__walletService) {
        this.__walletService = __walletService;
    }
    // mentee add money to wallet 
    addMoneyToWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { amount } = req.body;
                const response = yield ((_a = this.__walletService) === null || _a === void 0 ? void 0 : _a.addMoenyToWallet(amount, req.user));
                res.json(response);
            }
            catch (error) {
                throw new Error(`error while add money to wallet ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    walletStripeWebHook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signature = req.headers["stripe-signature"];
                yield this.__walletService.walletStripeWebHook(signature, req.body);
                res.status(200).json({ success: true });
            }
            catch (error) {
                throw new Error(`Error while  webhook config ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //fetch wallet data
    getWalletData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, message, walletData, success } = yield this.__walletService.getWalletData(req.user);
                res.status(status).json({ message, success, walletData });
            }
            catch (error) {
                throw new Error(`Error while fetch walletData ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.walletController = walletController;
