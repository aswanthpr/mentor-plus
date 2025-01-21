import { ObjectId } from "mongoose";
import { Ianswer } from "../../Model/answerModel"


export interface IanswerRepository {
    createNewAnswer(answer: string, questionId: ObjectId, userId: ObjectId, userType: string): Promise<Ianswer | null> 
}