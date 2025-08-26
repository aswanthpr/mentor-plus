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
exports.walletService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const httpStatusCode_1 = require("../Constants/httpStatusCode");
const stripe_1 = __importDefault(require("stripe"));
const index_1 = require("../index");
const httpResponse_1 = require("../Constants/httpResponse");
const index_2 = require("../Utils/index");
class walletService {
    constructor(__walletRepository, __transactionRepository, __notificationRepository, stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, { maxNetworkRetries: 5 })) {
        this.__walletRepository = __walletRepository;
        this.__transactionRepository = __transactionRepository;
        this.__notificationRepository = __notificationRepository;
        this.stripe = stripe;
    }
    //add money wallet
    addMoenyToWallet(amount, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!amount || !userId) {
                    return {
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        success: false,
                    };
                }
                const session = yield this.stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    line_items: [
                        {
                            price_data: {
                                currency: "usd",
                                unit_amount: amount * 100,
                                product_data: {
                                    name: "Wallet Top-up",
                                    description: "Add funds to your wallet",
                                },
                            },
                            quantity: 1,
                        },
                    ],
                    mode: "payment",
                    success_url: `${(_a = process.env) === null || _a === void 0 ? void 0 : _a.CLIENT_ORIGIN_URL}/mentee/wallet?success=true`,
                    cancel_url: `${(_b = process.env) === null || _b === void 0 ? void 0 : _b.CLIENT_ORIGIN_URL}/mentee/stripe-cancel?cancelled=true`,
                    metadata: {
                        userId: userId.toString(),
                        amount,
                    },
                    custom_text: {
                        submit: { message: "Complete Secure Payment" },
                    },
                });
                return {
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.PAYMENT_INTENT_CREATED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    success: true,
                    session,
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    walletStripeWebHook(signature, bodyData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!signature || !bodyData) {
                    throw new Error(httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.WEBHOOK_SIGNATURE_MISSING);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let event;
                try {
                    event = this.stripe.webhooks.constructEvent(bodyData, signature, process.env.STRIPE_WEBHOOK_WALLET_SECRET);
                }
                catch (error) {
                    throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
                }
                console.log("🔔 Received webhook event:");
                switch (event === null || event === void 0 ? void 0 : event.type) {
                    case "checkout.session.completed": {
                        const session = event.data.object;
                        const metaData = session.metadata || {};
                        if (!(session === null || session === void 0 ? void 0 : session.metadata)) {
                            console.error("Missing metadata in Stripe session");
                            return;
                        }
                        const { amount, userId } = metaData;
                        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                            console.error("Invalid menteeId format:", userId);
                            return;
                        }
                        const menteeId = new mongoose_1.default.Types.ObjectId(userId);
                        const response = (yield this.__walletRepository.findWallet(menteeId));
                        let newWallet = null;
                        if (!response) {
                            newWallet = yield this.__walletRepository.createWallet({
                                userId: menteeId,
                                balance: 0,
                            });
                        }
                        else {
                            yield this.__walletRepository.updateWalletAmount(menteeId, Number(amount));
                        }
                        const newTranasaction = {
                            amount: Number(amount),
                            walletId: (response
                                ? response === null || response === void 0 ? void 0 : response["_id"]
                                : newWallet === null || newWallet === void 0 ? void 0 : newWallet._id),
                            transactionType: "credit",
                            status: "completed",
                            note: "wallet top-up",
                        };
                        yield this.__transactionRepository.createTransaction(newTranasaction);
                        const notification = yield this.__notificationRepository.createNotification(menteeId, "money added to wallet", "wallet balance added successfully!", "mentee", `${process.env.CLIENT_ORIGIN_URL}/mentee/wallet`);
                        //real time notification
                        if (menteeId && notification) {
                            index_1.socketManager.sendNotification(userId, notification);
                        }
                    }
                }
                return;
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //fetch wallet data ;
    getWalletData(userId, role, search, filter, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!userId || !role || !filter || page < 1 || limit < 1) {
                    return {
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        success: false,
                        walletData: null,
                        totalPage: 0
                    };
                }
                const skipData = (0, index_2.createSkip)(page, limit);
                const limitNo = skipData === null || skipData === void 0 ? void 0 : skipData.limitNo;
                const skip = skipData === null || skipData === void 0 ? void 0 : skipData.skip;
                const result = yield this.__walletRepository.findWalletWithTransaction(userId, skip, limit, search, filter);
                const totalPage = (result === null || result === void 0 ? void 0 : result.totalDocs) > 0 ? Math.ceil((result === null || result === void 0 ? void 0 : result.totalDocs) / limitNo) : 1;
                return {
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    success: true,
                    walletData: result === null || result === void 0 ? void 0 : result.transaction,
                    totalPage
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    withdrawMentorEarnings(amount, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!amount || !userId) {
                    return {
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        success: false,
                        result: null,
                    };
                }
                if (typeof amount !== 'number' && amount < 500) {
                    return {
                        message: "Withdrawals below ₹500 are not allowed. Please enter a higher amount",
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        success: false,
                        result: null,
                    };
                }
                const result = yield this.__walletRepository.deductAmountFromWallet(amount, userId);
                if (!result) {
                    return {
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                        success: false,
                        result: null,
                    };
                }
                const newTranasaction = {
                    amount: Number(amount),
                    walletId: result === null || result === void 0 ? void 0 : result._id,
                    transactionType: "debit",
                    status: "completed",
                    note: "balance withdrawed ",
                };
                const transaction = yield this.__transactionRepository.createTransaction(newTranasaction);
                const notification = yield this.__notificationRepository.createNotification(result === null || result === void 0 ? void 0 : result.userId, "withdraw balance", "money deducted. shortly credited in bank!", "mentor", `${process.env.CLIENT_ORIGIN_URL}/mentor/wallet`);
                //real time notification
                if ((result === null || result === void 0 ? void 0 : result._id) && notification) {
                    index_1.socketManager.sendNotification(String(result === null || result === void 0 ? void 0 : result._id), notification);
                }
                return {
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.APPLIED_FOR_WITHDRAW,
                    status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                    success: true,
                    result: transaction,
                };
            }
            catch (error) {
                throw new index_2.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.walletService = walletService;
