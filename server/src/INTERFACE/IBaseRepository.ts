import { Model,Document, FilterQuery } from "mongoose";

export interface IBaseRepository<T extends Document>{
    findOne(filter:FilterQuery<T>):Promise<T |null>;
    createMentee(userData:Partial<T>):Promise<T>
}