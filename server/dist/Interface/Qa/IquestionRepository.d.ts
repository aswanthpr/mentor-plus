import { DeleteResult, ObjectId } from "mongoose";
import { Iquestion } from "src/Model/questionModal";
export interface IquestionRepository {
    createQuestion(title: string, content: string, tags: string[], userId: ObjectId): Promise<Iquestion | null>;
    questionData(menteeId: ObjectId, filter: string): Promise<Iquestion[]>;
    editQuestions(questionId: string, updatedQuestion: Iquestion): Promise<Iquestion | null>;
    allQuestionData(filter: string): Promise<Iquestion[] | null>;
    deleteQuestion(questionId: string): Promise<DeleteResult | undefined>;
    countAnswer(questionId: string): Promise<Iquestion | null>;
    reduceAnswerCount(questionId: string): Promise<Iquestion | null>;
    isQuestionExist(field1: string, field2: string): Promise<Iquestion[] | null>;
    allQaData(skip: number, search: string, status: string, limit: string, sortOrder: string, sortField: string): Promise<{
        questions: Iquestion[];
        docCount: number;
    } | null>;
    changeQuestionStatus(questionId: string): Promise<Iquestion | null>;
}
//# sourceMappingURL=IquestionRepository.d.ts.map