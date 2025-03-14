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
class bookingControlelr {
    constructor(_bookingService) {
        this._bookingService = _bookingService;
    }
    //mentee slot booking
    //get timeslots for booking page
    getTimeSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.query;
                const { success, status, message, timeSlots } = yield this._bookingService.getTimeSlots(mentorId);
                res.status(status).json({ success, message, timeSlots });
            }
            catch (error) {
                throw new Error(`Error while  getting timeslots for booking  ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    slotBooking(req, res) {
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
                throw new Error(`Error while  getting timeslots for booking  ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //stripe webhook conifgureation
    stripeWebHook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = req.headers["stripe-signature"];
            yield this._bookingService.stripeWebHook(signature, req.body);
            res.status(200).json({ success: true });
        });
    }
    catch(error) {
        throw new Error(`Error while  webhook config ${error instanceof Error ? error.message : String(error)}`);
    }
    //in mentee retrive the booked slot
    getBookedSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { activeTab } = req.query;
                const { status, message, success, slots } = yield this._bookingService.getBookedSlots(req.user, activeTab);
                res.status(status).json({ success, message, slots });
            }
            catch (error) {
                throw new Error(`Error when fetching all the booked sessions in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //in mentor side to get show the sessions
    getBookedSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { activeTab } = req.query;
                console.log(activeTab, "activeTab aane");
                const { status, message, success, slots } = yield this._bookingService.getBookedSessions(req.user, activeTab);
                res.status(status).json({ success, message, slots });
            }
            catch (error) {
                throw new Error(`Error when fetching all the booked sessions in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    cancelSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const { success, result, message, status } = yield this._bookingService.cancelSlot(req.params.sessionId, (_a = req.body) === null || _a === void 0 ? void 0 : _a.reason, (_b = req.body) === null || _b === void 0 ? void 0 : _b.customReason);
                res.status(status).json({ success, result, message });
            }
            catch (error) {
                throw new Error(`Error when cancelling booked sessions in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //mentor side cancel request handle
    mentorSlotCancel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log(req.params.sessionId, (_a = req.body) === null || _a === void 0 ? void 0 : _a.value);
                const { success, result, message, status } = yield this._bookingService.mentorSlotCancel(req.params.sessionId, (_b = req.body) === null || _b === void 0 ? void 0 : _b.value);
                res.status(status).json({ success, result, message });
            }
            catch (error) {
                throw new Error(`Error when mentor handle cancel  booked sessions in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //create sessionCode in MentorSide
    createSessionCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.body;
                const { message, status, sessionCode, success } = yield this._bookingService.createSessionCode(bookingId);
                res.status(status).json({ message, success, sessionCode });
            }
            catch (error) {
                throw new Error(`Error when mentor handle cancel  booked sessions in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //mentor marking session completed
    sessionCompleted(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.body;
                const { message, sessionStatus, status, success } = yield this._bookingService.sessionCompleted(bookingId, req.user);
                res.status(status).json({ message, sessionStatus, success });
            }
            catch (error) {
                throw new Error(`Error when mentor marking session completed in controller ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //check user is alloweded to join the sessin
    validateSessionJoin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId, sessionCode } = req.body;
                const { message, status, success, session_Code } = yield this._bookingService.validateSessionJoin(sessionId, sessionCode);
                res.status(status).json({ message, success, session_Code });
            }
            catch (error) {
                throw new Error(`Error when user is alloweded to join this session ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.bookingControlelr = bookingControlelr;
