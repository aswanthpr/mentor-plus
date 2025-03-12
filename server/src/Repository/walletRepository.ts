import walletSchema, { Iwallet } from "../Model/walletModel";
import { IwalletRepository } from "../Interface/wallet/IwalletRepository";
import { baseRepository } from "./baseRepo";
import { ObjectId } from "mongoose";

class walletRepository
  extends baseRepository<Iwallet>
  implements IwalletRepository
{
  constructor() {
    super(walletSchema);
  }
  async createWallet(walletData: Partial<Iwallet>): Promise<Iwallet | null> {
    try {
      return await this.createDocument(walletData);
    } catch (error: unknown) {
      throw new Error(
        `${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  async findWallet(userId: ObjectId): Promise<Iwallet | null> {
    try {
      return await this.find_One({ userId });
    } catch (error: unknown) {
      throw new Error(
        `${error instanceof Error ? error.message : String(error)}`
      );
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
      throw new Error(
        `${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async findWalletWithTransaction(userId: ObjectId): Promise<Iwallet | null> {
    try {
      const resp = await this.aggregateData(walletSchema, [
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
        { $sort: { "transaction.createdAt": -1 } }, 
        {
          $group: {
            _id: "$_id",
            userId: { $first: "$userId" },
            balance: { $first: "$balance" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            transaction: { $push: "$transaction" }, 
          },
        },
      ]);
      return resp?.[0];
    } catch (error: unknown) {
      throw new Error(
        `${error instanceof Error ? error.message : String(error)}`
      );
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
      throw new Error(
        `${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

export default new walletRepository();
