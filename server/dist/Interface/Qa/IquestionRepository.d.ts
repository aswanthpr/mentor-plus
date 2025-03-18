import { DeleteResult, ObjectId } from "mongoose";
import { Iquestion } from "../../Model/questionModal";
export interface IquestionRepository {
    createQuestion(title: string, content: string, tags: string[], userId: ObjectId): Promise<Iquestion | null>;
    questionData(menteeId: ObjectId, filter: string): Promise<Iquestion[]>;
    editQuestions(questionId: string, updatedQuestion: Iquestion, filter: string): Promise<Iquestion[] | null>;
    allQuestionData(filter: string, search: string, skip: number, limit: number): Promise<{
        question: Iquestion[] | [];
        count: number;
    }>;
    deleteQuestion(questionId: string): Promise<DeleteResult | undefined>;
    countAnswer(questionId: string): Promise<Iquestion | null>;
    reduceAnswerCount(questionId: string): Promise<Iquestion | null>;
    isQuestionExist(field1: string, field2: string): Promise<Iquestion[] | null>;
    allQaData(skip: number, search: string, status: string, limit: number, sortOrder: string, sortField: string): Promise<{
        questions: Iquestion[];
        docCount: number;
    } | null>;
    changeQuestionStatus(questionId: string): Promise<Iquestion | null>;
}
//# sourceMappingURL=IquestionRepository.d.ts.map