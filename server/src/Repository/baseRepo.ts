import mongoose, {
  Model, 
  Document,
  FilterQuery,
  UpdateQuery,
  PipelineStage,
  DeleteResult,
  // InsertManyOptions,
} from "mongoose";
import { IbaseRepository } from "../Interface/Base/iBaseRepository";

export class baseRepository<T extends Document> implements IbaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  // find using email
  async find_One(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter).exec();
    } catch (error: unknown) {
      throw new Error(
        `Error while finding entity: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // new mentee create
  async createDocument(docData: Partial<T>): Promise<T> {
    try {
      const entity = new this.model(docData);
      return await entity.save();
    } catch (error: unknown) {
      throw new Error(
        `Error while creating document: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async find_By_Id(Id: string, filter?: object): Promise<T | null> {
    try {
      return await this.model.findById(Id, filter).exec();
    } catch (error: unknown) {
      console.log(
        `Error while finding by ID: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return null; // Return null if there's an error
    }
  }

  async find_One_And_Update<T extends Document>(
    model: Model<T>,
    filter: object,
    update: object,
    options: mongoose.QueryOptions = { new: true }
  ): Promise<T | null> {
    try {
      return await model.findOneAndUpdate(filter, update, options).exec();
    } catch (error: unknown) {
      throw new Error(
        `${"\x1b[35m%s\x1b[0m"} Error while updating entity: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async find<T extends Document>(
    model: Model<T>,
    filter: object,
    options: mongoose.QueryOptions = {}
  ): Promise<T[]> {
    try {
      return await model.find(filter, null, options).exec();
    } catch (error: unknown) {
      throw new Error(
        `Error while finding entities: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async find_By_Id_And_Update<T extends Document>(
    model: Model<T>,
    id: string | mongoose.Types.ObjectId,
    updateData: UpdateQuery<T>,
    options: mongoose.QueryOptions = { new: true },
    populate?:
      | string
      | mongoose.PopulateOptions
      | (string | mongoose.PopulateOptions)[]
  ): Promise<T | null> {
    try {
      const query = model.findByIdAndUpdate(id, updateData, {
        new: true,
        ...options,
      });
      if (populate) {
        if (typeof populate === "string") {
          query.populate({ path: populate });
        } else {
          query.populate(populate);
        }
      }
      return await query.exec();
    } catch (error: unknown) {
      throw new Error(
        `Error while finding entities: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // aggregation pipine resuable code
  async aggregateData<T extends Document>(
    model: Model<T>,
    aggregationPipeline: PipelineStage[]
  ): Promise<T[]> {
    try {
      // Execute the aggregation pipeline
      return await model.aggregate(aggregationPipeline).exec();
    } catch (error: unknown) {
      throw new Error(
        `Error while aggregating entities: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async deleteDocument(
    Id: string): Promise<DeleteResult| undefined> {
    try {
      return await this.model.deleteOne({ _id: Id }).exec();
  
    } catch (error: unknown) {
      console.error(
        `Error while deleting document: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async deleteMany(filter: FilterQuery<T>): Promise<DeleteResult| undefined> {
    try {
      return await this.model.deleteMany(filter).exec();
  
    } catch (error: unknown) {
      console.error(
        `Error while deleting document: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async  insert_Many<T extends Document>(
    model: Model<T>,
    documents: T[],
    // options?:InsertManyOptions 
  ): Promise<T[]> {
    try {
      return await model.insertMany(documents);
    } catch (error: unknown) {
      throw new Error(
        `Error while inserting entities: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
