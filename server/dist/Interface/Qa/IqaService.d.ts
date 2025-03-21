import { ObjectId } from "mongoose";
import { Iquestion } from "../../Model/questionModal";
import { IcreateQuestion } from "../../Types";
import { Ianswer } from "../../Model/answerModel";
export interface IqaService {
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
//# sourceMappingURL=IqaService.d.ts.map