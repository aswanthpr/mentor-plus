import mongoose , { Model,Document, FilterQuery } from "mongoose";
import { IBaseRepository } from "../INTERFACE/IBaseRepository";

export class BaseRepository <T extends Document> implements IBaseRepository<T>{
    constructor(private readonly model:Model<T>){}

    // find using email
    async find_One(filter:FilterQuery<T>):Promise<T |null> {
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

    async find_By_Id(Id:string):Promise<T |undefined|null>{
        try {
            return await this.model.findById(Id).exec()
        } catch (error:unknown) {
            console.log('error while find_By_Id ',error instanceof Error?error.message:String(error))
        }
    }
    async find_One_And_Update< T extends Document>(
        model: Model<T>,
        filter: object,
        update: object,
        options: mongoose.QueryOptions = { new: true }): Promise<T|null> {
        try {
            return await model.findOneAndUpdate(filter,update,options)
        } catch (error:unknown) {
            throw new Error(`${'\x1b[35m%s\x1b[0m'}error while creating entity:${error instanceof Error?error.message:String(error)}`);
        }
    }
}