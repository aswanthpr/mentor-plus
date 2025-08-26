import { Iquestion } from "../../Model/questionModal";
import { IquestionRepository } from "../interface/IquestionRepository";
import { baseRepository } from "../baseRepo";
import { DeleteResult, ObjectId } from "mongoose";
declare class questionRepository extends baseRepository<Iquestion> implements IquestionRepository {
    constructor();
    createQuestion(title: string, content: string, tags: string[], menteeId: ObjectId): Promise<Iquestion | null>;
    isQuestionExist(field1: string, field2: string): Promise<Iquestion[] | null>;
    questionData(menteeId: ObjectId, filter: string, search: string, limit: number, skip: number, sortField: string, sortOrder: string): Promise<{
        questions: Iquestion[] | [];
        totalDocs: number;
    }>;
    editQuestions(questionId: string, updatedQuestion: Iquestion, filter: string): Promise<Iquestion[] | null>;
    allQuestionData(filter: string, search: string, sortOrder: string, sortField: string, skip: number, limit: number): Promise<{
        question: Iquestion[] | [];
        count: number;
    }>;
    deleteQuestion(questionId: string): Promise<DeleteResult | undefined>;
    countAnswer(questionId: string): Promise<Iquestion | null>;
    reduceAnswerCount(questionId: string): Promise<Iquestion | null>;
    allQaData(skip: number, search: string, status: string, limit: number, sortOrder: string, sortField: string): Promise<{
        questions: Iquestion[];
        docCount: number;
    } | null>;
    changeQuestionStatus(questionId: string): Promise<Iquestion | null>;
}
declare const _default: questionRepository;
export default _default;
//# sourceMappingURL=questionRepository.d.ts.map