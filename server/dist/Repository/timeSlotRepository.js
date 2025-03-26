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
const timeModel_1 = __importDefault(require("../Model/timeModel"));
const baseRepo_1 = require("./baseRepo");
const mongoose_1 = __importDefault(require("mongoose"));
const reusable_util_1 = require("../Utils/reusable.util");
class timeSlotRepository extends baseRepo_1.baseRepository {
    constructor() {
        super(timeModel_1.default);
    }
    createTimeSlot(timeSlots) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return timeModel_1.default.insertMany(timeSlots);
            }
            catch (error) {
                throw new Error(`${"\x1b[35m%s\x1b[0m"}error while creating tiem slot :${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    getTimeSlots(mentorId, limit, skip, search, filter, sortField, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const dateSearch = new Date(search);
                const isValidDate = !isNaN(dateSearch.getTime());
                console.log(isValidDate, dateSearch, (0, reusable_util_1.getTodayEndTime)(), (0, reusable_util_1.getTodayStartTime)(), skip, limit);
                const pipeline = [
                    {
                        $unwind: "$slots",
                    },
                    {
                        $project: {
                            startDate: 1,
                            isBooked: 1,
                            mentorId: 1,
                            price: 1,
                            duration: 1,
                            startTime: "$slots.startTime",
                            endTime: "$slots.endTime",
                            startStr: "$slots.startStr",
                            endStr: "$slots.endStr",
                        },
                    },
                    {
                        $match: {
                            mentorId: mentorId,
                            isBooked: false,
                            startDate: { $gte: new Date() },
                        },
                    },
                ];
                if (search) {
                    pipeline.push({
                        $match: {
                            $or: [
                                { startDate: isValidDate ? dateSearch : undefined },
                            ],
                        },
                    });
                }
                const order = sortOrder === "asc" ? 1 : -1;
                if (sortField === "createdAt") {
                    pipeline.push({ $sort: { createdAt: order } });
                }
                else {
                    pipeline.push({ $sort: { startTime: order } });
                }
                if (filter == "today") {
                    pipeline.push({
                        $match: {
                            startDate: {
                                $gte: (0, reusable_util_1.getTodayStartTime)(),
                                $lte: (0, reusable_util_1.getTodayEndTime)(),
                            },
                        },
                    });
                }
                pipeline.push({ $skip: skip });
                pipeline.push({ $limit: limit });
                const countPipeline = [
                    ...pipeline.slice(0, pipeline.length - 2),
                    {
                        $count: "totalDocuments",
                    },
                ];
                // Execute Aggregations
                const [timeSlots, totalCount] = yield Promise.all([
                    this.aggregateData(timeModel_1.default, pipeline),
                    timeModel_1.default.aggregate(countPipeline),
                ]);
                return { timeSlots, totalDocs: (_a = totalCount[0]) === null || _a === void 0 ? void 0 : _a.totalDocuments };
            }
            catch (error) {
                throw new Error(`${"\x1b[35m%s\x1b[0m"}error while getting based on
            slot :${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    removeTimeSlot(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.deleteDocument(slotId);
            }
            catch (error) {
                throw new Error(`${"\x1b[35m%s\x1b[0m"}error while removing time slot :${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //mentee side for mentor booking
    getMentorSlots(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.aggregateData(timeModel_1.default, [
                    {
                        $unwind: "$slots",
                    },
                    {
                        $project: {
                            startDate: 1,
                            isBooked: 1,
                            mentorId: 1,
                            price: 1,
                            startTime: "$slots.startTime",
                            endTime: "$slots.endTime",
                            duration: 1,
                        },
                    },
                    {
                        $match: {
                            mentorId: new mongoose_1.default.Types.ObjectId(mentorId),
                            startDate: { $gt: new Date() },
                            isBooked: false,
                        },
                    },
                    {
                        $sort: { startTime: 1 }
                    }
                ]);
            }
            catch (error) {
                throw new Error(`${"\x1b[35m%s\x1b[0m"}error while getting error while get speific mentor time slots :${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //make the timeslot booked
    makeTimeSlotBooked(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(timeModel_1.default, slotId, {
                    $set: { isBooked: true },
                });
            }
            catch (error) {
                throw new Error(`${"\x1b[35m%s\x1b[0m"}error while getting editing speific mentor time slots :${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    checkTimeSlots(mentorId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.aggregateData(timeModel_1.default, [
                    {
                        $match: {
                            mentorId,
                            startDate: { $gte: startDate, $lte: endDate },
                        },
                    },
                    { $unwind: "$slots" },
                    {
                        $project: {
                            slots: 1,
                        },
                    },
                ]);
            }
            catch (error) {
                throw new Error(`${"\x1b[35m%s\x1b[0m"}error while getting editing speific mentor time slots :${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    releaseTimeSlot(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(timeModel_1.default, slotId, {
                    $set: { isBooked: false },
                });
            }
            catch (error) {
                throw new Error(`${"\x1b[35m%s\x1b[0m"}error while getting editing speific mentor time slots :${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = new timeSlotRepository();
