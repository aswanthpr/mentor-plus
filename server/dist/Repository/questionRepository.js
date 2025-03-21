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
const questionModal_1 = __importDefault(require("../Model/questionModal"));
const baseRepo_1 = require("./baseRepo");
const mongoose_1 = __importDefault(require("mongoose"));
const questionModal_2 = __importDefault(require("../Model/questionModal"));
class questionRepository extends baseRepo_1.baseRepository {
    constructor() {
        super(questionModal_1.default);
    }
    createQuestion(title, content, tags, menteeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.createDocument({
                    title,
                    content,
                    tags,
                    menteeId,
                });
                return res.populate({
                    path: "menteeId",
                    select: "name profileUrl githubUrl LinkedinUrl ",
                });
            }
            catch (error) {
                throw new Error(`error create new question ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    isQuestionExist(field1, field2) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find(questionModal_2.default, { title: field1, content: field2 });
            }
            catch (error) {
                throw new Error(`error while checking data existing or not  ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    questionData(menteeId, filter, search, limit, skip, sortField, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let matchCondition = {};
                if (filter === "answered") {
                    matchCondition = {
                        $and: [{ answers: { $gte: 0 } }, { "answerData.isBlocked": false }],
                    };
                }
                else {
                    matchCondition = { answers: 0 };
                }
                const pipeLine = [
                    {
                        $match: {
                            menteeId: menteeId,
                            isBlocked: false,
                        },
                    },
                    {
                        $sort: {
                            createdAt: -1,
                        },
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
                        $lookup: {
                            from: "answers",
                            localField: "_id",
                            foreignField: "questionId",
                            as: "answerData",
                        },
                    },
                    {
                        $unwind: {
                            path: "$answerData",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "mentees",
                            localField: "answerData.authorId",
                            foreignField: "_id",
                            as: "answerData.author1",
                        },
                    },
                    {
                        $lookup: {
                            from: "mentors",
                            localField: "answerData.authorId",
                            foreignField: "_id",
                            as: "answerData.author2",
                        },
                    },
                    {
                        $match: matchCondition,
                    },
                    {
                        $addFields: {
                            "answerData.author": {
                                $cond: {
                                    if: { $eq: ["$answerData.authorType", "mentee"] },
                                    then: { $arrayElemAt: ["$answerData.author1", 0] },
                                    else: { $arrayElemAt: ["$answerData.author2", 0] },
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            "answerData.author1": 0,
                            "answerData.author2": 0,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            content: 1,
                            tags: 1,
                            menteeId: 1,
                            createdAt: 1,
                            user: {
                                _id: 1,
                                name: 1,
                                profileUrl: 1,
                                linkedinUrl: 1,
                                githubUrl: 1,
                            },
                            answers: 1,
                            answerData: 1,
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            title: { $first: "$title" },
                            tags: { $first: "$tags" },
                            menteeId: { $first: "$menteeId" },
                            content: { $first: "$content" },
                            createdAt: { $first: "$createdAt" },
                            user: { $first: "$user" },
                            answers: { $first: "$answers" },
                            answerData: {
                                $push: {
                                    $cond: {
                                        if: { $ne: ["$answerData", {}] },
                                        then: "$answerData",
                                        else: "$$REMOVE",
                                    },
                                },
                            },
                        },
                    },
                ];
                if (search) {
                    pipeLine.push({
                        $match: {
                            $or: [
                                { title: { $regex: search, $options: "i" } },
                                { tags: { $in: [{ regex: search, $options: "i" }] } },
                                { content: { $regex: search, $options: "i" } },
                                { "user.name": { $regex: search, $options: "i" } },
                            ],
                        },
                    });
                }
                if (sortField === "createdAt") {
                    pipeLine.push({ $sort: { createdAt: sortOrder === "asc" ? 1 : -1 } });
                }
                else {
                    pipeLine.push({ $sort: { answers: -1 } });
                }
                pipeLine.push({ $skip: skip });
                pipeLine.push({ $limit: limit });
                const countPipeline = [
                    ...pipeLine.slice(0, -2),
                    { $count: "totalDocuments" }
                ];
                const [questions, totalDocument] = yield Promise.all([
                    this.aggregateData(questionModal_2.default, pipeLine),
                    questionModal_2.default.aggregate(countPipeline),
                ]);
                const totalDocs = ((_a = totalDocument === null || totalDocument === void 0 ? void 0 : totalDocument[0]) === null || _a === void 0 ? void 0 : _a.totalDocuments) || 0;
                console.log(questions.length, totalDocs, 'inshad kundan');
                return { questions, totalDocs };
            }
            catch (error) {
                throw new Error(`Error occured while fetch  questions ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    editQuestions(questionId, updatedQuestion, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(questionId);
            try {
                let matchCondition = {};
                if (filter === "answered") {
                    matchCondition = {
                        $and: [{ answers: { $gte: 0 } }, { "answerData.isBlocked": false }],
                    };
                }
                else {
                    matchCondition = { answers: 0 };
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [updatedData, aggregateData] = yield Promise.all([
                    yield this.find_By_Id_And_Update(questionModal_2.default, questionId, { $set: Object.assign({}, updatedQuestion) }, { new: true }),
                    yield this.aggregateData(questionModal_2.default, [
                        {
                            $match: {
                                _id: new mongoose_1.default.Types.ObjectId(questionId),
                            },
                        },
                        {
                            $set: Object.assign({}, updatedQuestion),
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
                            $lookup: {
                                from: "answers",
                                localField: "_id",
                                foreignField: "questionId",
                                as: "answerData",
                            },
                        },
                        {
                            $unwind: {
                                path: "$answerData",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: "mentees",
                                localField: "answerData.authorId",
                                foreignField: "_id",
                                as: "answerData.author1",
                            },
                        },
                        {
                            $lookup: {
                                from: "mentors",
                                localField: "answerData.authorId",
                                foreignField: "_id",
                                as: "answerData.author2",
                            },
                        },
                        {
                            $match: matchCondition,
                        },
                        {
                            $addFields: {
                                "answerData.author": {
                                    $cond: {
                                        if: { $eq: ["$answerData.authorType", "mentee"] },
                                        then: { $arrayElemAt: ["$answerData.author1", 0] },
                                        else: { $arrayElemAt: ["$answerData.author2", 0] },
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                "answerData.author1": 0,
                                "answerData.author2": 0,
                            },
                        },
                        {
                            $group: {
                                _id: "$_id",
                                title: { $first: "$title" },
                                tags: { $first: "$tags" },
                                menteeId: { $first: "$menteeId" },
                                content: { $first: "$content" },
                                createdAt: { $first: "$createdAt" },
                                user: { $first: "$user" },
                                answers: { $sum: 1 },
                                answerData: {
                                    $push: {
                                        $cond: {
                                            if: { $ne: ["$answerData", {}] },
                                            then: "$answerData",
                                            else: "$$REMOVE",
                                        },
                                    },
                                },
                            },
                        },
                    ]),
                ]);
                return aggregateData;
            }
            catch (error) {
                throw new Error(`Error occured edit  questions ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    allQuestionData(filter, search, sortOrder, sortField, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let matchCondition = {};
                if (filter === "answered") {
                    matchCondition = {
                        $and: [{ answers: { $gt: 0 } }, { "answerData.isBlocked": false }],
                    };
                }
                else {
                    matchCondition = { answers: { $lte: 0 } };
                }
                if (search) {
                    matchCondition.$or = [
                        { title: { $regex: search, $options: "i" } },
                        { content: { $regex: search, $options: "i" } },
                        { tags: { $elemMatch: { $regex: search, $options: "i" } } },
                        { "user.name": { $regex: search, $options: "i" } },
                    ];
                }
                console.log(matchCondition, "matchcondition");
                const [question, count] = yield Promise.all([
                    this.aggregateData(questionModal_2.default, [
                        {
                            $match: { isBlocked: false },
                        },
                        {
                            $sort: { createdAt: -1 },
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
                            $lookup: {
                                from: "answers",
                                let: { questionId: "$_id" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$questionId", "$$questionId"] } } },
                                    { $sort: { createdAt: -1 } },
                                ],
                                as: "answerData",
                            },
                        },
                        {
                            $unwind: {
                                path: "$answerData",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: "mentees",
                                localField: "answerData.authorId",
                                foreignField: "_id",
                                as: "answerData.author1",
                            },
                        },
                        {
                            $lookup: {
                                from: "mentors",
                                localField: "answerData.authorId",
                                foreignField: "_id",
                                as: "answerData.author2",
                            },
                        },
                        {
                            $match: matchCondition,
                        },
                        {
                            $sort: { [sortField]: sortOrder === "asc" ? 1 : -1 }
                        },
                        {
                            $addFields: {
                                "answerData.author": {
                                    $cond: {
                                        if: { $eq: ["$answerData.authorType", "mentee"] },
                                        then: { $arrayElemAt: ["$answerData.author1", 0] },
                                        else: { $arrayElemAt: ["$answerData.author2", 0] },
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                "answerData.author1": 0,
                                "answerData.author2": 0,
                            },
                        },
                        {
                            $group: {
                                _id: "$_id",
                                title: { $first: "$title" },
                                tags: { $first: "$tags" },
                                menteeId: { $first: "$menteeId" },
                                content: { $first: "$content" },
                                createdAt: { $first: "$createdAt" },
                                user: { $first: "$user" },
                                answers: { $sum: 1 },
                                answerData: {
                                    $push: {
                                        $cond: {
                                            if: { $ne: ["$answerData", {}] },
                                            then: "$answerData",
                                            else: "$$REMOVE",
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $skip: skip,
                        },
                        {
                            $limit: limit,
                        },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                content: 1,
                                tags: 1,
                                menteeId: 1,
                                createdAt: 1,
                                user: {
                                    _id: 1,
                                    name: 1,
                                    profileUrl: 1,
                                    linkedinUrl: 1,
                                    githubUrl: 1,
                                },
                                answers: 1,
                                answerData: 1,
                                answer: 1,
                            },
                        },
                    ]),
                    this.aggregateData(questionModal_2.default, [
                        {
                            $match: filter === "answered"
                                ? { answers: { $gt: 0 } }
                                : { answers: { $lte: 0 } },
                        },
                        { $count: "count" },
                    ]),
                ]);
                const countResult = (count.length > 0 ? (_a = count[0]) === null || _a === void 0 ? void 0 : _a.count : 0);
                return { question, count: countResult };
            }
            catch (error) {
                throw new Error(`Error occured while get all data  questions ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    deleteQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.deleteDocument(questionId);
            }
            catch (error) {
                throw new Error(`Error occured while delete  questions ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    countAnswer(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const questId = questionId;
                console.log(typeof questId, "this is the type of questId in countAnswer");
                return yield this.find_By_Id_And_Update(questionModal_2.default, questId, {
                    $inc: { answers: 1 },
                });
            }
            catch (error) {
                throw new Error(`Error occured while count no of answers ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    reduceAnswerCount(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(questionModal_2.default, questionId, {
                    $inc: { answers: -1 },
                });
            }
            catch (error) {
                throw new Error(`Error occured while reduce the count of  answers ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    allQaData(skip, search, status, limit, sortOrder, sortField) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const sortOptions = sortOrder === "asc" ? 1 : -1;
                const pipeline = [];
                if (search) {
                    pipeline.push({
                        $match: {
                            $or: [
                                { content: { $regex: search, $options: "i" } },
                                { author: { $regex: search, $options: "i" } },
                            ],
                        },
                    });
                }
                if (status != "all") {
                    pipeline.push({
                        $match: {
                            isBlocked: status === "blocked",
                        },
                    });
                }
                pipeline.push({
                    $lookup: {
                        from: "mentees",
                        localField: "menteeId",
                        foreignField: "_id",
                        as: "user",
                    },
                }, {
                    $unwind: {
                        path: "$user",
                        preserveNullAndEmptyArrays: true,
                    },
                });
                pipeline.push({
                    $lookup: {
                        from: "answers",
                        localField: "_id",
                        foreignField: "questionId",
                        as: "answerData",
                    },
                });
                pipeline.push({
                    $project: {
                        _id: 1,
                        title: 1,
                        content: 1,
                        menteeId: 1,
                        createdAt: 1,
                        isBlocked: 1,
                        user: {
                            _id: 1,
                            name: 1,
                            profileUrl: 1,
                        },
                        answers: 1,
                        answerData: 1,
                    },
                }, {
                    $unwind: {
                        path: "$answerData",
                        preserveNullAndEmptyArrays: true,
                    },
                }, {
                    $lookup: {
                        from: "mentees",
                        localField: "answerData.authorId",
                        foreignField: "_id",
                        as: "answerData.author1",
                    },
                }, {
                    $lookup: {
                        from: "mentors",
                        localField: "answerData.authorId",
                        foreignField: "_id",
                        as: "answerData.author2",
                    },
                }, {
                    $addFields: {
                        "answerData.author": {
                            $cond: {
                                if: { $eq: ["$answerData.authorType", "mentee"] },
                                then: { $arrayElemAt: ["$answerData.author1", 0] },
                                else: { $arrayElemAt: ["$answerData.author2", 0] },
                            },
                        },
                    },
                }, {
                    $project: {
                        "answerData.author1": 0,
                        "answerData.author2": 0,
                    },
                }, {
                    $project: {
                        _id: 1,
                        title: 1,
                        menteeId: 1,
                        content: 1,
                        createdAt: 1,
                        isBlocked: 1,
                        user: 1,
                        answers: 1,
                        answerData: 1,
                    },
                }, {
                    $group: {
                        _id: "$_id",
                        title: { $first: "$title" },
                        tags: { $first: "$tags" },
                        menteeId: { $first: "$menteeId" },
                        content: { $first: "$content" },
                        isBlocked: { $first: "$isBlocked" },
                        createdAt: { $first: "$createdAt" },
                        user: { $first: "$user" },
                        answers: { $first: "$answers" },
                        answerData: {
                            $push: {
                                $cond: {
                                    if: { $ne: ["$answerData", {}] },
                                    then: "$answerData",
                                    else: "$$REMOVE",
                                },
                            },
                        },
                    },
                });
                if (sortField === "createdAt") {
                    pipeline.push({
                        $sort: { createdAt: sortOptions },
                    });
                }
                else {
                    if (sortOrder === "1") {
                        pipeline.push({
                            $match: {
                                answers: { $gt: 0 },
                            },
                        });
                    }
                    else if (sortOrder === "0") {
                        pipeline.push({
                            $match: {
                                answers: { $eq: 0 },
                            },
                        });
                    }
                }
                //skip the question
                pipeline.push({
                    $skip: skip,
                });
                pipeline.push({
                    $limit: limit,
                });
                //count the total no of doc
                const countPipeline = [
                    ...pipeline.slice(0, pipeline.length - 2),
                    {
                        $count: "totalDocuments",
                    },
                ];
                const [questions, totalCount] = yield Promise.all([
                    questionModal_2.default.aggregate(pipeline),
                    questionModal_2.default.aggregate(countPipeline),
                ]);
                return { questions, docCount: (_a = totalCount[0]) === null || _a === void 0 ? void 0 : _a.totalDocuments };
            }
            catch (error) {
                throw new Error(`Error occured while reduce the count of  answers ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    changeQuestionStatus(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(questionModal_2.default, questionId, [
                    { $set: { isBlocked: { $not: "$isBlocked" } } },
                ]);
            }
            catch (error) {
                throw new Error(`Error occured while Question STatus chagne ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = new questionRepository();
