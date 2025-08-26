import { ObjectId } from "mongoose";
import { IanswerRepository } from "../../Repository/interface/IanswerRepository";
import { IqaService } from "../interface/IqaService";
import { IquestionRepository } from "../../Repository/interface/IquestionRepository";
import { Iquestion } from "../../Model/questionModal";
import { IanswerWithQuestion, IcreateQuestion } from "../../Types";
import { InotificationRepository } from "../../Repository/interface/InotificationRepository";
declare class qaService implements IqaService {
    private readonly __questionRepository;
    private readonly __answerRepository;
    private readonly __notificationRepository;
    constructor(__questionRepository: IquestionRepository, __answerRepository: IanswerRepository, __notificationRepository: InotificationRepository);
    addQuestionService(Data: IcreateQuestion, userId: ObjectId): Promise<{
        success: boolean;
        message: string;
        status: number;
        question: Iquestion | undefined;
    }>;
    questionData(userId: ObjectId, filter: string, search: string, sortField: string, sortOrder: string, limit: number, page: number): Promise<{
        success: boolean;
        message: string;
        status: number;
        question: Iquestion[];
        userId?: ObjectId;
        totalPage: number;
    }>;
    editQuestion(questionId: string, updatedQuestion: Iquestion, filter: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        question: Iquestion[] | null;
    }>;
    createNewAnswer(answer: string, questionId: ObjectId, userId: ObjectId, userType: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        answers: IanswerWithQuestion | null;
    }>;
    editAnswer(content: string, answerId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        answer: string | null;
    }>;
    deleteQuestion(questionId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
    }>;
    allQaData(search: string, status: string, sortField: string, sortOrder: string, page: number, limit: number): Promise<{
        success: boolean;
        message: string;
        status: number;
        questions: Iquestion[] | undefined;
        totalPage: number | undefined;
    }>;
    changeQuestionStatus(questionId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        result?: boolean;
    }>;
    changeAnswerStatus(answerId: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        result?: boolean;
    }>;
}
export default qaService;
//# sourceMappingURL=qaService.d.ts.map