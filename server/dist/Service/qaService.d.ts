import { ObjectId } from "mongoose";
import { IanswerRepository } from "../Interface/Qa/IanswerRepository";
import { IqaService } from "../Interface/Qa/IqaService";
import { IquestionRepository } from "../Interface/Qa/IquestionRepository";
import { Ianswer } from "../Model/answerModel";
import { Iquestion } from "../Model/questionModal";
import { IcreateQuestion } from "../Types";
declare class qaService implements IqaService {
    private __questionRepository;
    private __answerRepository;
    constructor(__questionRepository: IquestionRepository, __answerRepository: IanswerRepository);
    addQuestionService(Data: IcreateQuestion, userId: ObjectId): Promise<{
        success: boolean;
        message: string;
        status: number;
        question: Iquestion | undefined;
    }>;
    questionData(userId: ObjectId, filter: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        question: Iquestion[];
        userId?: ObjectId;
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
        answers: Ianswer | null;
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
    allQaData(search: string, status: string, sortField: string, sortOrder: string, page: string, limit: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        questions: Iquestion[] | undefined;
        docCount: number | undefined;
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