import {questionSchema,  Iquestion} from "../../Model/index";
import { IquestionRepository } from "../interface/IquestionRepository";
import { baseRepository } from "../baseRepo";
import mongoose, { DeleteResult, ObjectId, PipelineStage } from "mongoose";
import { HttpError } from "../../Utils/index";
import { Status } from "../../Constants/httpStatusCode";

class questionRepository
  extends baseRepository<Iquestion>
  implements IquestionRepository
{
  constructor() {
    super(questionSchema);
  }

  async createQuestion(
    title: string,
    content: string,
    tags: string[],
    menteeId: ObjectId
  ): Promise<Iquestion | null> {
    try {
      const res = await this.createDocument({
        title,
        content,
        tags,
        menteeId,
      });
      return res.populate({
        path: "menteeId",
        select: "name profileUrl githubUrl LinkedinUrl ",
      });
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async isQuestionExist(
    field1: string,
    field2: string
  ): Promise<Iquestion[] | null> {
    try {
      return await this.find(questionSchema, { title: field1, content: field2 });
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async questionData(
    menteeId: ObjectId,
    filter: string,
    search: string,
    limit: number,
    skip: number,
    sortField: string,
    sortOrder: string
  ): Promise<{ questions: Iquestion[] | []; totalDocs: number }> {
    try {
      let matchCondition = {};
      if (filter === "answered") {
        matchCondition = { $expr: { $gt: [{ $size: "$answerData" }, 0] } };
      } else {
        matchCondition = {
          $expr: { $eq: [{ $size: "$answerData" }, 0] },
        };
      }
      const pipeLine: PipelineStage[] = [
        {
          $match: {
            menteeId: menteeId,
            isBlocked: false,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "mentees",
            localField: "menteeId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "answers",
            localField: "_id",
            foreignField: "questionId",
            as: "answerData",
          },
        },

        {
          $unwind: {
            path: "$answerData",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "mentees",
            localField: "answerData.authorId",
            foreignField: "_id",
            as: "answerData.author1",
          },
        },
        {
          $lookup: {
            from: "mentors",
            localField: "answerData.authorId",
            foreignField: "_id",
            as: "answerData.author2",
          },
        },

        {
          $addFields: {
            "answerData.author": {
              $cond: {
                if: { $eq: ["$answerData.authorType", "mentee"] },
                then: { $arrayElemAt: ["$answerData.author1", 0] },
                else: { $arrayElemAt: ["$answerData.author2", 0] },
              },
            },
          },
        },
        {
          $project: {
            "answerData.author1": 0,
            "answerData.author2": 0,
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            tags: 1,
            menteeId: 1,
            createdAt: 1,
            user: {
              _id: 1,
              name: 1,
              profileUrl: 1,
              linkedinUrl: 1,
              githubUrl: 1,
            },
            answers: 1,
            answerData: 1,
          },
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            tags: { $first: "$tags" },
            menteeId: { $first: "$menteeId" },
            content: { $first: "$content" },
            createdAt: { $first: "$createdAt" },
            user: { $first: "$user" },
            answers: { $first: "$answers" },
            answerData: {
              $push: {
                $cond: {
                  if: { $ne: ["$answerData", {}] },
                  then: "$answerData",
                  else: "$$REMOVE",
                },
              },
            },
          },
        },
        {
          $addFields: {
            answerData: {
              $filter: {
                input: "$answerData",
                as: "answer",
                cond: { $eq: ["$$answer.isBlocked", false] },
              },
            },
          },
        },
        {
          $match: matchCondition,
        },
      ];
      if (search) {
        pipeLine.push({
          $match: {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { tags: { $in: [{ regex: search, $options: "i" }] } },
              { content: { $regex: search, $options: "i" } },
              { "user.name": { $regex: search, $options: "i" } },
            ],
          },
        });
      }
      if (sortField === "createdAt") {
        pipeLine.push({ $sort: { createdAt: sortOrder === "asc" ? 1 : -1 } });
      } else {
        pipeLine.push({ $sort: { answers: -1 } });
      }
      pipeLine.push({ $skip: skip });
      pipeLine.push({ $limit: limit });
      const countPipeline: PipelineStage[] = [
        ...pipeLine.slice(0, -2),
        { $count: "totalDocuments" },
      ];
      const [questions, totalDocument] = await Promise.all([
        this.aggregateData(questionSchema, pipeLine),
        questionSchema.aggregate(countPipeline),
      ]);
      const totalDocs = totalDocument?.[0]?.totalDocuments || 0;
      
      return { questions, totalDocs };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async editQuestions(
    questionId: string,
    updatedQuestion: Iquestion,
    filter: string
  ): Promise<Iquestion[] | null> {
    
    try {
      let matchCondition = {};
      if (filter === "answered") {
        matchCondition = {
          $and: [{ $expr: { $gt: [{ $size: "$answerData" }, 0] } }],
        };
      } else {
        matchCondition = {
          $expr: { $eq: [{ $size: "$answerData" }, 0] },
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [updatedData, aggregateData] = await Promise.all([
        await this.find_By_Id_And_Update(
          questionSchema,
          questionId,
          { $set: { ...updatedQuestion } },
          { new: true }
        ),
        await this.aggregateData(questionSchema, [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(questionId),
            },
          },
          {
            $set: {
              ...updatedQuestion,
            },
          },

          {
            $lookup: {
              from: "mentees",
              localField: "menteeId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "answers",
              localField: "_id",
              foreignField: "questionId",
              as: "answerData",
            },
          },
          {
            $unwind: {
              path: "$answerData",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "mentees",
              localField: "answerData.authorId",
              foreignField: "_id",
              as: "answerData.author1",
            },
          },
          {
            $lookup: {
              from: "mentors",
              localField: "answerData.authorId",
              foreignField: "_id",
              as: "answerData.author2",
            },
          },

          {
            $addFields: {
              "answerData.author": {
                $cond: {
                  if: { $eq: ["$answerData.authorType", "mentee"] },
                  then: { $arrayElemAt: ["$answerData.author1", 0] },
                  else: { $arrayElemAt: ["$answerData.author2", 0] },
                },
              },
            },
          },
          {
            $project: {
              "answerData.author1": 0,
              "answerData.author2": 0,
            },
          },
          {
            $group: {
              _id: "$_id",
              title: { $first: "$title" },
              tags: { $first: "$tags" },
              menteeId: { $first: "$menteeId" },
              content: { $first: "$content" },
              createdAt: { $first: "$createdAt" },
              user: { $first: "$user" },
              answers: { $sum: 1 },
              answerData: {
                $push: {
                  $cond: {
                    if: { $ne: ["$answerData", {}] },
                    then: "$answerData",
                    else: "$$REMOVE",
                  },
                },
              },
            },
          },
          {
            $addFields: {
              answerData: {
                $filter: {
                  input: "$answerData",
                  as: "answer",
                  cond: { $eq: ["$$answer.isBlocked", false] },
                },
              },
            },
          },
          {
            $match: matchCondition,
          },
        ]),
      ]);

      return aggregateData;
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }

  async allQuestionData(
    filter: string,
    search: string,
    sortOrder: string,
    sortField: string,
    skip: number,
    limit: number
  ): Promise<{ question: Iquestion[] | []; count: number }> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let matchCondition: any = {};

      if (filter === "answered") {
        matchCondition = { $expr: { $gt: [{ $size: "$answerData" }, 0] } };
      } else {
        matchCondition = {
          $expr: { $eq: [{ $size: "$answerData" }, 0] },
        };
      }
      if (search) {
        matchCondition.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { tags: { $elemMatch: { $regex: search, $options: "i" } } },
          { "user.name": { $regex: search, $options: "i" } },
        ];
      }


      const [question, count] = await Promise.all([
        this.aggregateData(questionSchema, [
          {
            $match: { isBlocked: false },
          },
          {
            $sort: { createdAt: -1 },
          },

          {
            $lookup: {
              from: "mentees",
              localField: "menteeId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: "answers",
              let: { questionId: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$questionId", "$$questionId"] } } },
                { $sort: { createdAt: -1 } },
              ],
              as: "answerData",
            },
          },
          {
            $unwind: {
              path: "$answerData",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: "mentees",
              localField: "answerData.authorId",
              foreignField: "_id",
              as: "answerData.author1",
            },
          },
          {
            $lookup: {
              from: "mentors",
              localField: "answerData.authorId",
              foreignField: "_id",
              as: "answerData.author2",
            },
          },

          {
            $sort: { [sortField]: sortOrder === "asc" ? 1 : -1 },
          },

          {
            $addFields: {
              "answerData.author": {
                $cond: {
                  if: { $eq: ["$answerData.authorType", "mentee"] },
                  then: { $arrayElemAt: ["$answerData.author1", 0] },
                  else: { $arrayElemAt: ["$answerData.author2", 0] },
                },
              },
            },
          },
          {
            $project: {
              "answerData.author1": 0,
              "answerData.author2": 0,
            },
          },

          {
            $group: {
              _id: "$_id",
              title: { $first: "$title" },
              tags: { $first: "$tags" },
              menteeId: { $first: "$menteeId" },
              content: { $first: "$content" },
              createdAt: { $first: "$createdAt" },
              user: { $first: "$user" },
              answers: { $sum: 1 },
              answerData: {
                $push: {
                  $cond: {
                    if: { $ne: ["$answerData", {}] },
                    then: "$answerData",
                    else: "$$REMOVE",
                  },
                },
              },
            },
          },
          {
            $addFields: {
              answerData: {
                $filter: {
                  input: "$answerData",
                  as: "answer",
                  cond: { $eq: ["$$answer.isBlocked", false] },
                },
              },
            },
          },
          {
            $match: matchCondition,
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          {
            $project: {
              _id: 1,
              title: 1,
              content: 1,
              tags: 1,
              menteeId: 1,
              createdAt: 1,
              user: {
                _id: 1,
                name: 1,
                profileUrl: 1,
                linkedinUrl: 1,
                githubUrl: 1,
              },
              answers: 1,
              answerData: 1,
              answer: 1,
            },
          },
        ]),
        this.aggregateData(questionSchema, [
          {
            $match:
              filter === "answered"
                ? { answers: { $gt: 0 } }
                : { answers: { $lte: 0 } },
          },
          { $count: "count" },
        ]),
      ]);
      const countResult = (count.length > 0 ? count[0]?.count : 0) as number;

      return { question, count: countResult };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }

  async deleteQuestion(questionId: string): Promise<DeleteResult | undefined> {
    try {
      return await this.deleteDocument(questionId);
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async countAnswer(questionId: string): Promise<Iquestion | null> {
    try {
      const questId = questionId as unknown as string;
    
      return await this.find_By_Id_And_Update(questionSchema, questId, {
        $inc: { answers: 1 },
      });
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async reduceAnswerCount(questionId: string): Promise<Iquestion | null> {
    try {
      return await this.find_By_Id_And_Update(questionSchema, questionId, {
        $inc: { answers: -1 },
      });
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }

  async allQaData(
    skip: number,
    search: string,
    status: string,
    limit: number,
    sortOrder: string,
    sortField: string
  ): Promise<{ questions: Iquestion[]; docCount: number } | null> {
    try {
      const sortOptions = sortOrder === "asc" ? 1 : -1;

      const pipeline: PipelineStage[] = [];

      if (search) {
        pipeline.push({
          $match: {
            $or: [
              { content: { $regex: search, $options: "i" } },
              { author: { $regex: search, $options: "i" } },
            ],
          },
        });
      }
      if (status != "all") {
        pipeline.push({
          $match: {
            isBlocked: status === "blocked",
          },
        });
      }
      pipeline.push(
        {
          $lookup: {
            from: "mentees",
            localField: "menteeId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        }
      );
      pipeline.push({
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "questionId",
          as: "answerData",
        },
      });
      pipeline.push(
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            menteeId: 1,
            createdAt: 1,
            isBlocked: 1,
            user: {
              _id: 1,
              name: 1,
              profileUrl: 1,
            },
            answers: 1,
            answerData: 1,
          },
        },
        {
          $unwind: {
            path: "$answerData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "mentees",
            localField: "answerData.authorId",
            foreignField: "_id",
            as: "answerData.author1",
          },
        },

        {
          $lookup: {
            from: "mentors",
            localField: "answerData.authorId",
            foreignField: "_id",
            as: "answerData.author2",
          },
        },
        {
          $addFields: {
            "answerData.author": {
              $cond: {
                if: { $eq: ["$answerData.authorType", "mentee"] },
                then: { $arrayElemAt: ["$answerData.author1", 0] },
                else: { $arrayElemAt: ["$answerData.author2", 0] },
              },
            },
          },
        },
        {
          $project: {
            "answerData.author1": 0,
            "answerData.author2": 0,
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            menteeId: 1,
            content: 1,
            createdAt: 1,
            isBlocked: 1,
            user: 1,
            answers: 1,
            answerData: 1,
          },
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            tags: { $first: "$tags" },
            menteeId: { $first: "$menteeId" },
            content: { $first: "$content" },
            isBlocked: { $first: "$isBlocked" },
            createdAt: { $first: "$createdAt" },
            user: { $first: "$user" },
            answers: { $first: "$answers" },
            answerData: {
              $push: {
                $cond: {
                  if: { $ne: ["$answerData", {}] },
                  then: "$answerData",
                  else: "$$REMOVE",
                },
              },
            },
          },
        }
      );

      if (sortField === "createdAt") {
        pipeline.push({
          $sort: { createdAt: sortOptions },
        });
      } else {
        if (sortOrder === "1") {
          pipeline.push({
            $match: {
              answers: { $gt: 0 },
            },
          });
        } else if (sortOrder === "0") {
          pipeline.push({
            $match: {
              answers: { $eq: 0 },
            },
          });
        }
      }
      //skip the question
      pipeline.push({
        $skip: skip,
      });

      pipeline.push({
        $limit: limit,
      });
      //count the total no of doc
      const countPipeline = [
        ...pipeline.slice(0, pipeline.length - 2),

        {
          $count: "totalDocuments",
        },
      ];
      const [questions, totalCount] = await Promise.all([
        questionSchema.aggregate(pipeline),
        questionSchema.aggregate(countPipeline),
      ]);

      return { questions, docCount: totalCount[0]?.totalDocuments };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async changeQuestionStatus(questionId: string): Promise<Iquestion | null> {
    try {
      return await this.find_By_Id_And_Update(questionSchema, questionId, [
        { $set: { isBlocked: { $not: "$isBlocked" } } },
      ]);
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
}

export default new questionRepository();
