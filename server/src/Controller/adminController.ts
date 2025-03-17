import { Request, Response } from "express";
import { IadminController } from "../Interface/Admin/iAdminController";
import { IadminService } from "../Interface/Admin/iAdminService";

export class adminController implements IadminController {
  constructor(private _adminService: IadminService) {}
  async adminRefreshToken(req: Request, res: Response): Promise<void> {
    try {
  
      console.log("Received refresh token from cookies:", req.cookies.refreshToken)
   
      const result = await this._adminService.adminRefreshToken(req.cookies?.adminToken);
      
 
      res.status(result.status)
      .cookie("adminToken", result?.refreshToken as string, {
        httpOnly: true,
        secure:  process.env.NODE_ENV === 'production',
        sameSite: "lax",
        maxAge: 14 * 24 * 60 * 60 * 1000,
      })
      .json({success:result?.success,message:result?.message,accessToken:result?.accessToken});
  
    } catch (error: unknown) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
  
      throw new Error(
        `error while geting refreshToken${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const response = await this._adminService.createCategory(req.body!);

      
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

  async categoryData(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._adminService.categoryData();
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

  async editCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id, category } = req.body;
      console.log(req.body, "thsi is the data", id, category);
      const result = await this._adminService.editCategory(id, category);
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
  async changeCategoryStatus(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._adminService.changeCategoryStatus(
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
  async menteeData(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._adminService.menteeData();

      
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

  async changeMenteeStatus(req:Request,res:Response):Promise<void>{
    try {
      const result = await this._adminService.changeMenteeStatus(
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

    async editMentee(req:Request,res:Response):Promise<void>{
      try {
      console.log(req.body)
      const {status,success,message} = await this._adminService.editMentee(req.body);
      
        res.status(status!).json({success,message});
    
      } catch (error:unknown) {
        throw new Error(
          `error while getting mentee Data  in controller ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
    async addMentee(req:Request,res:Response):Promise<void>{
      try {
        const response = await this._adminService.addMentee(req.body);

       
          res.status(200).json(response);
        
      } catch (error:unknown) {
        throw new Error(
          `error while add mentee Data  in controller ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    //-----------------------------------------------------------
    async mentorData(req: Request, res: Response): Promise<void> {
      try {
        const result = await this._adminService.mentorData();
        res.status(result.status).json({success:result.success,message:result.message,mentorData:result.mentorData})
      } catch (error:unknown) {
        throw new Error(
          `error while get mentor Data  in controller ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
    async mentorVerify(req: Request, res: Response):Promise<void>{
      try {
        console.log(req.body,'lkasndflnf')
        const result = await this._adminService.mentorVerify(req.body as string);

        res.status(result.status).json({success:result.success,message:result.message,metnorData:result.result})
      } catch (error:unknown) {
        throw new Error(
          `error while mentor verify  in controller ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
    //mentor status change
    async changeMentorStatus(req: Request, res: Response): Promise<void> {
      try {
        const result =  await this._adminService.mentorStatusChange(req.body.id as string);
        res.status(result.status).json({success:result.success,message:result.message})
      } catch (error:unknown) {
        throw new Error( 
          `error while mentor stutus  in controller ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }
    async adminLogout(req: Request, res: Response): Promise<void> {
      try { 
        res.clearCookie('adminToken')
        res.status(200).json({ success: true, message: "Logout successfully" });
       
      } catch (error:unknown) {
        res.status(500).json({ success: false, message: "Internal server error" });
        throw new Error(
          `Error while mentee  logout ${error instanceof Error ? error.message : String(error)
          }`
        );
      }
    } 

  async getDashboardData(req:Request,res:Response):Promise<void>{
    try { 
      const {timeRange} = req.query;

     const {message,status,success,salesData} = await this._adminService.dashboardData(String(timeRange));
   
      res.status(status).json({ success, message,status,salesData});
     
    } catch (error:unknown) {
      res.status(500).json({ success: false, message: "Internal server error" });
      throw new Error(
        `Error while dashboard ${error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

}
