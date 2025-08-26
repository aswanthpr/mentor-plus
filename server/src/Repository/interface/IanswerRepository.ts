import { DeleteResult, ObjectId } from "mongoose";
import { Ianswer } from "../../Model/answerModel"
import { IanswerWithQuestion } from "../../Types";


export interface IanswerRepository {
    createNewAnswer(answer: string, questionId: ObjectId, userId: ObjectId, userType: string): Promise<{result:IanswerWithQuestion| null,menteeId:ObjectId}> ;
    editAnswer(content:string,answerId:string):Promise<Ianswer|null>
    deleteAnswer(questionId:string):Promise<DeleteResult|undefined>
    changeAnswerStatus(answerId:string):Promise<Ianswer|null>
}