import { UpdateWriteOpResult } from "mongoose";
import menteeModel, { Imentee } from "../Model/menteeModel";
import { baseRepository } from "./baseRepo";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";


export class menteeRepository
  extends baseRepository<Imentee>
  implements ImenteeRepository {
  constructor() {
    super(menteeModel);
  }

  async menteeData(): Promise<Imentee[] | null> {
    try {
      return await this.find(menteeModel, { isAdmin: false });
    } catch (error: unknown) {
      throw new Error(
        `error while Checking mentee data ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async changeMenteeStatus(id: string): Promise<Imentee | null> {
    try {
      return await this.find_By_Id_And_Update(menteeModel, id, [
        { $set: { isBlocked: { $not: "$isBlocked" } } },
      ]);
    } catch (error: unknown) {
      throw new Error(
        `error while change mentee status in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
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
      throw new Error(
        `error while edit mentee data in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }
  async findMentee(email: string): Promise<Imentee | null> {
    try {
      return await this.find_One({ email });
    } catch (error: unknown) {
      throw new Error(
        `error find mentee data in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
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
      throw new Error(
        `error add mentee data in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
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
      throw new Error(
        `error google add mentee data in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }

  async findById(id: string): Promise<Imentee | null> {
    try {
      return await this.find_By_Id(id, { isBlocked: false });
    } catch (error: unknown) {
      throw new Error(
        `error fetch metnee data by id  in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
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
      throw new Error(
        `error fetch metnee password change by id  in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }
  async profileChange(image: string, id: string): Promise<Imentee | null> {
    try {
      return await this.find_By_Id_And_Update(menteeModel, id, {
        $set: { profileUrl: image },
      });
    } catch (error: unknown) {
      throw new Error(
        `error fetch metnee password change by id  in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }

  async updateMentee(email: string): Promise<UpdateWriteOpResult|null> {
    try {
      const data = await menteeModel.updateOne({ email }, { $set: { verified: true } });
      console.log(data, 'verify data from repo')
      return data
    } catch (error: unknown) {
      throw new Error(`error while updating mentee${error instanceof Error ? error.message : String(error)}`)
    }
  }
  async findByEmail(email: string): Promise<Imentee | null> {
    try {

      return await this.find_One({ email })//find one in base repo
    } catch (error: unknown) {
      console.log('Error while finding user with email', email, error);
      throw new Error(`Error while finding user by Email${error instanceof Error ? error.message : String(error)}`)
    }
  }
  async create_Mentee(userData: Imentee): Promise<Imentee> {
    try {
      return await this.createDocument(userData);
    } catch (error: unknown) {
      console.log(`error while doing signup ${error}`);
      throw new Error(`error while mentee Signup${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async mainLogin(email: string): Promise<Imentee | null> {
    try {

      return await this.find_One({ email });
    } catch (error: unknown) {
      throw new Error(`error  in DBMainLogin  while Checking User ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  async forgot_PasswordChange(email: string, password: string): Promise<Imentee | null | undefined> {
    try {
      return await this.find_One_And_Update(menteeModel, { email: email }, { $set: { password: password } });
    } catch (error: unknown) {
      console.log(`error while find and update on DBforget_passwordChange ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  //admin data fetch
  async adminLogin(email: string): Promise<Imentee | null> {
    try {
      return await this.find_One({ email })
    } catch (error: unknown) {
      console.log(`error while finding admin ${error instanceof Error ? error.message : String(error)}`)
      return null;
    }
  }
  async _find():Promise<Imentee|null>{
    try {
      return this.find_One({isAdmin:true});
    } catch (error:unknown) {
      throw new Error(`${error instanceof Error ? error.message:String(error)}`)
    }
  }
}

export default new menteeRepository();
