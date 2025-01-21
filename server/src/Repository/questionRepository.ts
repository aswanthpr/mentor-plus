import questionSchema, { Iquestion } from "../Model/questionModal";
import { IquestionRepository } from "../Interface/Qa/IquestionRepository";
import { BaseRepository } from "./baseRepo";
import { DeleteResult, ObjectId } from "mongoose";
import questionModal from "../Model/questionModal";


class questionRepository extends BaseRepository<Iquestion> implements IquestionRepository {
    constructor() {
        super(questionSchema,
          
        )
    }

    async createQuestion(title: string, content: string, tags: string[], menteeId: ObjectId): Promise<Iquestion | null> {
        try {
            return await this.createDocument({
                title,
                content,
                tags,
                menteeId
            });
        } catch (error: unknown) {
            throw new Error(
                `error create new question ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
    async getQuestionData(menteeId: ObjectId,filter:string): Promise<Iquestion[]> {
        try {
            let matchCondition ={};
            if(filter==='answered'){
                matchCondition = {answers:{$gt:0}};
            }else{
                matchCondition = {answers:0}
            }
            return await this.aggregateData(questionModal,
                [
                    {
                        $match: {
                            menteeId: menteeId
                        }
                    },
                    {
                        $sort: {
                            createdAt: -1
                        }
                    },
                    {
                        $lookup: {
                            from: "mentees",
                            localField: "menteeId",
                            foreignField: "_id",
                            as: 'menteeData'
                        },

                    },
                    {
                        $unwind: "$menteeData"
                    },
                    {
                        $match:matchCondition
                    },
                    {
                        $lookup: {
                            from: "answers",
                            localField: "_id",
                            foreignField: "questionId",
                            as:"answerData"
                        },
    
                    },
                    {
                        $lookup: {
                            from: "answerData.authorType",
                            localField: "_id",
                            foreignField: "authorId",
                            as:"author"
                        },
    
                    },
                ]
            )
            //   const repo =   await this.find(questionModal,{menteeId})


        } catch (error: unknown) {
            throw new Error(
                `Error occured while fetch  questions ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
    async editQuestions(questionId: string, updatedQuestion: Iquestion): Promise<Iquestion | null> {
        try {
            return await this.find_By_Id_And_Update(
                questionModal,
                questionId,
                { $set: { ...updatedQuestion } },
                { new: true },
                'menteeId'
            );
        } catch (error: unknown) {
            throw new Error(
                `Error occured edit  questions ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
    async allQuestionData(filter:string): Promise<Iquestion[]|null> {
        try {
            
            let matchCondition ={};
            if(filter==='answered'){
                matchCondition = {answers:{$gt:0}};
            }else{
                matchCondition = {answers:0}
            }

            return await this.aggregateData(questionModal, [
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $lookup: {
                        from: "mentees",
                        localField: "menteeId",
                        foreignField: "_id",
                        as:'user'
                    },

                },
                {
                    $unwind:{path: "$user"}
                    
                },
                {
                    $match:matchCondition
                },
                {
                    $lookup: {
                        from: "answers",
                        localField: "_id",
                        foreignField: "questionId",
                        as:"answerData",
                    },
                    
                },
                
            ])
            // pipeline: [
            //     {
            //         $lookup: {
            //             from:'answerData.authorType',
            //             localField: 'answerData.authoId',
            //             foreignField: '_id',
            //             as: 'author',
            //         },
            //     },
            // ],
        } catch (error: unknown) {
            throw new Error(
                `Error occured while get all data  questions ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
    
    async deleteQuestion(questionId:string):Promise<DeleteResult|undefined>{
        try {
            return this.deleteDocument(questionId)
        } catch (error:unknown) {
            throw new Error(
                `Error occured while delete  questions ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
    async countAnswer(questionId:string): Promise<Iquestion | null> {
        try {
           const  questId =  questionId as unknown as string;
           console.log(typeof questId,'this is the type of questId in countAnswer')
            return this.find_By_Id_And_Update(questionModal,questId,{$inc:{answers:1}});
        } catch (error:unknown) {
            throw new Error(
                `Error occured while count no of answers ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
    async reduceAnswerCount(questionId: string): Promise<Iquestion | null> {
        try {
          
          
            return this.find_By_Id_And_Update(questionModal,questionId,{$inc:{answers:-1}});
        } catch (error:unknown) {
            throw new Error(
                `Error occured while reduce the count of  answers ${error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
}

export default new questionRepository()