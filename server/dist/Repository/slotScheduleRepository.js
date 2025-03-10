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
/* eslint-disable @typescript-eslint/no-unused-vars */
const slotSchedule_1 = __importDefault(require("../Model/slotSchedule"));
const baseRepo_1 = require("./baseRepo");
const mongoose_1 = __importDefault(require("mongoose"));
const slotSchedule_2 = __importDefault(require("../Model/slotSchedule"));
const reusable_util_1 = require("../Utils/reusable.util");
class slotScheduleRepository extends baseRepo_1.baseRepository {
    constructor() {
        super(slotSchedule_1.default);
    }
    newSlotBooking(newSlotSchedule) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.createDocument(newSlotSchedule);
                const result = yield this.aggregateData(slotSchedule_2.default, [
                    {
                        $match: {
                            slotId: res === null || res === void 0 ? void 0 : res.slotId,
                        },
                    },
                    {
                        $lookup: {
                            from: "times",
                            localField: "slotId",
                            foreignField: "_id",
                            as: "times",
                        },
                    },
                    {
                        $unwind: {
                            path: "$times",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    // {
                    //   $project:{
                    //     mentorId:"$times.mentorId",
                    //   }
                    // }
                ]);
                console.log(result, "result");
                return result[0];
            }
            catch (error) {
                throw new Error(` error while creating new Booking slots${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * Retrieves the booked slots for a specified mentee.
     *
     * @param menteeId - The ObjectId of the mentee for whom the booked slots are to be retrieved.
     * @param tabCond - A boolean condition used to filter slots based on additional criteria.
     *
     * @returns A promise resolving to an array of booked slots (`IslotSchedule[]`) or an empty array if no slots are found.
     *
     * @throws Error - Throws an error if there is an issue during the aggregation process.
     */
    getBookedSlot(menteeId, tabCond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todayStart = (0, reusable_util_1.getTodayStartTime)();
                const matchFilter = {
                    menteeId,
                    paymentStatus: "Paid",
                };
                if (tabCond) {
                    matchFilter["status"] = { $in: ["CANCELLED", "COMPLETED"] };
                }
                else {
                    matchFilter["status"] = {
                        $in: [
                            "RESCHEDULED",
                            "CONFIRMED",
                            "PENDING",
                            "CANCEL_REQUESTED",
                            "REJECTED",
                        ],
                    };
                }
                const dateFilter = tabCond
                    ? { "slotDetails.startTime": { $lt: todayStart } }
                    : {
                        $or: [
                            { "slotDetails.startTime": { $gte: todayStart } }, // Future sessions
                            { status: "CONFIRMED" }, // Include past confirmed sessions
                        ],
                    };
                return yield this.aggregateData(slotSchedule_2.default, [
                    {
                        $match: matchFilter,
                    },
                    {
                        $lookup: {
                            from: "times",
                            localField: "slotId",
                            foreignField: "_id",
                            as: "slotDetails",
                        },
                    },
                    {
                        $unwind: {
                            path: "$slotDetails",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "mentors",
                            localField: "slotDetails.mentorId",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    // {
                    //   $match: dateFilter,
                    // },
                    {
                        $sort: {
                            "slotDetails.startDate": -1,
                        },
                    },
                ]);
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    getBookedSession(mentorId, tabCond) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todayStart = (0, reusable_util_1.getTodayStartTime)();
                const matchFilter = {
                    "slotDetails.mentorId": mentorId,
                    paymentStatus: "Paid",
                };
                if (tabCond) {
                    matchFilter["status"] = { $in: ["CANCELLED", "COMPLETED"] };
                }
                else {
                    matchFilter["status"] = {
                        $in: [
                            "RESCHEDULED",
                            "CONFIRMED",
                            "PENDING",
                            "CANCEL_REQUESTED",
                            "REJECTED",
                        ],
                    };
                }
                const dateFilter = tabCond
                    ? { "slotDetails.startDate": { $lt: todayStart } }
                    : { "slotDetails.startTime": { $gte: todayStart } };
                const resp = yield this.aggregateData(slotSchedule_2.default, [
                    {
                        $lookup: {
                            from: "times",
                            localField: "slotId",
                            foreignField: "_id",
                            as: "slotDetails",
                        },
                    },
                    {
                        $unwind: {
                            path: "$slotDetails",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $match: matchFilter,
                    },
                    {
                        $lookup: {
                            from: "mentees",
                            localField: "menteeId",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $sort: {
                            "slotDetails.startDate": -1,
                        },
                    },
                ]);
                console.log(resp, "this is respaa");
                return resp;
            }
            catch (error) {
                throw new Error(`${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    cancelSlot(sessionId, issue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(sessionId, issue);
                return yield this.find_By_Id_And_Update(slotSchedule_2.default, new mongoose_1.default.Types.ObjectId(sessionId), { $set: { status: "CANCEL_REQUESTED", cancelReason: issue } });
            }
            catch (error) {
                throw new Error(`error while cancel the slot in slot schedule repositry${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    mentorSlotCancel(sessionId, slotValule) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(slotSchedule_2.default, new mongoose_1.default.Types.ObjectId(sessionId), { $set: { status: slotValule } });
            }
            catch (error) {
                throw new Error(`error while mentor handle  cancel  slot request  in slot schedule repositry${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    createSessionCode(bookingId, sessionCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.find_By_Id_And_Update(slotSchedule_1.default, bookingId, { $set: { sessionCode } });
                return response === null || response === void 0 ? void 0 : response.sessionCode;
            }
            catch (error) {
                throw new Error(`error while mentor handle  cancel  slot request  in slot schedule repositry${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //mentor  make as session completed
    sessionCompleted(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.find_By_Id_And_Update(slotSchedule_1.default, bookingId, {
                    $set: { status: "COMPLETED" },
                });
            }
            catch (error) {
                throw new Error(`error while mentor handle  cancel  slot request  in slot schedule repositry${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //checking user is alllowed to join session
    validateSessionJoin(sessionId, sessionCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One({
                    _id: sessionId,
                    sessionCode,
                    status: "CONFIRMED",
                });
            }
            catch (error) {
                throw new Error(` error while validate user is allowed to join session ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = new slotScheduleRepository();
