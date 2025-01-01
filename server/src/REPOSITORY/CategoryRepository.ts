import { ICategoryRepository } from "../INTERFACE/Category/ICategoryRepository";
import categorySchema, { ICategory } from "../MODEL/categorySchema";
import { BaseRepository } from "./BaseRepo";

 class CategoryRespository extends BaseRepository<ICategory> implements ICategoryRepository{
    constructor(){
        super(categorySchema)
    }

    async dbFindCategory(category: string): Promise<ICategory | null> {
        try {
            return await  this.find_One({category});

        } catch (error:unknown) {
            throw new Error (`error while find category in repository ${error instanceof Error?error.message : String(error)}`);
        }
    }
    async dbCreateCategory(category:string):Promise<ICategory|null>{
        try {
            return await this.createDocument({category})
        } catch (error:unknown) {
          throw new Error(`error while create category in repository ${error instanceof Error? error.message:String(error)} `)  
        } 
    }

    async dbcategoryData(): Promise<ICategory[]> {
        try {
            return await this.find(categorySchema,{isBlocked:false});

        } catch (error:unknown) {
            throw new Error(`error while getting category Data in repository ${error instanceof Error? error.message:String(error)} `)  
        }
    }

    //editing category;
    async dbEditCategory(id:string,category: string):Promise<ICategory|null>{
        try {
            return await this.find_By_Id_And_Update(categorySchema,id,{$set:{category:category}})
        } catch (error:unknown) {
            throw new Error(`error while editing category  in repository ${error instanceof Error? error.message:String(error)} `)  
        }
    }

    async dbChangeCategoryStatus(id:string): Promise<ICategory | null> {
        try {
            return await this.find_By_Id_And_Update(categorySchema,id ,[{$set:{"isBlocked":{$not:'$isBlocked'}}}])
        } catch (error:unknown) {
            throw new Error(`error while change category status in repository ${error instanceof Error? error.message:String(error)} `)
        }
    }

    
} 
export default new CategoryRespository();