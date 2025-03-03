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
const httpStatusCode_1 = require("../Utils/httpStatusCode");
const moment_1 = __importDefault(require("moment"));
const index_1 = require("../index");
class bookingService {
    constructor(_timeSlotRepository, _slotScheduleRepository, _notificationRepository, _chatRepository, stripe = new stripe_1.Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-02-24.acacia",
        maxNetworkRetries: 4,
    })) {
        this._timeSlotRepository = _timeSlotRepository;
        this._slotScheduleRepository = _slotScheduleRepository;
        this._notificationRepository = _notificationRepository;
        this._chatRepository = _chatRepository;
        this.stripe = stripe;
    }
    getTimeSlots(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!mentorId) {
                    return {
                        status: httpStatusCode_1.Status.BadRequest,
                        message: "credential not found",
                        success: false,
                        timeSlots: [],
                        platformFee: undefined,
                    };
                }
                const response = yield this._timeSlotRepository.getMentorSlots(mentorId);
                if (!response) {
                    return {
                        status: httpStatusCode_1.Status.Ok,
                        message: "Data not found",
                        success: false,
                        timeSlots: [],
                        platformFee: undefined,
                    };
                }
                console.log(response, "from service");
                return {
                    status: httpStatusCode_1.Status.Ok,
                    message: "Data fetched successfully",
                    success: true,
                    timeSlots: response,
                    platformFee: (_a = process.env) === null || _a === void 0 ? void 0 : _a.PLATFORM_FEE,
                };
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)} error while gettign Time Slots in mentee service`);
            }
        });
    }
    //place slot booking
    slotBooking(timeSlot, message, paymentMethod, totalAmount, mentorName, menteeId, protocol, host) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log(timeSlot, message, paymentMethod, totalAmount);
                if (!timeSlot || !message || !paymentMethod || !totalAmount) {
                    return {
                        status: httpStatusCode_1.Status.BadRequest,
                        message: "credential not found",
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
                                        name: `Your mentor is  ${mentorName.toLocaleUpperCase()}`,
                                        description: `YOUR SLOT DATE IS :${String(timeSlot === null || timeSlot === void 0 ? void 0 : timeSlot.startDate).split("T")[0]}
                TIME IS IN BETWEEN ${startStr}-${endStr}`,
                                    },
                                },
                                quantity: 1,
                            },
                        ],
                        success_url: `${(_a = process.env) === null || _a === void 0 ? void 0 : _a.CLIENT_ORIGIN_URL}/mentee/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
                        cancel_url: `${protocol}://${host}/mentee/stripe-cancel`,
                        metadata: {
                            timeSlot: JSON.stringify(timeSlot),
                            message,
                            paymentMethod,
                            menteeId: String(menteeId),
                        },
                    });
                    return {
                        success: true,
                        message: "successfully send the respne",
                        status: httpStatusCode_1.Status.Ok,
                        session,
                    };
                }
                return {
                    success: false,
                    message: "error while payment",
                    status: httpStatusCode_1.Status.NotFound,
                };
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)} error while place Slot booking in mentee service`);
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
                if (!signature || !bodyData) {
                    throw new Error("Missing signature or body data in webhook request.");
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let event;
                try {
                    event = this.stripe.webhooks.constructEvent(bodyData, signature, process.env.STRIPE_WEBHOOK_SECRET);
                }
                catch (err) {
                    console.error("⚠️ Webhook signature verification failed.", err instanceof Error ? err.message : String(err));
                    return;
                }
                console.log("🔔 Received webhook event:", event.type);
                switch (event.type) {
                    case "checkout.session.completed": {
                        const session = event.data.object;
                        const metadata = session.metadata || {};
                        if (!session.metadata) {
                            console.error("Missing metadata in Stripe session");
                            return;
                        }
                        const { timeSlot, message, paymentMethod, menteeId } = metadata;
                        if (!timeSlot || !message || !paymentMethod || !menteeId) {
                            console.error("Invalid or missing metadata in Stripe webhook");
                            return;
                        }
                        if (!mongoose_1.default.Types.ObjectId.isValid(menteeId)) {
                            console.error("Invalid menteeId format:", menteeId);
                            return;
                        }
                        const menteeObjectId = new mongoose_1.default.Types.ObjectId(menteeId);
                        const slotId = new mongoose_1.default.Types.ObjectId(JSON.parse(timeSlot)._id);
                        const status = session.payment_status == "paid" ? "Paid" : "Failed";
                        const totalAmount = (session.amount_total || 0) / 100;
                        const time = new Date(session.created * 1000).toLocaleString();
                        // Insert data into newSlotSchedule
                        const newSlotSchedule = {
                            menteeId: menteeObjectId,
                            slotId,
                            paymentStatus: status,
                            paymentTime: time,
                            paymentMethod: "stripe",
                            paymentAmount: String(totalAmount),
                            duration: (_a = JSON.parse(timeSlot)) === null || _a === void 0 ? void 0 : _a.duration,
                            description: message,
                            status: "CONFIRMED",
                        };
                        console.log(newSlotSchedule, "Updated newSlotSchedule Object");
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
                            const notif = yield this._notificationRepository.createNotification(mentorId, `Your new slot were Scheduled`, `new slot were scheduled . checkout now`, `mentor`, `${process.env.CLIENT_ORIGIN_URL}/mentor/session`);
                            index_1.socketManager.sendNotification(mentorID, notif);
                        }
                        //creating chat document
                        yield this._chatRepository.createChatDocs(mentorId, menteeObjectId);
                        if (response) {
                            return;
                        }
                        else {
                            throw new Error("Failed to create appointment");
                        }
                    }
                    default:
                        console.log(`Unhandled event type ${event.type}`);
                }
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)} error while webhook handling in mentee service`);
            }
        });
    }
    //fetch mentee booked slots
    /**
     * Fetches the booked slots for a given mentee.
     *
     * @param menteeId - The ObjectId of the mentee.
     *
     * @returns A promise resolving to an object containing success status, message, HTTP status number, and an array of booked slots.
     *
     * @throws Error - Throws an error if there is an issue while fetching the booked slots.
     */
    getBookedSlots(menteeId, currentTab) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(currentTab, menteeId, "098765432");
                if (!menteeId ||
                    !currentTab ||
                    !mongoose_1.default.Types.ObjectId.isValid(String(menteeId))) {
                    return {
                        success: false,
                        message: "credential not found",
                        status: httpStatusCode_1.Status.NotFound,
                        slots: [],
                    };
                }
                const tabCond = currentTab == "upcoming" ? false : true;
                console.log(tabCond, currentTab, "this si tab");
                const response = yield this._slotScheduleRepository.getBookedSlot(menteeId, tabCond);
                if (!response || response.length === 0) {
                    return {
                        success: false,
                        message: "No slots found",
                        status: httpStatusCode_1.Status.Ok,
                        slots: [],
                    };
                }
                return {
                    success: true,
                    message: "slots found",
                    status: httpStatusCode_1.Status.Ok,
                    slots: response,
                };
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)} error while webhook handling in mentee service`);
            }
        });
    }
    getBookedSessions(mentorId, currentTab) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(currentTab, mentorId, "098765432");
                if (!mentorId ||
                    !currentTab ||
                    !mongoose_1.default.Types.ObjectId.isValid(String(mentorId))) {
                    return {
                        success: false,
                        message: "credential not found",
                        status: httpStatusCode_1.Status.NotFound,
                        slots: [],
                    };
                }
                const tabCond = currentTab == "upcoming" ? false : true;
                console.log(tabCond, currentTab, "this si tab");
                const response = yield this._slotScheduleRepository.getBookedSession(mentorId, tabCond);
                if (!response || response.length === 0) {
                    return {
                        success: false,
                        message: "No slots found",
                        status: httpStatusCode_1.Status.Ok,
                        slots: [],
                    };
                }
                return {
                    success: true,
                    message: "slots retrieved",
                    status: httpStatusCode_1.Status.Ok,
                    slots: response,
                };
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)} error while webhook handling in mentee service`);
            }
        });
    }
    cancelSlot(sessionId, reason, customReason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!sessionId || !reason || (reason == "other" && customReason == "")) {
                    return {
                        success: false,
                        message: "credential not found",
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
                        message: "something went wrong",
                        status: httpStatusCode_1.Status.NotFound,
                        result: null,
                    };
                }
                return {
                    success: true,
                    message: "cancel requested successfully",
                    status: httpStatusCode_1.Status.Ok,
                    result: response,
                };
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)} error while slot cancel in  service`);
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
                        message: "credential not found",
                        status: httpStatusCode_1.Status.BadRequest,
                        result: null,
                    };
                }
                const response = yield this._slotScheduleRepository.mentorSlotCancel(sessionId, statusValue);
                if (!response) {
                    return {
                        success: false,
                        message: "result not found ",
                        status: httpStatusCode_1.Status.NotFound,
                        result: null,
                    };
                }
                return {
                    success: true,
                    message: "cancel requested successfully",
                    status: httpStatusCode_1.Status.Ok,
                    result: response,
                };
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)} error while metnor slot cancel  handle in  service`);
            }
        });
    }
}
exports.bookingService = bookingService;
