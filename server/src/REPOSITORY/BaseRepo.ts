import mongoose , { Model,Document, FilterQuery,QueryOptions,UpdateQuery } from "mongoose";
import { IBaseRepository } from "../INTERFACE/Base/IBaseRepository";

export class BaseRepository <T extends Document> implements IBaseRepository<T>{

    constructor(private readonly model:Model<T>){}

    // find using email
    async find_One(filter:FilterQuery<T>):Promise<T | null> {
        try {
               return await this.model.findOne(filter).exec();

        } catch (error:unknown) {
            throw new Error(`Error while finding entity: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // new mentee create
    async createDocument(docData: Partial<T>): Promise<T> {
        try {
          const entity = new this.model(docData);
          return await entity.save();
        } catch (error: unknown) {
          throw new Error(`Error while creating document: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      

      async find_By_Id(Id: string, filter?: object,): Promise<T | null> {
        try {
          return await this.model.findById(Id,filter).exec();
        } catch (error: unknown) {
          console.log(`Error while finding by ID: ${error instanceof Error ? error.message : String(error)}`);
          return null; // Return null if there's an error
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
            throw new Error(`${'\x1b[35m%s\x1b[0m'} Error while updating entity: ${error instanceof Error ? error.message : String(error)}`)
           
        }
    }
    async find<T extends Document>(
        model:Model<T>,
        filter:object,
        options:mongoose.QueryOptions ={},

    ):Promise<T[]>{
        try {
            return await model.find(filter,null,options)
        } catch (error:unknown) {
            throw new Error(`Error while finding entities: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async find_By_Id_And_Update<T extends Document>(
      
        model: Model<T>,          
        id: string|mongoose.Types.ObjectId,               
        updateData: UpdateQuery<T>, 
        options: mongoose.QueryOptions = {}
    ):Promise<T|null>{
      try {
        return await model.findByIdAndUpdate(id,updateData,{new:true,...options})
      } catch (error:unknown) {
        throw new Error(`Error while finding entities: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
}


