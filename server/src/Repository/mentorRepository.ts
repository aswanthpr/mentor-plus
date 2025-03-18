import { baseRepository } from "./baseRepo";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import mentorModel, { Imentor } from "../Model/mentorModel";

import mongoose, { PipelineStage } from "mongoose";
import { ImentorApplication } from "src/Types";

class mentorRepository
  extends baseRepository<Imentor>
  implements ImentorRepository
{
  constructor() {
    super(mentorModel);
  }
  async findMentor(email?: string, phone?: string): Promise<Imentor | null> {
    try {
      const query: { [key: string]: string }[] = [];
      if (email) query.push({ email });
      if (phone) query.push({ phone });

      if (query.length === 0) {
        throw new Error("At least one of email or phone must be provided");
      }

      return await this.find_One({ $or: query });
    } catch (error: unknown) {
      throw new Error(
        `error while finding mentor ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async createMentor(
    mentorData: ImentorApplication,
    imageUrl: string,
    fileUrl: string
  ): Promise<Imentor | undefined> {
    try {
      return await this.createDocument({
        name: mentorData.name,
        email: mentorData.email,
        phone: mentorData.phone,
        password: mentorData.password,
        bio: mentorData.bio,
        jobTitle: mentorData.jobTitle,
        category: mentorData.category,
        linkedinUrl: mentorData.linkedinUrl,
        githubUrl: mentorData.githubUrl,
        skills: mentorData.skills,
        resume: fileUrl,
        profileUrl: imageUrl,
      });
    } catch (error: unknown) {
      throw new Error(
        `error while creating mentor ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //finding all mentors
  async findAllMentor(
    skip:number,
        limit:number,
        activeTab:string,
        search:string,
        sortField:string,
        sortOrder:string,
  ): Promise<{mentors:Imentor[] | [],totalDoc:number}> {
    try {
     
      const sortOptions = sortOrder === "asc"?1:-1;

      const pipeline:PipelineStage[] =[];

      if(search){
        pipeline.push({
          $match:{
            $or:[
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { jobTitle: { $regex: search, $options: "i" } },
              { bio: { $regex: search, $options: "i" } },
              { category: { $regex: search, $options: "i" } },
              { skills: {$elemMatch:{ $regex: search, $options: "i" } }},
            ],

          }
        })
      };
        pipeline.push({
          $match:{
            verified:activeTab==="verified",
          }
        })
      if(sortField==="createdAt"){
        pipeline.push({
          $sort:{
            createdAt:sortOptions
          }
        })
      }
      pipeline.push({
        $skip: skip,
      });

      pipeline.push({
        $limit:limit,
      });
      const countPipeline =[
        ...pipeline.slice(0,pipeline?.length-2),
        {
          $count: "totalDocuments",
        },
      ]
      const [mentors,totalDocuments]=await Promise.all([
        this.aggregateData(mentorModel,pipeline),
        mentorModel.aggregate(countPipeline)
      ])
     
      return {mentors,totalDoc:totalDocuments[0]?.totalDocuments}
    } catch (error: unknown) {
      throw new Error(
        `error while finding mentor data from data base${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async findVerifiedMentor(
    aggregateData: PipelineStage[]
  ): Promise<{ mentor: Imentor[] | null; count: number }> {
    try {
      const matchStage =
        aggregateData?.find((stage) => "$match" in stage)?.["$match"] || {};

      const [mentor, count] = await Promise.all([
        this.aggregateData(mentorModel, aggregateData), 
        this.countDocument(matchStage),
      ]);
      return { mentor, count };
    } catch (error: unknown) {
      throw new Error(
        `error while finding mentor data from data base${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //changing mentor status
  async verifyMentor(id: mongoose.Types.ObjectId): Promise<Imentor | null> {
    try {
      return await this.find_By_Id_And_Update(mentorModel, id, [
        { $set: { verified: { $not: "$verified" } } },
      ]);
    } catch (error: unknown) {
      throw new Error(
        `error while verify mentor data from data base${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //changing mentor status;
  async changeMentorStatus(
    id: mongoose.Types.ObjectId
  ): Promise<Imentor | null> {
    try {
      return await this.find_By_Id_And_Update(mentorModel, id, [
        { $set: { isBlocked: { $not: "$isBlocked" } } },
      ]);
    } catch (error: unknown) {
      throw new Error(
        `error while changing mentor status from data base${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async findMentorAndUpdate(
    email: string,
    password: string
  ): Promise<Imentor | null> {
    try {
      return await this.find_One_And_Update(
        mentorModel,
        { email },
        { $set: { password: password } }
      );
    } catch (error: unknown) {
      throw new Error(
        `error while changing mentor password from data base${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //finding mentor by his id
  async findMentorById(mentorId: string): Promise<Imentor | null> {
    try {
      return await this.find_By_Id(mentorId, { isBlocked: false });
    } catch (error: unknown) {
      throw new Error(
        `error while changing mentor password from data base${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //change password by id and new password
  async changeMentorPassword(
    mentorId: string,
    password: string
  ): Promise<Imentor | null> {
    try {
      return await this.find_By_Id_And_Update(mentorModel, mentorId, {
        $set: { password: password },
      });
    } catch (error: unknown) {
      throw new Error(
        `Error while change mentro password${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async changeMentorProfileImage(
    profileUrl: string,
    id: string
  ): Promise<Partial<Imentor> | null> {
    try {
      return (
        (await this.find_By_Id_And_Update(
          mentorModel,
          id,
          { $set: { profileUrl: profileUrl } },
          { new: true, fields: { profileUrl: 1 } }
        )) ?? null
      );
    } catch (error: unknown) {
      throw new Error(
        `Error while change mentro password${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async updateMentorById(
    mentorData: Partial<Imentor>
  ): Promise<Imentor | undefined | null> {
    try {
      const updateFields = {
        name: mentorData?.name,
        phone: mentorData?.phone,
        email: mentorData?.email,
        category: mentorData?.category,
        jobTitle: mentorData?.jobTitle,
        githubUrl: mentorData?.githubUrl,
        linkedinUrl: mentorData?.linkedinUrl,
        bio: mentorData?.bio,
        resume: mentorData?.resume,
        skills: mentorData.skills,
      };

      return await this.find_By_Id_And_Update(
        mentorModel,
        `${mentorData?._id}`,
        {
          $set: updateFields,
        }
      );
    } catch (error: unknown) {
      throw new Error(
        `Error while finding mentor by id and updatae${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async categoryWithSkills(): Promise<Imentor[] | undefined> {
    try {
      const aggregationPipeline = [
        {
          $unwind: "$skills",
        },
        {
          $group: {
            _id: "null",
            skills: {
              $addToSet: "$skills",
            },
          },
        },
        {
          $project: {
            _id: 0,
            skills: 1,
          },
        },
      ];
      return await this.aggregateData(mentorModel, aggregationPipeline);
    } catch (error: unknown) {
      throw new Error(
        `Error while finding category with skills ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async findMentorsByCategory(
    category: string,
    mentorId: string
  ): Promise<Imentor[] | []> {
    try {
      return this.aggregateData(mentorModel, [
        {
          $match: {
            category: category,
            _id: { $ne: new mongoose.Types.ObjectId(mentorId) },
          },
        },
        // {
        //   // Randomly sample 10 mentors
        //   $sample: { size: 10 }
        // }
      ]);
    } catch (error: unknown) {
      throw new Error(
        `Error while finding  mentors by category  ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export default new mentorRepository();
