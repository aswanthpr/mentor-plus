
import { ObjectId } from "mongoose";
import { Iquestion } from "../../Model/questionModal";
import { IcreateQuestion } from "src/Types";
import { Ianswer } from "src/Model/answerModel";



export interface IqaService {
    addQuestionService(Data: IcreateQuestion, userId: ObjectId): Promise<{ success: boolean, message: string, status: number, question: Iquestion | undefined }>
    getQuestionData(userId: ObjectId,filter:string): Promise<{ success: boolean; message: string; status: number; question: Iquestion[], userId?: ObjectId }>

    editQuestion(questionId:string,updatedQuestion:Iquestion):Promise<{success:boolean,message:string,status:number,question:Iquestion|null}>

    createNewAnswer(answer:string,questionId:ObjectId,userId:ObjectId,userType:string):Promise<{success:boolean,message:string,status:number,answers:Ianswer |null}>
}