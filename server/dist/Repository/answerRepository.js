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
const answerModel_1 = __importDefault(require("../Model/answerModel"));
const baseRepo_1 = require("./baseRepo");
class answerRespository extends baseRepo_1.baseRepository {
    constructor() {
        super(answerModel_1.default);
    }
    createNewAnswer(answer, questionId, userId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const result = yield (yield this.createDocument({
                    answer,
                    questionId,
                    authorId: userId,
                    authorType: userType,
                }));
                const data = yield this.aggregateData(answerModel_1.default, [
                    {
                        $match: { questionId, _id: result === null || result === void 0 ? void 0 : result._id }
                    },
                    {
                        $lookup: {
                            from: "mentees",
                            localField: "authorId",
                            foreignField: "_id",
                            as: "author",
                        }
                    },
                    {
                        $unwind: {
                            path: "$author",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "questions",
                            localField: "questionId",
                            foreignField: "_id",
                            as: "question",
                            pipeline: [{ $project: { menteeId: 1 } }],
                        },
                    },
                    {
                        $unwind: {
                            path: "$question",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                ]);
                return { result: data[0], menteeId: (_b = (_a = data[0]) === null || _a === void 0 ? void 0 : _a.question) === null || _b === void 0 ? void 0 : _b.menteeId };
            }
            catch (error) {
                throw new Error(`Error occured while create answer ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    editAnswer(content, answerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(answerModel_1.default, answerId, {
                    $set: { answer: content },
                });
            }
            catch (error) {
                throw new Error(`Error occured while edit answer ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    deleteAnswer(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.deleteMany({ questionId });
            }
            catch (error) {
                throw new Error(`Error occured while delete answer ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    changeAnswerStatus(answerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_By_Id_And_Update(answerModel_1.default, answerId, [
                    { $set: { isBlocked: { $not: "$isBlocked" } } },
                ]);
            }
            catch (error) {
                throw new Error(`Error occured while Question STatus chagne ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = new answerRespository();
