import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import categorySchema, { Icategory } from "../Model/categorySchema";
import { baseRepository } from "./baseRepo";

 class categoryRespository extends baseRepository<Icategory> implements IcategoryRepository{
    constructor(){
        super(categorySchema)
    }

    async findCategory(category: string): Promise<Icategory | null> {
        try {
            return await  this.find_One({category});

        } catch (error:unknown) {
            throw new Error (`error while find category in repository ${error instanceof Error?error.message : String(error)}`);
        }
    }
    async createCategory(category:string):Promise<Icategory|null>{
        try {
            return await this.createDocument({category})
        } catch (error:unknown) {
          throw new Error(`error while create category in repository ${error instanceof Error? error.message:String(error)} `)  
        } 
    }

    async categoryData(): Promise<Icategory[]> {
        try {
            return await this.find(categorySchema,{});

        } catch (error:unknown) {
            throw new Error(`error while getting category Data in repository ${error instanceof Error? error.message:String(error)} `)  
        }
    }

    //editing category;
    async editCategory(id:string,category: string):Promise<Icategory|null>{
        try {
            return await this.find_By_Id_And_Update(categorySchema,id,{$set:{category:category}})
        } catch (error:unknown) {
            throw new Error(`error while editing category  in repository ${error instanceof Error? error.message:String(error)} `)  
        }
    }

    async changeCategoryStatus(id:string): Promise<Icategory | null> {
        try {
            return await this.find_By_Id_And_Update(categorySchema,id ,[{$set:{"isBlocked":{$not:'$isBlocked'}}}])
        } catch (error:unknown) {
            throw new Error(`error while change category status in repository ${error instanceof Error? error.message:String(error)} `)
        }
    }

    
} 
export default new categoryRespository();