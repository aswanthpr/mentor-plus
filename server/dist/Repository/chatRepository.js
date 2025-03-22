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
const baseRepo_1 = require("./baseRepo");
const chatSchema_1 = __importDefault(require("../Model/chatSchema"));
const messageSchema_1 = __importDefault(require("../Model/messageSchema"));
class chatRepository extends baseRepo_1.baseRepository {
    constructor() {
        super(chatSchema_1.default);
    }
    getMenteechats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.aggregateData(chatSchema_1.default, [
                    {
                        $match: {
                            menteeId: userId,
                        },
                    },
                    {
                        $lookup: {
                            from: "mentors",
                            localField: "mentorId",
                            foreignField: "_id",
                            as: "users",
                        },
                    },
                    {
                        $unwind: "$users",
                    },
                    {
                        $project: {
                            _id: 1,
                            mentorId: 1,
                            menteeId: 1,
                            lastMessage: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            users: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                phone: 1,
                                githubUrl: 1,
                                linkedinUrl: 1,
                                profileUrl: 1,
                            },
                        },
                    },
                    {
                        $sort: { updatedAt: -1 }
                    },
                ]);
            }
            catch (error) {
                throw new Error(`${"\x1b[35m%s\x1b[0m"}error while mentor chats:${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    getMentorchats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.aggregateData(chatSchema_1.default, [
                    {
                        $match: {
                            mentorId: userId,
                        },
                    },
                    {
                        $lookup: {
                            from: "mentees",
                            localField: "menteeId",
                            foreignField: "_id",
                            as: "users",
                        },
                    },
                    {
                        $unwind: "$users",
                    },
                    {
                        $project: {
                            _id: 1,
                            mentorId: 1,
                            menteeId: 1,
                            lastMessage: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            users: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                phone: 1,
                                githubUrl: 1,
                                linkedinUrl: 1,
                                profileUrl: 1,
                            },
                        },
                    },
                ]);
            }
            catch (error) {
                throw new Error(`${"\x1b[35m%s\x1b[0m"}error while creating mentor chats :${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //creating chat document
    createChatDocs(mentorId, menteeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.createDocument({ menteeId, mentorId });
            }
            catch (error) {
                throw new Error(`${"\x1b[35m%s\x1b[0m"}error while creating  chats :${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    //get users data
    getUserMessage(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.aggregateData(messageSchema_1.default, [
                    {
                        $match: {
                            chatId,
                        },
                    },
                    {
                        $lookup: {
                            from: "chats",
                            localField: "chatId",
                            foreignField: "_id",
                            as: "chats"
                        }
                    },
                    {
                        $unwind: {
                            path: '$chats',
                            preserveNullAndEmptyArrays: true
                        }
                    }
                ]);
            }
            catch (error) {
                throw new Error(`${"\x1b[35m%s\x1b[0m"}error while getting user message :${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    findChatRoom(mentorId, menteeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.find_One({ menteeId, mentorId });
            }
            catch (error) {
                throw new Error(`error while finding chat Room  in slot schedule repositry${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
}
exports.default = new chatRepository();
