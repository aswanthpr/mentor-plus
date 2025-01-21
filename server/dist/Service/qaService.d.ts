import { ObjectId } from "mongoose";
import { IanswerRepository } from "src/Interface/Qa/IanswerRepository";
import { IqaService } from "../Interface/Qa/IqaService";
import { IquestionRepository } from "src/Interface/Qa/IquestionRepository";
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
    getQuestionData(userId: ObjectId, filter: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        question: Iquestion[];
        userId?: ObjectId;
    }>;
    editQuestion(questionId: string, updatedQuestion: Iquestion): Promise<{
        success: boolean;
        message: string;
        status: number;
        question: Iquestion | null;
    }>;
    createNewAnswer(answer: string, questionId: ObjectId, userId: ObjectId, userType: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        answers: Ianswer | null;
    }>;
}
export default qaService;
//# sourceMappingURL=qaService.d.ts.map