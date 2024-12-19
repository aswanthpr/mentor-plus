import mongoose,{ Model,Document, FilterQuery } from "mongoose";

export interface IBaseRepository<T extends Document>{
    find_One(filter:FilterQuery<T>):Promise<T |null>;
    createMentee(userData:Partial<T>):Promise<T>
    find_By_Id(Id:string):Promise<T|undefined|null>

    find_One_And_Update(model: Model<T>,
        filter: object,
        update: object,
        options: mongoose.QueryOptions
    ):Promise<T|null>
}