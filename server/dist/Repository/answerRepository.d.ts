import { IanswerWithQuestion } from "../Types";
import { IanswerRepository } from "../Interface/Qa/IanswerRepository";
import { Ianswer } from "../Model/answerModel";
import { baseRepository } from "./baseRepo";
import { DeleteResult, ObjectId } from "mongoose";
declare class answerRespository extends baseRepository<Ianswer> implements IanswerRepository {
    constructor();
    createNewAnswer(answer: string, questionId: ObjectId, userId: ObjectId, userType: string): Promise<{
        result: IanswerWithQuestion | null;
        menteeId: ObjectId;
    }>;
    editAnswer(content: string, answerId: string): Promise<Ianswer | null>;
    deleteAnswer(questionId: string): Promise<DeleteResult | undefined>;
    changeAnswerStatus(answerId: string): Promise<Ianswer | null>;
}
declare const _default: answerRespository;
export default _default;
//# sourceMappingURL=answerRepository.d.ts.map