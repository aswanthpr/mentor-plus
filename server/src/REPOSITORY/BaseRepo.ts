import { Model,Document, FilterQuery } from "mongoose";
import { IBaseRepository } from "../INTERFACE/IBaseRepository";

export class BaseRepository <T extends Document> implements IBaseRepository<T>{
    constructor(private readonly model:Model<T>){}

    // find using email
    async findOne(filter:FilterQuery<T>):Promise<T |null> {
        try {
               return await this.model.findOne(filter).exec();

        } catch (error:unknown) {
            throw new Error(`error while finding ${error instanceof Error? error.message : String(error)} `);
        }
    }
    // new mentee create
    async createMentee(userData: Partial<T>): Promise<T> {
        try {
            const entity = new this.model(userData);
            return await entity.save();
        } catch (error:unknown) {
            
            throw new Error(`${'\x1b[35m%s\x1b[0m'}error while creating entity:${error instanceof Error?error.message:String(error)}`);

        }
    }
}