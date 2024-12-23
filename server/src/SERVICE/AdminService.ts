import { ICategoryRepository } from "../INTERFACE/Category/ICategoryRepository";
import { IAdminService } from "../INTERFACE/Admin/IAdminService";
import { ICategory } from "../MODEL/categorySchema";
import { IMenteeRepository } from "../INTERFACE/Mentee/IMenteeRepository";
import { IMentee } from "../MODEL/MenteeModel";

export class AdminService implements IAdminService {
  constructor(private _CategoryRepository: ICategoryRepository,private _MenteeRepository :IMenteeRepository) {}

  async blCreateCategory(Data: {
    category: string;
  }): Promise<{ success: boolean; message: string,status:number }> {
    try {
      const { category } = Data;
      if (!category) {
        return { success: false, message: "input data is missing" ,status:400};
      }
      const result = await this._CategoryRepository.dbFindCategory(category);

      if (result) {
        return { success: false, message: "category is existing" ,status:409};
      }
      const response = await this._CategoryRepository.dbCreateCategory(
        category
      );

      if (response?.category != category) {
        return { success: false, message: "unexpected error happend" ,status:409};
      }
      return { success: true, message: "category created successfully" ,status:201};
    } catch (error: unknown) {
      throw new Error(
        `error while create category in service ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //get category data to admin
  async blCategoryData(): Promise<{
    success: boolean;
    message: string;
    categories?: ICategory[];
  }> {
    try {
      const result = await this._CategoryRepository.dbcategoryData();

      if (!result) {
        return { success: false, message: "No categories found" };
      }

      return {
        success: true,
        message: "Data retrieved successfully",
        categories: result,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while getting category data in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //category edit controll
  async blEditCategory(
    id: string,
    category: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!category || !id) {
        return { success: false, message: "credential is  missing" };
      }

      const resp = await this._CategoryRepository.dbFindCategory(category);
      console.log(resp, "thsi is resp");
      if (resp) {
        return { success: false, message: "category already exitst" };
      }

      const result = await this._CategoryRepository.dbEditCategory(
        id,
        category
      );
      console.log(result, "this is edit categor result");
      if (!result) {
        return { success: false, message: "category not found" };
      }
      return { success: true, message: "category edited successfully" };
    } catch (error: unknown) {
      throw new Error(
        `Error while eding category  in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async blChangeCategoryStatus(
    id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!id) {
        return {
          success: false,
          message: "credential is missing",
          status: 400,
        };
      }
      const result = await this._CategoryRepository.dbChangeCategoryStatus(id);
      if (!result) {
        return { success: false, message: "category not found", status: 400 };
      }
      return {
        success: true,
        message: "category Edited successfully",
        status: 200,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while change category status in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async blMenteeData(): Promise<{ success: boolean; message: string; status: number; Data?:IMentee[] }> {
      try {
        
            const result = await this._MenteeRepository.dbMenteeData();
      
            if (!result) {
              return { success: false, message: "Users not  found" ,status:400,};
            }

            return {
              success: true,
              message: "Data retrieved successfully",
              status: 200,
              Data:result,
            };

      } catch (error:unknown) {
        throw new Error(
            `Error while get mentee data in service: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
      }
  }
  async blChangeMenteeStatus(id: string): Promise<{ success: boolean; message: string; status: number; }> {
    try {
      if (!id) {
        return {
          success: false,
          message: "credential is missing",
          status: 400,
        };
      }
      const result = await this._MenteeRepository.dbChangeMenteeStatus(id);
      if (!result) {
        return { success: false, message: "mentee not found", status: 400 };
      }
      return {
        success: true,
        message: "mentee Edited successfully",
        status: 200,
      };
    } catch (error:unknown) {
      throw new Error(
        `Error while update  mentee status in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async blEditMentee(formData: Partial<IMentee>): Promise<{ success: boolean; message: string; status?:number; }> {
    try {
      console.log(formData)
      if (!formData) {
        return { success: false, message: "credential is  missing" };
      }

      const result = await this._MenteeRepository.dbEditMentee(
       formData
      );
      console.log(result, "this is edit mentee result");
      if (!result) {
        return { success: false, message: "mentee not found" };
      }
      return { success: true, message: "Mentee updated successfully!" ,status:200};
    } catch (error:unknown) {
      throw new Error(
        `Error while Edit  mentee data in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async blAddMentee(formData: Partial<IMentee>): Promise<{success:boolean,message:string,status?:number,mentee?:IMentee|null}> {
    try {
      const { name,email,phone,bio } = formData;
      if (!name||!email||!phone||!bio) {
        return { success: false, message: " credential is missing" };
      }
      const result = await this._MenteeRepository.dbFindMentee(email);

      if (result) {
        return { success: false, message: "email is existing" };
      }
      const response = await this._MenteeRepository.dbAddMentee(
        formData
      );

      
      return { success: true, message: "mentee added successfully",status:200,mentee:response };
    } catch (error:unknown) {
      throw new Error(
        `Error while add  mentee data in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
