import MenteeModel, { IMentee } from "../MODEL/MenteeModel";
import { BaseRepository } from "./BaseRepo";
import { IMenteeRepository } from "../INTERFACE/Mentee/IMenteeRepository";


export class MenteeRepository extends BaseRepository<IMentee> implements IMenteeRepository{
    constructor(){
        super(MenteeModel)
    }


    async dbMenteeData():Promise<IMentee[]|null>{
        try {
        
            return await this.find(MenteeModel,{isAdmin:false});
        } catch (error:unknown) {
            throw new Error(`error while Checking mentee data ${error instanceof Error ? error.message:String(error)}`)
        }
    }
    async dbChangeMenteeStatus(id:string):Promise<IMentee|null> {
            try {
                return await this.find_By_Id_And_Update(MenteeModel,id ,[{$set:{"isBlocked":{$not:'$isBlocked'}}}])
            } catch (error:unknown) {
                throw new Error(`error while change mentee status in repository ${error instanceof Error? error.message:String(error)} `)
            }
        }
        async dbEditMentee(formData: Partial<IMentee>): Promise<IMentee | null> {
            try {
                return await this.find_By_Id_And_Update(MenteeModel,formData.id,{$set:{name:formData.name,email:formData.email,phone:formData.phone,bio:formData.bio}})
            } catch (error:unknown) {
                throw new Error(`error while edit mentee data in repository ${error instanceof Error? error.message:String(error)} `)
            }
        }
        async dbFindMentee(email: string): Promise<IMentee | null> {
            try {
                return await this.find_One({email})
            } catch (error:unknown) {
                throw new Error(`error find mentee data in repository ${error instanceof Error? error.message:String(error)} `)
            }
        }
        
        async dbAddMentee(formData:Partial<IMentee>):Promise<IMentee|null>{
            try {
                return await this.createDocument({
                    name:formData?.name,email:formData?.email,phone:formData?.phone,bio:formData?.bio});
            } catch (error:unknown) {
                throw new Error(`error add mentee data in repository ${error instanceof Error? error.message:String(error)} `)
            }
        }
}
export default  new MenteeRepository();