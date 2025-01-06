import MenteeModel, { IMentee } from "../MODEL/MenteeModel";
import { BaseRepository } from "./BaseRepo";
import { IMenteeRepository } from "../INTERFACE/Mentee/IMenteeRepository";


export class MenteeRepository
  extends BaseRepository<IMentee>
  implements IMenteeRepository {
  constructor() {
    super(MenteeModel);
  }

  async dbMenteeData(): Promise<IMentee[] | null> {
    try {
      return await this.find(MenteeModel, { isAdmin: false });
    } catch (error: unknown) {
      throw new Error(
        `error while Checking mentee data ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async dbChangeMenteeStatus(id: string): Promise<IMentee | null> {
    try {
      return await this.find_By_Id_And_Update(MenteeModel, id, [
        { $set: { isBlocked: { $not: "$isBlocked" } } },
      ]);
    } catch (error: unknown) {
      throw new Error(
        `error while change mentee status in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }
  async dbEditMentee(formData: Partial<IMentee>): Promise<IMentee | null> {
    try {
      return await this.find_By_Id_And_Update(
        MenteeModel,
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
  async dbFindMentee(email: string): Promise<IMentee | null> {
    try {
      return await this.find_One({ email });
    } catch (error: unknown) {
      throw new Error(
        `error find mentee data in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }

  async dbAddMentee(formData: Partial<IMentee>): Promise<IMentee | null> {
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
  async dbGoogleAddMentee(formData: Partial<IMentee>): Promise<IMentee | null> {
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

  async dbFindById(id: string): Promise<IMentee | null> {
    try {
      return await this.find_By_Id(id, { isBlocked: false });
    } catch (error: unknown) {
      throw new Error(
        `error fetch metnee data by id  in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }

  async dbChangePassword(
    id: string,
    password: string
  ): Promise<IMentee | null> {
    try {
      return await this.find_By_Id_And_Update(MenteeModel, id, {
        $set: { password: password },
      });
    } catch (error: unknown) {
      throw new Error(
        `error fetch metnee password change by id  in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }
  async dbProfileChange(image: string, id: string): Promise<IMentee | null> {
    try {
      return await this.find_By_Id_And_Update(MenteeModel, id, {
        $set: { profileUrl: image },
      });
    } catch (error: unknown) {
      throw new Error(
        `error fetch metnee password change by id  in repository ${error instanceof Error ? error.message : String(error)
        } `
      );
    }
  }

  async DBupdateMentee(email: string): Promise<any> {
    try {
      const data = await MenteeModel.updateOne({ email }, { $set: { verified: true } });
      console.log(data, 'verify data from repo')
      return data
    } catch (error: unknown) {
      throw new Error(`error while updating mentee`)
    }
  }
  async findByEmail(email: string): Promise<IMentee | null> {
    try {

      return await this.find_One({ email })//find one in base repo
    } catch (error: any) {
      console.log('Error while finding user with email', email, error);
      throw new Error('Error while finding user by Email')
    }
  }
  async create_Mentee(userData: IMentee): Promise<IMentee> {
    try {
      return await this.createDocument(userData);
    } catch (error: any) {
      console.log(`error while doing signup ${error}`);
      throw new Error("error while mentee Signup");
    }
  }
  async DBMainLogin(email: string): Promise<IMentee | null> {
    try {

      return await this.find_One({ email });
    } catch (error: unknown) {
      throw new Error(`error  in DBMainLogin  while Checking User ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  async DBforgot_PasswordChange(email: string, password: string): Promise<IMentee | null | undefined> {
    try {
      return await this.find_One_And_Update(MenteeModel, { email: email }, { $set: { password: password } });
    } catch (error: unknown) {
      console.log(`error while find and update on DBforget_passwordChange ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  //admin data fetch
  async DBadminLogin(email: string): Promise<IMentee | null> {
    try {
      return await this.find_One({ email })
    } catch (error: unknown) {
      console.log(`error while finding admin ${error instanceof Error ? error.message : String(error)}`)
      return null;
    }
  }
}
export default new MenteeRepository();
