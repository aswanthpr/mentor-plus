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
exports.bookingControlelr = void 0;
const httpStatusCode_1 = require("../../Constants/httpStatusCode");
class bookingControlelr {
    constructor(_bookingService) {
        this._bookingService = _bookingService;
    }
    //mentee slot booking
    //get timeslots for booking page
    getTimeSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.query;
                const { success, status, message, timeSlots } = yield this._bookingService.getTimeSlots(mentorId);
                res.status(status).json({ success, message, timeSlots });
            }
            catch (error) {
                next(error);
            }
        });
    }
    slotBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { timeSlot, message, paymentMethod, totalAmount, mentorName } = req.body;
                const result = yield this._bookingService.slotBooking(timeSlot, message, paymentMethod, totalAmount, mentorName, req.user, req.protocol, req.get("host"));
                res.status(result === null || result === void 0 ? void 0 : result.status).json({
                    message: result === null || result === void 0 ? void 0 : result.message,
                    success: result === null || result === void 0 ? void 0 : result.success,
                    session: result === null || result === void 0 ? void 0 : result.session,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //stripe webhook conifgureation
    stripeWebHook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signature = req.headers["stripe-signature"];
                yield this._bookingService.stripeWebHook(signature, req.body);
                res.status(httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.Ok).json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //in mentee retrive the booked slot
    getBookedSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { activeTab, search, page, limit, sortField, sortOrder, filter } = req.query;
                const { status, message, success, slots, totalPage } = yield this._bookingService.getBookedSlots(req.user, String(activeTab), String(search), String(sortField), String(sortOrder), String(filter), Number(page), Number(limit));
                res.status(status).json({ success, message, slots, totalPage });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //in mentor side to get show the sessions
    getBookedSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { activeTab, search, sortField, sortOrder, filter, page, limit } = req.query;
                const { status, message, success, slots, totalPage } = yield this._bookingService.getBookedSessions(req.user, String(activeTab), String(search), String(sortField), String(sortOrder), String(filter), Number(page), Number(limit));
                res.status(status).json({ success, message, slots, totalPage });
            }
            catch (error) {
                next(error);
            }
        });
    }
    cancelSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { success, result, message, status } = yield this._bookingService.cancelSlot(req.params.sessionId, (_a = req.body) === null || _a === void 0 ? void 0 : _a.reason, (_b = req.body) === null || _b === void 0 ? void 0 : _b.customReason);
                res.status(status).json({ success, result, message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //mentor side cancel request handle
    mentorSlotCancel(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { success, result, message, status } = yield this._bookingService.mentorSlotCancel(req.params.sessionId, (_a = req.body) === null || _a === void 0 ? void 0 : _a.value);
                res.status(status).json({ success, result, message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //create sessionCode in MentorSide
    createSessionCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.body;
                const { message, status, sessionCode, success } = yield this._bookingService.createSessionCode(bookingId);
                res.status(status).json({ message, success, sessionCode });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //mentor marking session completed
    sessionCompleted(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.body;
                const { message, sessionStatus, status, success } = yield this._bookingService.sessionCompleted(bookingId, req.user);
                res.status(status).json({ message, sessionStatus, success });
            }
            catch (error) {
                next(error);
            }
        });
    }
    //check user is alloweded to join the sessin
    validateSessionJoin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId, sessionCode } = req.query;
                const { message, status, success, session_Code } = yield this._bookingService.validateSessionJoin(String(sessionId), String(sessionCode), req.user);
                res.status(status).json({ message, success, session_Code });
            }
            catch (error) {
                next(error);
            }
        });
    }
    turnServerConnection(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { turnServerConfig, status } = yield this._bookingService.turnServerConnection();
                res.status(status).json({ turnServerConfig });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.bookingControlelr = bookingControlelr;
