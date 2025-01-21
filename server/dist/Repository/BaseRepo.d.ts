import mongoose, { Model, Document, FilterQuery, UpdateQuery, PipelineStage } from "mongoose";
import { IBaseRepository } from "../Interface/Base/IBaseRepository";
export declare class BaseRepository<T extends Document> implements IBaseRepository<T> {
    private readonly model;
    constructor(model: Model<T>);
    find_One(filter: FilterQuery<T>): Promise<T | null>;
    createDocument(docData: Partial<T>): Promise<T>;
    find_By_Id(Id: string, filter?: object): Promise<T | null>;
    find_One_And_Update<T extends Document>(model: Model<T>, filter: object, update: object, options?: mongoose.QueryOptions): Promise<T | null>;
    find<T extends Document>(model: Model<T>, filter: object, options?: mongoose.QueryOptions): Promise<T[]>;
    find_By_Id_And_Update<T extends Document>(model: Model<T>, id: string | mongoose.Types.ObjectId, updateData: UpdateQuery<T>, options?: mongoose.QueryOptions): Promise<T | null>;
    aggregateData<T extends Document>(model: Model<T>, aggregationPipeline: PipelineStage[]): Promise<T[]>;
}
//# sourceMappingURL=BaseRepo.d.ts.map