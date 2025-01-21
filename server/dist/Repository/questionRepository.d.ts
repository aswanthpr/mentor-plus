import { Iquestion } from "../Model/questionModal";
import { IquestionRepository } from "../Interface/Qa/IquestionRepository";
import { BaseRepository } from "./baseRepo";
import { DeleteResult, ObjectId } from "mongoose";
declare class questionRepository extends BaseRepository<Iquestion> implements IquestionRepository {
    constructor();
    createQuestion(title: string, content: string, tags: string[], menteeId: ObjectId): Promise<Iquestion | null>;
    getQuestionData(menteeId: ObjectId, filter: string): Promise<Iquestion[]>;
    editQuestions(questionId: string, updatedQuestion: Iquestion): Promise<Iquestion | null>;
    allQuestionData(filter: string): Promise<Iquestion[] | null>;
    deleteQuestion(questionId: string): Promise<DeleteResult | undefined>;
    countAnswer(questionId: string): Promise<Iquestion | null>;
    reduceAnswerCount(questionId: string): Promise<Iquestion | null>;
}
declare const _default: questionRepository;
export default _default;
//# sourceMappingURL=questionRepository.d.ts.map