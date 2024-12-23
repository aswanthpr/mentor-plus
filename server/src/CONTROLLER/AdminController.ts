import { Request, Response } from "express";
import { IAdminController } from "../INTERFACE/Admin/IAdminController";
import { IAdminService } from "../INTERFACE/Admin/IAdminService";

export class AdminController implements IAdminController {
  constructor(private _AdminService: IAdminService) {}

  async getCreateCategory(req: Request, res: Response): Promise<void> {
    try {
      const response = await this._AdminService.blCreateCategory(req.body!);

      
        res.status(response.status).json(response);
      
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "internal server error" });

      throw new Error(
        `error while create category in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getCategoryData(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._AdminService.blCategoryData();
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(409).json(result);
      }
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while getting category in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getEditCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id, category } = req.body;
      console.log(req.body, "thsi is the data", id, category);
      const result = await this._AdminService.blEditCategory(id, category);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(409).json(result);
      }
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while getting category in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async getChangeCategoryStatus(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._AdminService.blChangeCategoryStatus(
        req.body.id
      );
      res
        .status(result.status)
        .json({ success: result.success, message: result.message });
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while getting category in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //-----------------------------------------------------------------------------------------------
  async getMenteeData(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._AdminService.blMenteeData();

      
        res.status(result.status).json(result);
      
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });

      throw new Error(
        `error while getting category in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getChangeMenteeStatus(req:Request,res:Response):Promise<void>{
    try {
      const result = await this._AdminService.blChangeMenteeStatus(
        req.body.id
      );
      res
        .status(result.status)
        .json({ success: result.success, message: result.message });
    } catch (error:unknown) {
      throw new Error(
        `error while getting category in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

    async getEditMentee(req:Request,res:Response):Promise<void>{
      try {
      console.log(req.body)
      const result = await this._AdminService.blEditMentee(req.body);
      
        res.status(result?.status!).json(result);
    
      } catch (error:unknown) {
        throw new Error(
          `error while getting mentee Data  in controller ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
    async getAddMentee(req:Request,res:Response):Promise<void>{
      try {
        const response = await this._AdminService.blAddMentee(req.body);

       
          res.status(200).json(response);
        
      } catch (error:unknown) {
        throw new Error(
          `error while add mentee Data  in controller ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
}
