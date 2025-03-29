import { PipelineStage, UpdateWriteOpResult } from "mongoose";
import menteeModel, { Imentee } from "../Model/menteeModel";
import { baseRepository } from "./baseRepo";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
import { HttpError } from "../Utils/http-error-handler.util";
import { Status } from "../Constants/httpStatusCode";


export class menteeRepository
  extends baseRepository<Imentee>
  implements ImenteeRepository {
  constructor() {
    super(menteeModel);
  }
async menteeData(skip: number, limit: number, search: string, sortOrder: string, sortField: string,statusFilter:string): Promise<{ mentees: Imentee[] | []; totalDoc: number; }> {
  try {
    const pipeline: PipelineStage[] = [
      { $match: { isAdmin: false } },
    ];

    // Search
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Status Filter
    if (statusFilter !== "all") {
      pipeline.push({
        $match: { isBlocked: statusFilter === "blocked" },
      });
    }

    // Sorting
    if (sortField === "createdAt") {
      pipeline.push({ $sort: { createdAt: sortOrder === "asc" ? 1 : -1 } });
    }

    // Pagination
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Count Pipeline
    const countPipeline = [
      ...JSON.parse(JSON.stringify(pipeline)).slice(0, -2),
      { $count: "totalDocuments" },
    ];

    // Execute Aggregations
    const [mentees, totalCount] = await Promise.all([
      this.aggregateData(menteeModel, pipeline),
      menteeModel.aggregate(countPipeline),
    ]);

    return {
      mentees,
      totalDoc: totalCount?.[0]?.totalDocuments || 0,
    };
  } catch (error:unknown) {
     throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
        }
  
}
  async changeMenteeStatus(id: string): Promise<Imentee | null> {
    try {
      return await this.find_By_Id_And_Update(menteeModel, id, [
        { $set: { isBlocked: { $not: "$isBlocked" } } },
      ]);
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async editMentee(formData: Partial<Imentee>): Promise<Imentee | null> {
    try {
      return await this.find_By_Id_And_Update(
        menteeModel,
        formData?._id as string,
        {
          $set: {
            name: formData?.name,
            email: formData?.email,
            phone: formData?.phone,
            bio: formData?.bio,
            education: formData?.education,
            currentPosition: formData?.currentPosition,
            linkedinUrl: formData?.linkedinUrl,
            githubUrl: formData?.githubUrl,
          },
        }
      );
    } catch (error: unknown) {
       throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async findMentee(email: string): Promise<Imentee | null> {
    try {
      return await this.find_One({ email });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async addMentee(formData: Partial<Imentee>): Promise<Imentee | null> {
    try {
      return await this.createDocument({
        name: formData?.name,
        email: formData?.email,
        phone: formData?.phone,
        bio: formData?.bio,
      });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async googleAddMentee(formData: Partial<Imentee>): Promise<Imentee | null> {
    try {
      return await this.createDocument({
        name: formData?.name,
        email: formData?.email,
        profileUrl: formData?.profileUrl,
        verified: formData?.verified,
      });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async findById(id: string): Promise<Imentee | null> {
    try {
      return await this.find_By_Id(id, { isBlocked: false });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async changePassword(
    id: string,
    password: string
  ): Promise<Imentee | null> {
    try {
      return await this.find_By_Id_And_Update(menteeModel, id, {
        $set: { password: password },
      });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async profileChange(image: string, id: string): Promise<Imentee | null> {
    try {
      return await this.find_By_Id_And_Update(menteeModel, id, {
        $set: { profileUrl: image },
      });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async updateMentee(email: string): Promise<UpdateWriteOpResult|null> {
    try {
      const data = await menteeModel.updateOne({ email }, { $set: { verified: true } });
    
      return data
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async findByEmail(email: string): Promise<Imentee | null> {
    try {

      return await this.find_One({ email })//find one in base repo
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async create_Mentee(userData: Imentee): Promise<Imentee> {
    try {
      return await this.createDocument(userData);
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async mainLogin(email: string): Promise<Imentee | null> {
    try {

      return await this.find_One({ email });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async forgot_PasswordChange(email: string, password: string): Promise<Imentee | null | undefined> {
    try {
      return await this.find_One_And_Update(menteeModel, { email: email }, { $set: { password: password } });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //admin data fetch
  async adminLogin(email: string): Promise<Imentee | null> {
    try {
      return await this.find_One({ email })
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async _find():Promise<Imentee|null>{
    try {
      return this.find_One({isAdmin:true});
    } catch (error:unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}

export default new menteeRepository();
