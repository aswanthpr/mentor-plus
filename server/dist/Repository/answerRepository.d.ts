import { IanswerRepository } from "../Interface/Qa/IanswerRepository";
import { Ianswer } from "../Model/answerModel";
import { BaseRepository } from "./baseRepo";
import { ObjectId } from "mongoose";
declare class answerRespository extends BaseRepository<Ianswer> implements IanswerRepository {
    constructor();
    createNewAnswer(answer: string, questionId: ObjectId, userId: ObjectId, userType: string): Promise<Ianswer | null>;
}
declare const _default: answerRespository;
export default _default;
//# sourceMappingURL=answerRepository.d.ts.map