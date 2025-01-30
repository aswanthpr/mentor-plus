import mongoose, {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  PipelineStage,
  DeleteResult,
  // InsertManyOptions,
} from "mongoose";

export interface IbaseRepository<T extends Document> {
  find_One(filter: FilterQuery<T>): Promise<T | null>;
  createDocument(docData: Partial<T>): Promise<T>;
  find_By_Id(Id: string): Promise<T | null>;

  find_One_And_Update(
    model: Model<T>,
    filter: object,
    update: object,
    options: mongoose.QueryOptions
  ): Promise<T | null>;

  find<T extends Document>(
    modal: Model<T>,
    filter: object,
    options: mongoose.QueryOptions
  ): Promise<T[]>;

  find_By_Id_And_Update<T extends Document>(
    model: Model<T>,
    id: string,
    updateData: UpdateQuery<T>,
    options: mongoose.QueryOptions
  ): Promise<T | null>;

  aggregateData<T extends Document>(
    model: Model<T>,
    aggregationPipeline: PipelineStage[]
  ): Promise<T[]>;

  deleteDocument( Id: string): Promise<DeleteResult | undefined> ;
  insert_Many<T extends Document>(
      model: Model<T>,
      documents: T[],
      // options?:InsertManyOptions
    ): Promise<T[]> 
}
