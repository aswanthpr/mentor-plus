import { ObjectId } from "mongoose";
import { Iquestion } from "../../Model/questionModal";
import { IcreateQuestion } from "src/Types";
import { Ianswer } from "../../Model/answerModel";
export interface IqaService {
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
    allQaData(search: string | undefined, status: string, sortField: string, sortOrder: string, page: string, limit: string): Promise<{
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
//# sourceMappingURL=IqaService.d.ts.map