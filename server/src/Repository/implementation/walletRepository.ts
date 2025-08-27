import  {walletSchema, Iwallet } from "../../Model/index";
import { IwalletRepository } from "../interface/IwalletRepository";
import { baseRepository } from "../baseRepo";
import { ObjectId, PipelineStage } from "mongoose";
import { HttpError } from "../../Utils/index";
import { Status } from "../../Constants/httpStatusCode";

class walletRepository
  extends baseRepository<Iwallet>
  implements IwalletRepository {
  constructor() {
    super(walletSchema);
  }
  async createWallet(walletData: Partial<Iwallet>): Promise<Iwallet | null> {
    try {
      return await this.createDocument(walletData);
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async findWallet(userId: ObjectId): Promise<Iwallet | null> {
    try {
      return await this.find_One({ userId });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  //update wallet data
  async updateWalletAmount(
    userId: ObjectId,
    amount: number
  ): Promise<Iwallet | null> {
    try {
      return await this.find_One_And_Update(
        walletSchema,
        { userId },
        {
          $inc: { balance: amount },
        }
      );
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async findWalletWithTransaction(
    userId: ObjectId,
    skip: number,
    limit: number,
    search: string,
    filter: string
  ): Promise<{ transaction: Iwallet | null, totalDocs: number }> {
    try {
      const pipeline: PipelineStage[] = [

        {
          $match: {
            userId,
          },
        },
        {
          $lookup: {
            from: "transactions",
            localField: "_id",
            foreignField: "walletId",
            as: "transaction",
          },
        },
        {
          $unwind: {
            path: "$transaction",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]
      if (filter != "all") {
        pipeline.push({
          $match: {
            "transaction.transactionType": { $eq: filter },
          }
        });
      }
      if (search) {
        const searchNumber = Number(search);

        pipeline.push({
          $match: {
            $or: [
              { "transaction.note": { $regex: search, $options: "i" } },
              { "transaction.transactionType": { $regex: search, $options: "i" } },
              ...(isNaN(searchNumber)
                ? []
                : [{ ["transaction.amount"]: searchNumber }]),
            ],
          },
        });
      }
      pipeline.push({ $sort: { "transaction.createdAt": -1 } });

      pipeline.push({
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          balance: { $first: "$balance" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          transaction: { $push: "$transaction" },
        },
      });

      pipeline.push({
        $project: {
          _id: 1,
          userId: 1,
          balance: 1,
          createdAt: 1,
          updatedAt: 1,
          transaction: {
            $slice: ["$transaction", skip, limit]
          }
        }
      });
      const countPipeline = [
        ...pipeline.slice(0, -2),
        {
          $count: "totalDocuments",
        },
      ];

      const [data, count] = await Promise.all([
        this.aggregateData(walletSchema, pipeline),
        walletSchema.aggregate(countPipeline),
      ]);

      return {
        transaction: data?.[0] || null,
        totalDocs: count?.[0]?.totalDocuments || 0,
      };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async deductAmountFromWallet(
    amount: number,
    userId: ObjectId
  ): Promise<Iwallet | null> {
    try {
      return await this.find_One_And_Update(
        walletSchema,
        {
          userId,
          balance: { $gte: amount },
        },
        {
          $inc: { balance: -amount },
        },
        { new: true }
      );
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}

export default new walletRepository();
