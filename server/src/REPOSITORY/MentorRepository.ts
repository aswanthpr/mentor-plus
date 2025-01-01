import { BaseRepository } from "./BaseRepo";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import mentorModel, { IMentor } from "../MODEL/mentorModel";
import { IMentorApplication } from "../TYPES";
import mongoose from "mongoose";

class mentorRepository extends BaseRepository<IMentor> implements IMentorRepository {
    constructor() {
        super(mentorModel);
    }
    async dbFindMentor(email?:string,phone?:string):Promise<IMentor|null>{
        try {
            const query: { [key: string]: string }[] = [];
            if (email) query.push({ email });
        if (phone) query.push({ phone });

        if (query.length === 0) {
            throw new Error('At least one of email or phone must be provided');
        }

        return await this.find_One({ $or: query });
        } catch (error:unknown) {
            throw new Error(`error while finding mentor ${error instanceof Error ? error.message : String(error)}`)
        }
    }
    async dbCreateMentor(mentorData: IMentorApplication, imageUrl: string, fileUrl: string): Promise<IMentor|undefined> {
        try {
          return  await this.createDocument({
                name:     mentorData.name,
                email:    mentorData.email,
                phone:    mentorData.phone,
                password: mentorData.password,
                bio      :mentorData.bio,
                jobTitle: mentorData.jobTitle,
                category: mentorData.category,
                linkedinUrl:mentorData.linkedinUrl,
                githubUrl:mentorData.githubUrl,
                skills:mentorData.skills,
                resume:   fileUrl,
                profileUrl:imageUrl,
            })
          
        } catch (error: unknown) {
            throw new Error(`error while creating mentor ${error instanceof Error ? error.message : String(error)}`)
        }
    }
    //finding all mentors
    async dbFindAllMentor(): Promise<IMentor[] | null> {
        try {
        return await this.find(mentorModel,{isBlocked:false});

        } catch (error:unknown) {

            throw new Error(`error while finding mentor data from data base${error instanceof Error ? error.message:String(error)}`);

        }
    }
    //changing mentor status
    async dbVerifyMentor(id: mongoose.Types.ObjectId):Promise<IMentor|null>{
        try {
            return await this.find_By_Id_And_Update(mentorModel,id,[{$set:{'verified':{$not:'$verified'}}}])
        } catch (error:unknown) {
            throw new Error(`error while verify mentor data from data base${error instanceof Error ? error.message:String(error)}`);
        }
    }
    //changing mentor status;
    async dbChangeMentorStatus(id: mongoose.Types.ObjectId): Promise<IMentor | null> {
        try {
            return await this.find_By_Id_And_Update(mentorModel,id,[{$set:{"isBlocked":{$not:"$isBlocked"}}}])
        } catch (error:unknown) {
            throw new Error(`error while changing mentor status from data base${error instanceof Error ? error.message:String(error)}`);
        }
    }
    async dbFindMentorAndUpdate(email:string,password:string):Promise<IMentor|null>{
        try {
            return await this.find_One_And_Update(mentorModel,{email},{$set:{password:password}})
        } catch (error:unknown) {
            throw new Error(`error while changing mentor password from data base${error instanceof Error ? error.message:String(error)}`);
        }
    }

    async dbMentorProfile(mentorId: string): Promise<IMentor | null> {
        try {
            return await this.find_By_Id(mentorId,{isBlocked:false})
        } catch (error:unknown) {
            throw new Error(`error while changing mentor password from data base${error instanceof Error ? error.message:String(error)}`);
        }
    }
}

export default new mentorRepository();