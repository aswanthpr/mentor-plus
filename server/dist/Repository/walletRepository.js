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
const walletModel_1 = __importDefault(require("../Model/walletModel"));
const baseRepo_1 = require("./baseRepo");
class walletRepository extends baseRepo_1.baseRepository {
    constructor() {
        super(walletModel_1.default);
    }
    createWallet(walletData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.createDocument(walletData);
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    findWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One({ userId });
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //update wallet data
    updateWalletAmount(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One_And_Update(walletModel_1.default, { userId }, {
                    $inc: { balance: amount },
                });
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    findWalletWithTransaction(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield this.aggregateData(walletModel_1.default, [
                    {
                        $match: {
                            userId,
                        },
                    },
                    {
                        $lookup: {
                            from: "transactions",
                            localField: "_id",
                            foreignField: "walletId",
                            as: "transaction",
                        },
                    },
                    {
                        $sort: { "transaction.createadAt": -1 },
                    },
                ]);
                return resp === null || resp === void 0 ? void 0 : resp[0];
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    deductAmountFromWallet(amount, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One_And_Update(walletModel_1.default, {
                    userId,
                    balance: { $gte: amount },
                }, {
                    $inc: { balance: -amount },
                }, { new: true });
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = new walletRepository();
