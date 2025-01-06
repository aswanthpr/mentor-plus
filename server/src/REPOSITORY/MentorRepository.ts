import { BaseRepository } from "./BaseRepo";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import mentorModel, { IMentor } from "../MODEL/mentorModel";
import { IMentorApplication } from "../TYPES";
import mongoose from "mongoose";

class mentorRepository
  extends BaseRepository<IMentor>
  implements IMentorRepository {
  constructor() {
    super(mentorModel);
  }
  async dbFindMentor(email?: string, phone?: string): Promise<IMentor | null> {
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
        `error while finding mentor ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async dbCreateMentor(
    mentorData: IMentorApplication,
    imageUrl: string,
    fileUrl: string
  ): Promise<IMentor | undefined> {
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
        `error while creating mentor ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //finding all mentors
  async dbFindAllMentor(): Promise<IMentor[] | null> {
    try {
      return await this.find(mentorModel, {});
    } catch (error: unknown) {
      throw new Error(
        `error while finding mentor data from data base${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //changing mentor status
  async dbVerifyMentor(id: mongoose.Types.ObjectId): Promise<IMentor | null> {
    try {
      return await this.find_By_Id_And_Update(mentorModel, id, [
        { $set: { verified: { $not: "$verified" } } },
      ]);
    } catch (error: unknown) {
      throw new Error(
        `error while verify mentor data from data base${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //changing mentor status;
  async dbChangeMentorStatus(
    id: mongoose.Types.ObjectId
  ): Promise<IMentor | null> {
    try {
      return await this.find_By_Id_And_Update(mentorModel, id, [
        { $set: { isBlocked: { $not: "$isBlocked" } } },
      ]);
    } catch (error: unknown) {
      throw new Error(
        `error while changing mentor status from data base${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async dbFindMentorAndUpdate(
    email: string,
    password: string
  ): Promise<IMentor | null> {
    try {
      return await this.find_One_And_Update(
        mentorModel,
        { email },
        { $set: { password: password } }
      );
    } catch (error: unknown) {
      throw new Error(
        `error while changing mentor password from data base${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //finding mentor by his id
  async dbFindMentorById(mentorId: string): Promise<IMentor | null> {
    try {
      return await this.find_By_Id(mentorId, { isBlocked: false });
    } catch (error: unknown) {
      throw new Error(
        `error while changing mentor password from data base${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //change password by id and new password
  async dbChangeMentorPassword(
    mentorId: string,
    password: string
  ): Promise<IMentor | null> {
    try {
      return await this.find_By_Id_And_Update(mentorModel, mentorId, {
        $set: { password: password },
      });
    } catch (error: unknown) {
      throw new Error(
        `Error while change mentro password${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async dbChangeMentorProfileImage(
    profileUrl: string,
    id: string
  ): Promise<Partial<IMentor> | null> {
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
        `Error while change mentro password${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async dbUpdateMentorById(
    mentorData: Partial<IMentor>
  ): Promise<IMentor | undefined | null> {
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
        `Error while finding mentor by id and updatae${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async categoryWithSkills(): Promise<
    IMentor[] | undefined> {
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
            skills: 1
          }
        }
      ];
      return await this.aggregateData(mentorModel, aggregationPipeline)
    } catch (error: unknown) { 
      throw new Error(
        `Error while finding category with skills ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export default new mentorRepository();
