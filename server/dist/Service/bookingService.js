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
exports.bookingService = void 0;
const stripe_1 = require("stripe");
const mongoose_1 = __importDefault(require("mongoose"));
const httpStatusCode_1 = require("../Constants/httpStatusCode");
const moment_1 = __importDefault(require("moment"));
const index_1 = require("../index");
const reusable_util_1 = require("../Utils/reusable.util");
const httpResponse_1 = require("../Constants/httpResponse");
const http_error_handler_util_1 = require("../Utils/http-error-handler.util");
class bookingService {
    constructor(_timeSlotRepository, _slotScheduleRepository, _notificationRepository, _chatRepository, __walletRepository, __transactionRepository, stripe = new stripe_1.Stripe(process.env.STRIPE_SECRET_KEY, {
        // apiVersion: "2025-02-24.acacia",
        maxNetworkRetries: 4,
    })) {
        this._timeSlotRepository = _timeSlotRepository;
        this._slotScheduleRepository = _slotScheduleRepository;
        this._notificationRepository = _notificationRepository;
        this._chatRepository = _chatRepository;
        this.__walletRepository = __walletRepository;
        this.__transactionRepository = __transactionRepository;
        this.stripe = stripe;
    }
    getTimeSlots(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mentorId) {
                    return {
                        status: httpStatusCode_1.Status.BadRequest,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        success: false,
                        timeSlots: [],
                    };
                }
                const response = yield this._timeSlotRepository.getMentorSlots(mentorId);
                if (!response) {
                    return {
                        status: httpStatusCode_1.Status.Ok,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        success: false,
                        timeSlots: [],
                    };
                }
                return {
                    status: httpStatusCode_1.Status.Ok,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.DATA_RETRIEVED,
                    success: true,
                    timeSlots: response,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //place slot booking
    slotBooking(timeSlot, messages, paymentMethod, totalAmount, mentorName, menteeId, protocol, host) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!timeSlot || !messages || !paymentMethod || !totalAmount) {
                    return {
                        status: httpStatusCode_1.Status.BadRequest,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        success: false,
                    };
                }
                if (paymentMethod == "stripe") {
                    const startStr = (0, moment_1.default)(timeSlot["startTime"]).format(`hh:mm A`);
                    const endStr = (0, moment_1.default)(timeSlot["endTime"]).format(`hh:mm A`);
                    const session = yield this.stripe.checkout.sessions.create({
                        payment_method_types: ["card"],
                        mode: "payment",
                        client_reference_id: String(menteeId),
                        line_items: [
                            {
                                price_data: {
                                    currency: "usd",
                                    unit_amount: parseInt(totalAmount) * 100,
                                    product_data: {
                                        name: `Mentor is ${decodeURIComponent(mentorName.toLocaleUpperCase())}`,
                                        description: `Slot date is: ${String(timeSlot === null || timeSlot === void 0 ? void 0 : timeSlot.startDate).split("T")[0]}
                time is ${startStr}-${endStr}`,
                                    },
                                },
                                quantity: 1,
                            },
                        ],
                        success_url: `${(_a = process.env) === null || _a === void 0 ? void 0 : _a.CLIENT_ORIGIN_URL}/mentee/stripe-success?session_id={CHECKOUT_SESSION_ID}&success=true`,
                        cancel_url: `${protocol}://${host}/mentee/stripe-cancel?cancelled=true`,
                        metadata: {
                            timeSlot: JSON.stringify(timeSlot),
                            messages,
                            paymentMethod,
                            menteeId: String(menteeId),
                        },
                    });
                    return {
                        success: true,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SUCCESS,
                        status: httpStatusCode_1.Status.Ok,
                        session,
                    };
                }
                else if (paymentMethod == "wallet") {
                    const deductAmountFromWallet = yield this.__walletRepository.deductAmountFromWallet(Number(totalAmount), menteeId);
                    if (!deductAmountFromWallet) {
                        return {
                            message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INSUFFICINET_BALANCE,
                            status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.BadRequest,
                            success: false,
                        };
                    }
                    const time = new Date().toLocaleString();
                    //create  new transaction
                    const newTranasaction = {
                        amount: Number(totalAmount),
                        walletId: deductAmountFromWallet === null || deductAmountFromWallet === void 0 ? void 0 : deductAmountFromWallet._id,
                        transactionType: "debit",
                        status: "completed",
                        note: "slot booked ",
                    };
                    yield this.__transactionRepository.createTransaction(newTranasaction);
                    // Insert data into newSlotSchedule
                    const newSlotSchedule = {
                        menteeId,
                        slotId: timeSlot === null || timeSlot === void 0 ? void 0 : timeSlot._id,
                        paymentStatus: "Paid",
                        paymentTime: time,
                        paymentMethod: "wallet",
                        paymentAmount: String(totalAmount),
                        duration: String(timeSlot === null || timeSlot === void 0 ? void 0 : timeSlot.duration),
                        description: messages,
                        status: "CONFIRMED",
                    };
                    const response = yield this._slotScheduleRepository.newSlotBooking(newSlotSchedule);
                    const mentorId = (_b = response === null || response === void 0 ? void 0 : response.times) === null || _b === void 0 ? void 0 : _b.mentorId;
                    yield this._timeSlotRepository.makeTimeSlotBooked(String(timeSlot === null || timeSlot === void 0 ? void 0 : timeSlot._id));
                    //notification for mentee
                    const notific = yield this._notificationRepository.createNotification(menteeId, `Slot booked successfully`, `Congratulations! You've been successfully booked your slot.`, `mentee`, `${process.env.CLIENT_ORIGIN_URL}/mentee/bookings`);
                    if (menteeId && notific) {
                        index_1.socketManager.sendNotification(String(menteeId), notific);
                    }
                    if (mentorId) {
                        //notification for mentor
                        const notif = yield this._notificationRepository.createNotification(mentorId, `Your new slot were Scheduled`, `new slot were scheduled . checkout now`, `mentor`, `${process.env.CLIENT_ORIGIN_URL}/mentor/session`);
                        //make it realtime using socket
                        index_1.socketManager.sendNotification(String(mentorId), notif);
                    }
                    //creating chat document
                    const resp = yield this._chatRepository.findChatRoom(mentorId, menteeId);
                    if (!resp) {
                        yield this._chatRepository.createChatDocs(mentorId, menteeId);
                    }
                    return {
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SLOT_BOOKED,
                        status: httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok,
                        success: true,
                    };
                }
                return {
                    success: false,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SOMETHING_WENT_WRONG,
                    status: httpStatusCode_1.Status.BadRequest,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    /**
     * Stripe Webhook handler for handling checkout.session.completed event.
     * @param signature Stripe webhook signature
     * @param bodyData Stripe webhook body data
     * @returns Promise<void>
     */
    stripeWebHook(signature, bodyData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log('this is inside booking webhook', signature, bodyData);
                if (!signature || !bodyData) {
                    throw new Error("Missing signature or body data in webhook request.");
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let event;
                try {
                    event = this.stripe.webhooks.constructEvent(bodyData, signature, process.env.STRIPE_WEBHOOK_BOOKING_SECRET);
                }
                catch (error) {
                    throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
                }
                // console.log("🔔 Received webhook event:", event.type);
                switch (event.type) {
                    case "checkout.session.completed": {
                        const session = event.data.object;
                        const metadata = session.metadata || {};
                        //if the data not exist send notification to mentee
                        if (!metadata ||
                            !metadata.menteeId ||
                            !metadata.timeSlot ||
                            !metadata.messages ||
                            !metadata.paymentMethod) {
                            // console.error("❌ Invalid or missing metadata in Stripe webhook");
                            // Redirect to error page when metadata is missing
                            const noti = yield this._notificationRepository.createNotification(metadata.menteeId, `Payment Failed`, `Your payment could not be processed. Please try again.`, `mentee`, "");
                            if ((metadata === null || metadata === void 0 ? void 0 : metadata.menteeId) && noti) {
                                index_1.socketManager.sendNotification(metadata === null || metadata === void 0 ? void 0 : metadata.menteeId, noti);
                            }
                            return;
                        }
                        const { timeSlot, messages, menteeId } = metadata;
                        if (!mongoose_1.default.Types.ObjectId.isValid(menteeId)) {
                            // console.error("Invalid menteeId format:", menteeId);
                            return;
                        }
                        const menteeObjectId = new mongoose_1.default.Types.ObjectId(menteeId);
                        const slotId = new mongoose_1.default.Types.ObjectId(JSON.parse(timeSlot)._id);
                        const status = session.payment_status == "paid" ? "Paid" : "Failed";
                        if (status === "Failed") {
                            // console.error("❌ Payment failed. Redirecting to error page.");
                            const notification = yield this._notificationRepository.createNotification(menteeObjectId, `Payment Failed`, `Your payment could not be processed. Please try again.`, `mentee`, "");
                            if (menteeId && notification) {
                                index_1.socketManager.sendNotification(menteeId, notification);
                            }
                            return;
                        }
                        const totalAmount = ((session === null || session === void 0 ? void 0 : session.amount_total) || 0) / 100;
                        const time = new Date((session === null || session === void 0 ? void 0 : session.created) * 1000).toISOString();
                        //checking wallet exist or not
                        const walletResponse = (yield this.__walletRepository.findWallet(menteeObjectId));
                        let newWallet = null;
                        // if wallet not exist create new one
                        if (!walletResponse) {
                            newWallet = yield this.__walletRepository.createWallet({
                                userId: menteeObjectId,
                                balance: 0,
                            });
                        }
                        //create  new transaction
                        const newTranasaction = {
                            amount: totalAmount,
                            walletId: (walletResponse
                                ? walletResponse === null || walletResponse === void 0 ? void 0 : walletResponse["_id"]
                                : newWallet._id),
                            transactionType: "paid",
                            status: "completed",
                            note: "slot booked successfully",
                        };
                        yield this.__transactionRepository.createTransaction(newTranasaction);
                        // Insert data into newSlotSchedule
                        const newSlotSchedule = {
                            menteeId: menteeObjectId,
                            slotId,
                            paymentStatus: status,
                            paymentTime: time,
                            paymentMethod: "stripe",
                            paymentAmount: String(totalAmount),
                            duration: (_a = JSON.parse(timeSlot)) === null || _a === void 0 ? void 0 : _a.duration,
                            description: messages,
                            status: "CONFIRMED",
                        };
                        const response = yield this._slotScheduleRepository.newSlotBooking(newSlotSchedule);
                        if (!response) {
                            return;
                        }
                        const mentorId = (_b = response.times) === null || _b === void 0 ? void 0 : _b.mentorId;
                        const mentorID = String(mentorId);
                        yield this._timeSlotRepository.makeTimeSlotBooked(String(slotId));
                        //notification for mentee
                        const notific = yield this._notificationRepository.createNotification(menteeObjectId, `Slot booked successfully`, `Congratulations! You've been successfully booked your slot.`, `mentee`, `${process.env.CLIENT_ORIGIN_URL}/mentee/bookings`);
                        if (menteeId && notific) {
                            index_1.socketManager.sendNotification(menteeId, notific);
                        }
                        if (mentorId) {
                            //notification for mentor
                            const notif = yield this._notificationRepository.createNotification(mentorId, httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.SLOT_SCHEDULE_TITLE, httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.SLOT_SCHEDULED, `mentor`, `${process.env.CLIENT_ORIGIN_URL}/mentor/session`);
                            //make it realtime using socket
                            index_1.socketManager.sendNotification(mentorID, notif);
                        }
                        //creating chat document
                        const resp = yield this._chatRepository.findChatRoom(mentorId, menteeObjectId);
                        if (!resp) {
                            yield this._chatRepository.createChatDocs(mentorId, menteeObjectId);
                        }
                        return;
                    }
                    case "checkout.session.expired":
                    case "checkout.session.failed": {
                        const session = event.data.object;
                        // console.error("❌ Payment Failed or Expired:");
                        if (session.metadata && session.metadata.menteeId) {
                            yield this._notificationRepository.createNotification(session.metadata.menteeId, httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.PAYMENT_FAILED, httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.PAYMENT_ATTEMPT_FALED, `mentee`, "");
                        }
                        return;
                    }
                    case "payment_intent.payment_failed": {
                        const session = event.data.object;
                        // console.error("❌ Payment Failed:");
                        if (session.metadata && session.metadata.menteeId) {
                            const notific = yield this._notificationRepository.createNotification(session.metadata.menteeId, httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.PAYMENT_FAILED, httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.PAYMENT_ATTEMPT_FALED, `mentee`, "");
                            index_1.socketManager.sendNotification(session.metadata.menteeId, notific);
                        }
                        return;
                    }
                    default:
                    // console.log(`Unhandled event type ${event.type}`);
                }
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //fetch mentee booked slots
    getBookedSlots(menteeId, currentTab, search, sortField, sortOrder, filter, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!menteeId ||
                    !currentTab ||
                    !sortField ||
                    !filter ||
                    !sortOrder ||
                    page < 1 ||
                    limit < 1 ||
                    !mongoose_1.default.Types.ObjectId.isValid(String(menteeId))) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        slots: [],
                        totalPage: 0,
                    };
                }
                const skipData = (0, reusable_util_1.createSkip)(page, limit);
                const limitNo = skipData === null || skipData === void 0 ? void 0 : skipData.limitNo;
                const skip = skipData === null || skipData === void 0 ? void 0 : skipData.skip;
                const tabCond = currentTab == "upcoming" ? false : true;
                const response = yield this._slotScheduleRepository.getBookedSlot(menteeId, tabCond, "mentee", skip, limitNo, search, sortOrder, sortField, filter);
                if ((response === null || response === void 0 ? void 0 : response.slots.length) < 0 || (response === null || response === void 0 ? void 0 : response.totalDocs) < 0) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.Ok,
                        slots: [],
                        totalPage: 0,
                    };
                }
                const totalPage = Math.ceil((response === null || response === void 0 ? void 0 : response.totalDocs) / limitNo);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_FOUND,
                    status: httpStatusCode_1.Status.Ok,
                    slots: response === null || response === void 0 ? void 0 : response.slots,
                    totalPage,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    getBookedSessions(mentorId, currentTab, search, sortField, sortOrder, filter, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mentorId ||
                    !currentTab ||
                    !sortField ||
                    !sortOrder ||
                    !filter ||
                    page < 1 ||
                    limit < 1 ||
                    !mongoose_1.default.Types.ObjectId.isValid(String(mentorId))) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.NotFound,
                        slots: [],
                        totalPage: 0,
                    };
                }
                const tabCond = currentTab == "upcoming" ? false : true;
                const skipData = (0, reusable_util_1.createSkip)(page, limit);
                const limitNo = skipData === null || skipData === void 0 ? void 0 : skipData.limitNo;
                const skip = skipData === null || skipData === void 0 ? void 0 : skipData.skip;
                const response = yield this._slotScheduleRepository.getBookedSession(skip, limitNo, search, filter, sortOrder, sortField, tabCond, mentorId);
                if ((response === null || response === void 0 ? void 0 : response.slots.length) < 0 || (response === null || response === void 0 ? void 0 : response.totalDoc) < 0) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.Ok,
                        slots: [],
                        totalPage: 0,
                    };
                }
                const totalPage = Math.ceil((response === null || response === void 0 ? void 0 : response.totalDoc) / limitNo);
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_FOUND,
                    status: httpStatusCode_1.Status.Ok,
                    slots: response === null || response === void 0 ? void 0 : response.slots,
                    totalPage,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    cancelSlot(sessionId, reason, customReason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!sessionId || !reason || (reason == "other" && customReason == "")) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        result: null,
                    };
                }
                let issue = undefined;
                if (reason !== "other") {
                    issue = reason;
                }
                else {
                    issue = customReason;
                }
                const response = yield this._slotScheduleRepository.cancelSlot(sessionId, issue);
                if (!response) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.FAILED,
                        status: httpStatusCode_1.Status.NotFound,
                        result: null,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SLOT_CANCEL_REQUESTED,
                    status: httpStatusCode_1.Status.Ok,
                    result: response,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //mentor handle cancel slot req
    mentorSlotCancel(sessionId, statusValue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!sessionId || !statusValue) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        result: null,
                    };
                }
                const response = yield this._slotScheduleRepository.mentorSlotCancel(sessionId, statusValue);
                yield this._timeSlotRepository.releaseTimeSlot(String(response === null || response === void 0 ? void 0 : response.slotId));
                if (!response) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                        result: null,
                    };
                }
                let title = "";
                let message = "";
                let url = "";
                if (statusValue === "CANCELLED") {
                    const addToWallet = yield this.__walletRepository.updateWalletAmount(response === null || response === void 0 ? void 0 : response.menteeId, Number(response === null || response === void 0 ? void 0 : response.paymentAmount));
                    let createWallet = null;
                    if (!addToWallet) {
                        createWallet = yield this.__walletRepository.createWallet({
                            userId: response === null || response === void 0 ? void 0 : response.menteeId,
                            balance: Number(response === null || response === void 0 ? void 0 : response.paymentAmount),
                        });
                    }
                    const newTranasaction = {
                        amount: Number(response === null || response === void 0 ? void 0 : response.paymentAmount),
                        walletId: (addToWallet
                            ? addToWallet === null || addToWallet === void 0 ? void 0 : addToWallet._id
                            : createWallet === null || createWallet === void 0 ? void 0 : createWallet["_id"]),
                        transactionType: "credit",
                        status: "completed",
                        note: httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.CANCELLD_AMOUNT_CREDIT,
                    };
                    yield this.__transactionRepository.createTransaction(newTranasaction);
                    title = `cancel amount $${response === null || response === void 0 ? void 0 : response.paymentAmount} refunded`;
                    message = "session cancel approved,amount credited to your wallet";
                    url = `${process.env.CLIENT_ORIGIN_URL}/mentee/wallet`;
                }
                else {
                    title = `cancel request rejected`;
                    message = "session cancel rejected,attend the session on time";
                    url = `${process.env.CLIENT_ORIGIN_URL}/mentee/bookings`;
                }
                const notif = yield this._notificationRepository.createNotification(response === null || response === void 0 ? void 0 : response.menteeId, title, message, "mentee", url);
                if (notif) {
                    index_1.socketManager.sendNotification(String(response === null || response === void 0 ? void 0 : response.menteeId), notif);
                }
                return {
                    success: true,
                    message: `${statusValue == "CANCELLED" ? "cancel approved" : "cancel rejected"} successfully`,
                    status: httpStatusCode_1.Status.Ok,
                    result: response,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //create session code
    createSessionCode(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!bookingId) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        sessionCode: null,
                    };
                }
                //generate sessionCode
                const session_Code = (0, reusable_util_1.generateSessionCode)();
                const response = yield this._slotScheduleRepository.createSessionCode(bookingId, session_Code);
                if (!response) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                        sessionCode: null,
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SESSION_CODE_CREATED,
                    status: httpStatusCode_1.Status.Ok,
                    sessionCode: response,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //session completed marking
    sessionCompleted(bookingId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!bookingId || !mentorId) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        sessionStatus: null,
                    };
                }
                const response = yield this._slotScheduleRepository.sessionCompleted(bookingId);
                if (!response) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                        sessionStatus: null,
                    };
                }
                //calculate mentor cash;
                const paymentAmount = Number((response === null || response === void 0 ? void 0 : response.paymentAmount) || 0);
                const mentorCommissionRate = Number(process.env.MENTOR_COMMISION || 0);
                const mentorCommission = (paymentAmount * mentorCommissionRate);
                const result = yield this.__walletRepository.findWallet(mentorId);
                let newWallet = null;
                if (!result) {
                    newWallet = yield (this === null || this === void 0 ? void 0 : this.__walletRepository.createWallet({
                        userId: mentorId,
                        balance: mentorCommission,
                    }));
                }
                else {
                    yield this.__walletRepository.updateWalletAmount(mentorId, mentorCommission);
                }
                const newTransaction = {
                    amount: mentorCommission,
                    walletId: (result ? result === null || result === void 0 ? void 0 : result._id : newWallet === null || newWallet === void 0 ? void 0 : newWallet["_id"]),
                    transactionType: "credit",
                    status: "completed",
                    note: httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.EARNINGS_CREDITED_TO_WALLET,
                };
                yield this.__transactionRepository.createTransaction(newTransaction);
                const notification = yield this._notificationRepository.createNotification(mentorId, httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.EARNING_CREDITED, httpResponse_1.NOTIFY === null || httpResponse_1.NOTIFY === void 0 ? void 0 : httpResponse_1.NOTIFY.EARNING_CREDIT_MESSAGE, "mentor", `${process.env.CLIENT_ORIGIN_URL}/mentor/wallet`);
                if (notification) {
                    index_1.socketManager.sendNotification(String(mentorId), notification);
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.SESSION_COMPLETED,
                    status: httpStatusCode_1.Status.Ok,
                    sessionStatus: response === null || response === void 0 ? void 0 : response.status,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //validating user alloweded to join to the session
    validateSessionJoin(sessionId, sessionCode, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!sessionId || !sessionCode || !userId) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.INVALID_CREDENTIALS,
                        status: httpStatusCode_1.Status.BadRequest,
                        session_Code: "",
                    };
                }
                const response = yield this._slotScheduleRepository.validateSessionJoin(new mongoose_1.default.Types.ObjectId(sessionId), sessionCode, userId);
                if (!response) {
                    return {
                        success: false,
                        message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.RESOURCE_NOT_FOUND,
                        status: httpStatusCode_1.Status.NotFound,
                        session_Code: "",
                    };
                }
                return {
                    success: true,
                    message: httpResponse_1.HttpResponse === null || httpResponse_1.HttpResponse === void 0 ? void 0 : httpResponse_1.HttpResponse.USER_VERIFIED,
                    status: httpStatusCode_1.Status.Ok,
                    session_Code: response === null || response === void 0 ? void 0 : response.sessionCode,
                };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.bookingService = bookingService;
