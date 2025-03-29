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
const slotSchedule_1 = __importDefault(require("../Model/slotSchedule"));
const baseRepo_1 = require("./baseRepo");
const mongoose_1 = __importDefault(require("mongoose"));
const slotSchedule_2 = __importDefault(require("../Model/slotSchedule"));
const reusable_util_1 = require("../Utils/reusable.util");
const httpStatusCode_1 = require("../Constants/httpStatusCode");
const http_error_handler_util_1 = require("../Utils/http-error-handler.util");
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
                ]);
                return result[0];
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    getBookedSlot(userId, tabCond, userType, skip, limitNo, search, sortOrder, sortField, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const todayStart = (0, reusable_util_1.getTodayStartTime)();
                const matchFilter = {
                    paymentStatus: "Paid",
                    menteeId: userId
                };
                if (tabCond) {
                    matchFilter["status"] = { $in: ["CANCELLED", "COMPLETED"] };
                    matchFilter['menteeId'] = userId;
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
                    ? { "slotDetails.startDate": { $lt: new Date() } }
                    : {
                        "slotDetails.startDate": {
                            $gte: todayStart,
                        },
                    };
                const pipeLine = [
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
                    {
                        $match: dateFilter,
                    },
                    {
                        $sort: {
                            "slotDetails.startDate": -1,
                        },
                    },
                ];
                if (tabCond) {
                    pipeLine.push({
                        $lookup: {
                            from: "reviews",
                            localField: "_id",
                            foreignField: "sessionId",
                            as: "review",
                        },
                    }, {
                        $unwind: {
                            path: "$review",
                            preserveNullAndEmptyArrays: true,
                        },
                    });
                }
                if (search) {
                    pipeLine.push({
                        $match: {
                            $or: [
                                {
                                    status: { $regex: search, $options: "i" },
                                },
                                { description: { $regex: search, $options: "i" } },
                                { "user.name": { $regex: search, $options: "i" } },
                                { bio: { $regex: search, $options: "i" } },
                            ],
                        },
                    });
                }
                const order = sortOrder === "asc" ? 1 : -1;
                if (sortField === "createdAt") {
                    pipeLine.push({ $sort: { createdAt: order } });
                }
                if (filter !== "all") {
                    matchFilter["status"] =
                        filter === "CANCEL_REQUESTED"
                            ? "CANCEL_REQUESTED"
                            : { $in: [filter] };
                }
                // Pagination
                pipeLine.push({ $skip: skip });
                pipeLine.push({ $limit: limitNo });
                const countPipeline = [
                    ...pipeLine.slice(0, pipeLine.length - 2),
                    {
                        $count: "totalDocuments",
                    },
                ];
                // Execute Aggregations
                const [slots, totalCount] = yield Promise.all([
                    this.aggregateData(slotSchedule_2.default, pipeLine),
                    slotSchedule_2.default.aggregate(countPipeline),
                ]);
                return { slots: slots, totalDocs: (_a = totalCount[0]) === null || _a === void 0 ? void 0 : _a.totalDocuments };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    getBookedSession(skip, limitNo, search, filter, sortOrder, sortField, tabCond, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
                    ? { "slotDetails.startDate": { $lt: new Date() } }
                    : { "slotDetails.startDate": { $gte: todayStart } };
                const pipeLine = [
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
                        $match: dateFilter,
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
                ];
                if (search) {
                    pipeLine.push({
                        $match: {
                            $or: [
                                {
                                    status: { $regex: search, $options: "i" },
                                },
                                { description: { $regex: search, $options: "i" } },
                                { "user.name": { $regex: search, $options: "i" } },
                                { bio: { $regex: search, $options: "i" } },
                            ],
                        },
                    });
                }
                const order = sortOrder === "asc" ? 1 : -1;
                if (sortField === "createdAt") {
                    pipeLine.push({ $sort: { createdAt: order } });
                }
                if (filter !== "all") {
                    matchFilter["status"] =
                        filter === "CANCEL_REQUESTED"
                            ? "CANCEL_REQUESTED"
                            : { $in: [filter] };
                }
                // Pagination
                pipeLine.push({ $skip: skip });
                pipeLine.push({ $limit: limitNo });
                const countPipeline = [
                    ...pipeLine.slice(0, pipeLine.length - 2),
                    {
                        $count: "totalDocuments",
                    },
                ];
                // Execute Aggregations
                const [slots, totalCount] = yield Promise.all([
                    this.aggregateData(slotSchedule_2.default, pipeLine),
                    slotSchedule_2.default.aggregate(countPipeline),
                ]);
                return { slots: slots, totalDoc: (_a = totalCount[0]) === null || _a === void 0 ? void 0 : _a.totalDocuments };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    cancelSlot(sessionId, issue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(slotSchedule_2.default, new mongoose_1.default.Types.ObjectId(sessionId), { $set: { status: "CANCEL_REQUESTED", cancelReason: issue } });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    mentorSlotCancel(sessionId, slotValule) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(slotSchedule_2.default, new mongoose_1.default.Types.ObjectId(sessionId), { $set: { status: slotValule } });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
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
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
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
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //checking user is alllowed to join session
    validateSessionJoin(sessionId, sessionCode, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.aggregateData(slotSchedule_2.default, [
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
                        $match: {
                            _id: sessionId,
                            sessionCode,
                            status: "CONFIRMED",
                            $or: [
                                {
                                    menteeId: userId,
                                },
                                { "slotDetails.mentorId": userId },
                            ],
                        },
                    },
                ]);
                return result[0];
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    mentorDashboard(platformCommission, timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                const startOfNextYear = new Date(new Date().getFullYear() + 1, 0, 1);
                const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                const startOfNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
                const res = (yield this.aggregateData(slotSchedule_2.default, [
                    {
                        $facet: {
                            totalRevenue: [
                                {
                                    $match: {
                                        createdAt: { $gte: startOfYear, $lt: startOfNextYear },
                                        status: { $in: ["COMPLETED"] },
                                    },
                                },
                                {
                                    $addFields: {
                                        paymentAmountNumeric: { $toDouble: "$paymentAmount" },
                                    },
                                },
                                {
                                    $group: {
                                        _id: null,
                                        totalRevenue: {
                                            $sum: {
                                                $multiply: ["$paymentAmountNumeric", platformCommission],
                                            },
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        totalRevenue: { $ifNull: ["$totalRevenue", 0] },
                                    },
                                },
                            ],
                            totalBookings: [
                                {
                                    $match: {
                                        createdAt: { $gte: startOfYear, $lt: startOfNextYear },
                                        status: {
                                            $in: ["CONFIRMED", "REJECTED", "COMPLETED"],
                                        },
                                    },
                                },
                                { $group: { _id: null, totalBookings: { $sum: 1 } } },
                                {
                                    $project: {
                                        _id: 0,
                                        totalBookings: { $ifNull: ["$totalBookings", 0] },
                                    },
                                },
                            ],
                            totalCancelledBookings: [
                                {
                                    $match: {
                                        createdAt: { $gte: startOfYear, $lt: startOfNextYear },
                                        status: "CANCELLED",
                                    },
                                },
                                { $group: { _id: null, totalCancelledBookings: { $sum: 1 } } },
                                {
                                    $project: {
                                        _id: 0,
                                        totalCancelledBookings: {
                                            $ifNull: ["$totalCancelledBookings", 0],
                                        },
                                    },
                                },
                            ],
                            uniqueMentorsThisMonth: [
                                {
                                    $match: {
                                        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
                                        status: { $in: ["CONFIRMED", "COMPLETED"] },
                                    },
                                },
                                {
                                    $lookup: {
                                        from: "times",
                                        localField: "slotId",
                                        foreignField: "_id",
                                        as: "slotData",
                                    },
                                },
                                { $unwind: "$slotData" },
                                { $group: { _id: "$slotData.mentorId" } },
                                { $count: "uniqueMentors" },
                            ],
                        },
                    },
                    {
                        $project: {
                            totalRevenue: { $arrayElemAt: ["$totalRevenue.totalRevenue", 0] },
                            totalBookings: {
                                $arrayElemAt: ["$totalBookings.totalBookings", 0],
                            },
                            totalCancelledBookings: {
                                $arrayElemAt: [
                                    "$totalCancelledBookings.totalCancelledBookings",
                                    0,
                                ],
                            },
                            uniqueMentorsThisMonth: {
                                $arrayElemAt: ["$uniqueMentorsThisMonth.uniqueMentors", 0],
                            },
                        },
                    },
                ]));
                //  Time-Based Revenue Calculation
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const timeFacets = {};
                if (timeRange === "week") {
                    timeFacets.weekly = [
                        {
                            $addFields: {
                                week: { $week: "$createdAt" },
                                year: { $year: "$createdAt" },
                            },
                        },
                        {
                            $group: {
                                _id: { week: "$week", year: "$year" },
                                totalRevenue: {
                                    $sum: {
                                        $multiply: ["$paymentAmountNumeric", platformCommission],
                                    },
                                },
                                totalBookings: { $sum: 1 },
                            },
                        },
                        { $sort: { "_id.year": 1, "_id.week": 1 } },
                        {
                            $project: {
                                _id: 0,
                                week: "$_id.week",
                                year: "$_id.year",
                                revenue: "$totalRevenue",
                                sessions: "$totalBookings",
                            },
                        },
                    ];
                }
                else if (timeRange === "month") {
                    timeFacets.monthly = [
                        {
                            $addFields: {
                                month: { $month: "$createdAt" },
                                year: { $year: "$createdAt" },
                            },
                        },
                        {
                            $group: {
                                _id: { month: "$month", year: "$year" },
                                totalRevenue: {
                                    $sum: {
                                        $multiply: ["$paymentAmountNumeric", platformCommission],
                                    },
                                },
                                totalBookings: { $sum: 1 },
                            },
                        },
                        { $sort: { "_id.year": 1, "_id.month": 1 } },
                        {
                            $project: {
                                _id: 0,
                                month: "$_id.month",
                                year: "$_id.year",
                                revenue: "$totalRevenue",
                                sessions: "$totalBookings",
                            },
                        },
                    ];
                }
                else {
                    timeFacets.yearly = [
                        { $addFields: { year: { $year: "$createdAt" } } },
                        {
                            $group: {
                                _id: "$year",
                                totalRevenue: {
                                    $sum: {
                                        $multiply: ["$paymentAmountNumeric", platformCommission],
                                    },
                                },
                                totalBookings: { $sum: 1 },
                            },
                        },
                        { $sort: { _id: 1 } },
                        {
                            $project: {
                                _id: 0,
                                year: "$_id",
                                revenue: "$totalRevenue",
                                sessions: "$totalBookings",
                            },
                        },
                    ];
                }
                const timeData = yield this.aggregateData(slotSchedule_2.default, [
                    {
                        $match: {
                            status: { $in: ["CONFIRMED", "REJECTED", "COMPLETED"] },
                            createdAt: { $gte: startOfYear },
                        },
                    },
                    {
                        $lookup: {
                            from: "times",
                            localField: "slotId",
                            foreignField: "_id",
                            as: "slotData",
                        },
                    },
                    { $unwind: "$slotData" },
                    {
                        $addFields: { paymentAmountNumeric: { $toDouble: "$paymentAmount" } },
                    },
                    { $facet: timeFacets },
                ]);
                const categoryDistribution = (yield this.aggregateData(slotSchedule_2.default, [
                    { $match: { status: { $in: ["CONFIRMED", "COMPLETED", "REJECTED"] } } },
                    {
                        $lookup: {
                            from: "times",
                            localField: "slotId",
                            foreignField: "_id",
                            as: "slotData",
                        },
                    },
                    { $unwind: "$slotData" },
                    {
                        $lookup: {
                            from: "mentors",
                            localField: "slotData.mentorId",
                            foreignField: "_id",
                            as: "mentorData",
                        },
                    },
                    { $unwind: "$mentorData" },
                    {
                        $group: {
                            _id: "$mentorData.category",
                            totalBookings: { $sum: 1 },
                        },
                    },
                    { $sort: { totalBookings: -1 } },
                    {
                        $project: {
                            _id: 0,
                            category: "$_id",
                            value: "$totalBookings",
                        },
                    },
                ]));
                const topMentors = (yield this.aggregateData(slotSchedule_2.default, [
                    {
                        $match: {
                            status: { $in: ["CONFIRMED", "COMPLETED", "REJECTED"] },
                            createdAt: { $gte: startOfYear, $lt: startOfNextYear },
                        },
                    },
                    {
                        $lookup: {
                            from: "times",
                            localField: "slotId",
                            foreignField: "_id",
                            as: "slotData",
                        },
                    },
                    { $unwind: "$slotData" },
                    {
                        $lookup: {
                            from: "mentors",
                            localField: "slotData.mentorId",
                            foreignField: "_id",
                            as: "mentorData",
                        },
                    },
                    { $unwind: "$mentorData" },
                    {
                        $lookup: {
                            from: "reviews",
                            localField: "slotData.mentorId",
                            foreignField: "mentorId",
                            as: "ratings",
                        },
                    },
                    { $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true } },
                    {
                        $addFields: { paymentAmountNumeric: { $toDouble: "$paymentAmount" } },
                    },
                    {
                        $group: {
                            _id: "$slotData.mentorId",
                            mentorName: { $first: "$mentorData.name" },
                            category: { $first: "$mentorData.category" },
                            totalSessions: { $sum: 1 },
                            profileUrl: { $first: "$mentorData.profileUrl" },
                            totalRevenue: {
                                $sum: {
                                    $multiply: [
                                        "$paymentAmountNumeric",
                                        Number((_a = process.env) === null || _a === void 0 ? void 0 : _a.MENTOR_COMMISION),
                                    ],
                                },
                            },
                            averageRating: { $avg: "$ratings.rating" },
                        },
                    },
                    { $sort: { totalSessions: -1 } },
                    { $limit: 5 },
                    {
                        $project: {
                            _id: 0,
                            mentorId: "$_id",
                            mentorName: 1,
                            totalSessions: 1,
                            totalRevenue: 1,
                            category: 1,
                            averageRating: 1,
                            profileUrl: 1,
                        },
                    },
                ]));
                return Object.assign(Object.assign(Object.assign({}, res[0]), timeData[0]), { categoryDistribution, topMentors });
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
    //mentor chart data
    mentorChartData(mentorId, timeRange) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            try {
                const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                const startOfNextYear = new Date(new Date().getFullYear() + 1, 0, 1);
                const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                const startOfNextMonth = new Date(new Date().getFullYear(), (new Date().getMonth() + 1) % 12, 1);
                const now = new Date();
                const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
                const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
                const today = new Date();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the current week
                const startOfNextWeek = new Date(startOfWeek);
                startOfNextWeek.setDate(startOfWeek.getDate() + 7);
                const cardResult = (yield this.aggregateData(slotSchedule_2.default, [
                    {
                        $lookup: {
                            from: "times",
                            localField: "slotId",
                            foreignField: "_id",
                            as: "slotData",
                        },
                    },
                    {
                        $unwind: "$slotData",
                    },
                    {
                        $match: {
                            "slotData.mentorId": mentorId,
                        },
                    },
                    {
                        $addFields: {
                            paymentAmountNumeric: { $toDouble: "$paymentAmount" },
                        },
                    },
                    {
                        $facet: {
                            // Month Revenue
                            currentMonthRevenue: [
                                {
                                    $match: {
                                        status: "COMPLETED",
                                        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
                                    },
                                },
                                {
                                    $group: {
                                        _id: null,
                                        totalRevenue: {
                                            $sum: {
                                                $multiply: [
                                                    "$paymentAmountNumeric",
                                                    Number(process.env.MENTOR_COMMISION),
                                                ],
                                            },
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        totalRevenue: 1,
                                    },
                                },
                            ],
                            // Current Month Total Bookings
                            currentMonthTotalBookings: [
                                {
                                    $match: {
                                        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
                                        status: { $in: ["CONFIRMED", "COMPLETED", "CANCEL_REQUESTED"] },
                                    },
                                },
                                {
                                    $group: {
                                        _id: null,
                                        totalBookings: { $sum: 1 },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        totalBookings: 1,
                                    },
                                },
                            ],
                            // Current Month Cancelled Bookings
                            currentMonthCancelledBookings: [
                                {
                                    $match: {
                                        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
                                        status: "CANCELLED",
                                    },
                                },
                                {
                                    $group: {
                                        _id: null,
                                        totalCancelledBookings: { $sum: 1 },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        totalCancelledBookings: 1,
                                    },
                                },
                            ],
                            // Current Day Sessions to Attend
                            currentDaySessionsToAttend: [
                                {
                                    $match: {
                                        "slotData.startDate": { $gte: startOfDay, $lt: endOfDay },
                                        status: { $in: ["CONFIRMED", "REJECTED", "CANCEL_REQUESTED"] },
                                    },
                                },
                                {
                                    $group: {
                                        _id: null,
                                        totalSessionsToAttend: { $sum: 1 },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                        totalSessionsToAttend: 1,
                                    },
                                },
                            ],
                        },
                    },
                ]));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const timeFacets = {};
                if (timeRange === "week") {
                    timeFacets.period = [
                        {
                            $addFields: {
                                week: { $week: "$createdAt" },
                                year: { $year: "$createdAt" },
                            },
                        },
                        {
                            $group: {
                                _id: { week: "$week", year: "$year" },
                                totalRevenue: {
                                    $sum: {
                                        $multiply: [
                                            "$paymentAmountNumeric",
                                            Number(process.env.MENTOR_COMMISION),
                                        ],
                                    },
                                },
                                totalBookings: { $sum: 1 },
                            },
                        },
                        { $sort: { "_id.year": 1, "_id.week": 1 } },
                        {
                            $project: {
                                _id: 0,
                                week: "$_id.week",
                                year: "$_id.year",
                                revenue: "$totalRevenue",
                                sessions: "$totalBookings",
                            },
                        },
                    ];
                }
                else if (timeRange === "month") {
                    timeFacets.period = [
                        {
                            $addFields: {
                                month: { $month: "$createdAt" },
                                year: { $year: "$createdAt" },
                            },
                        },
                        {
                            $group: {
                                _id: { month: "$month", year: "$year" },
                                totalRevenue: {
                                    $sum: {
                                        $multiply: [
                                            "$paymentAmountNumeric",
                                            Number(process.env.MENTOR_COMMISION),
                                        ],
                                    },
                                },
                                totalBookings: { $sum: 1 },
                            },
                        },
                        { $sort: { "_id.year": 1, "_id.month": 1 } },
                        {
                            $project: {
                                _id: 0,
                                month: "$_id.month",
                                year: "$_id.year",
                                revenue: "$totalRevenue",
                                sessions: "$totalBookings",
                            },
                        },
                    ];
                }
                else {
                    timeFacets.period = [
                        { $addFields: { year: { $year: "$createdAt" } } },
                        {
                            $group: {
                                _id: "$year",
                                totalRevenue: {
                                    $sum: {
                                        $multiply: [
                                            "$paymentAmountNumeric",
                                            Number(process.env.MENTOR_COMMISION),
                                        ],
                                    },
                                },
                                totalBookings: { $sum: 1 },
                            },
                        },
                        { $sort: { _id: 1 } },
                        {
                            $project: {
                                _id: 0,
                                year: "$_id",
                                revenue: "$totalRevenue",
                                sessions: "$totalBookings",
                            },
                        },
                    ];
                }
                timeFacets.cumulativeSession = [
                    {
                        $addFields: {
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" },
                        },
                    },
                    {
                        $group: {
                            _id: { month: "$month", year: "$year" },
                            revenue: {
                                $sum: {
                                    $multiply: [
                                        "$paymentAmountNumeric",
                                        Number(process.env.MENTOR_COMMISION),
                                    ],
                                },
                            },
                        },
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } },
                    {
                        $setWindowFields: {
                            partitionBy: "$_id.year",
                            sortBy: { "_id.month": 1 },
                            output: {
                                cumulativeRevenue: {
                                    $sum: "$revenue",
                                    window: {
                                        documents: ["unbounded", "current"],
                                    },
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            month: "$_id.month",
                            year: "$_id.year",
                            revenue: 1,
                            cumulativeRevenue: 1,
                            _id: 0,
                        },
                    },
                ];
                const timeData = (yield this.aggregateData(slotSchedule_2.default, [
                    {
                        $lookup: {
                            from: "times",
                            localField: "slotId",
                            foreignField: "_id",
                            as: "slotData",
                        },
                    },
                    {
                        $unwind: "$slotData",
                    },
                    {
                        $match: {
                            "slotData.mentorId": mentorId,
                            status: "COMPLETED",
                            "slotData.startDate": { $gte: startOfYear },
                        },
                    },
                    {
                        $addFields: {
                            paymentAmountNumeric: { $toDouble: "$paymentAmount" },
                        },
                    },
                    { $facet: timeFacets },
                ]));
                const topMentors = (yield this.aggregateData(slotSchedule_2.default, [
                    {
                        $match: {
                            status: { $in: ["CONFIRMED", "COMPLETED", "REJECTED"] },
                            createdAt: { $gte: startOfYear, $lt: startOfNextYear },
                        },
                    },
                    {
                        $lookup: {
                            from: "times",
                            localField: "slotId",
                            foreignField: "_id",
                            as: "slotData",
                        },
                    },
                    { $unwind: "$slotData" },
                    {
                        $lookup: {
                            from: "mentors",
                            localField: "slotData.mentorId",
                            foreignField: "_id",
                            as: "mentorData",
                        },
                    },
                    { $unwind: "$mentorData" },
                    {
                        $lookup: {
                            from: "reviews",
                            localField: "slotData.mentorId",
                            foreignField: "mentorId",
                            as: "ratings",
                        },
                    },
                    { $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true } },
                    {
                        $addFields: { paymentAmountNumeric: { $toDouble: "$paymentAmount" } },
                    },
                    {
                        $group: {
                            _id: "$slotData.mentorId",
                            mentorName: { $first: "$mentorData.name" },
                            category: { $first: "$mentorData.category" },
                            totalSessions: { $sum: 1 },
                            profileUrl: { $first: "$mentorData.profileUrl" },
                            totalRevenue: {
                                $sum: {
                                    $multiply: [
                                        "$paymentAmountNumeric",
                                        Number((_a = process.env) === null || _a === void 0 ? void 0 : _a.MENTOR_COMMISION),
                                    ],
                                },
                            },
                            averageRating: { $avg: "$ratings.rating" },
                        },
                    },
                    { $sort: { totalSessions: -1 } },
                    { $limit: 5 },
                    {
                        $project: {
                            _id: 0,
                            mentorId: "$_id",
                            mentorName: 1,
                            totalSessions: 1,
                            totalRevenue: 1,
                            category: 1,
                            averageRating: 1,
                            profileUrl: 1,
                        },
                    },
                ]));
                const mentorChart = {
                    currentMonthRevenue: (_d = (_c = (_b = cardResult[0]) === null || _b === void 0 ? void 0 : _b.currentMonthRevenue[0]) === null || _c === void 0 ? void 0 : _c.totalRevenue) !== null && _d !== void 0 ? _d : 0,
                    currentMonthTotalBookings: (_g = (_f = (_e = cardResult[0]) === null || _e === void 0 ? void 0 : _e.currentMonthTotalBookings[0]) === null || _f === void 0 ? void 0 : _f.totalBookings) !== null && _g !== void 0 ? _g : 0,
                    currentMonthCancelledBookings: (_k = (_j = (_h = cardResult[0]) === null || _h === void 0 ? void 0 : _h.currentMonthCancelledBookings[0]) === null || _j === void 0 ? void 0 : _j.totalCancelledBookings) !== null && _k !== void 0 ? _k : 0,
                    currentDaySessionsToAttend: (_o = (_m = (_l = cardResult[0]) === null || _l === void 0 ? void 0 : _l.currentDaySessionsToAttend[0]) === null || _m === void 0 ? void 0 : _m.totalSessionsToAttend) !== null && _o !== void 0 ? _o : 0,
                    period: (_q = (_p = timeData[0]) === null || _p === void 0 ? void 0 : _p.period) !== null && _q !== void 0 ? _q : [],
                    cumulativeSession: (_s = (_r = timeData === null || timeData === void 0 ? void 0 : timeData[0]) === null || _r === void 0 ? void 0 : _r.cumulativeSession) !== null && _s !== void 0 ? _s : [],
                    topMentors: topMentors !== null && topMentors !== void 0 ? topMentors : [],
                };
                return { mentorChart };
            }
            catch (error) {
                throw new http_error_handler_util_1.HttpError(error instanceof Error ? error.message : String(error), httpStatusCode_1.Status === null || httpStatusCode_1.Status === void 0 ? void 0 : httpStatusCode_1.Status.InternalServerError);
            }
        });
    }
}
exports.default = new slotScheduleRepository();
