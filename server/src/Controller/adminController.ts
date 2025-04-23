import { NextFunction, Request, Response } from "express";
import { IadminController } from "../Interface/Admin/iAdminController";
import { IadminService } from "../Interface/Admin/iAdminService";
import { Status } from "../Constants/httpStatusCode";

export class adminController implements IadminController {
  constructor(private _adminService: IadminService) {}
  async adminRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this._adminService.adminRefreshToken(
        req.cookies?.adminToken
      );

      res
        .status(result.status)
        .cookie("adminToken", result?.refreshToken as string, {
          httpOnly: true,
          secure:process.env.NODE_ENV === "production",
          sameSite:"none",
          maxAge: 14 * 24 * 60 * 60 * 1000,
        })
        .json({
          success: result?.success,
          message: result?.message,
          accessToken: result?.accessToken,
        });
    } catch (error: unknown) {
      next(error);
    }
  }

  async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await this._adminService.createCategory(req.body!);

      res.status(response.status).json(response);
    } catch (error: unknown) {
      next(error);
    }
  }

  async categoryData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { searchQuery, statusFilter, sortField, sortOrder, page, limit } =
        req.query;

      const { message, success, categories, totalPage, status } =
        await this._adminService.categoryData(
          String(searchQuery),
          String(statusFilter),
          String(sortField),
          String(sortOrder),
          Number(page),
          Number(limit)
        );
      res.status(status).json({ message, success, categories, totalPage });
    } catch (error: unknown) {
      next(error);
    }
  }

  async editCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, category } = req.body;
     
      const result = await this._adminService.editCategory(id, category);
      if (result.success) {
        res.status(Status?.Ok).json(result);
      } else {
        res.status(Status?.Conflict).json(result);
      }
    } catch (error: unknown) {
      next(error);
    }
  }
  async changeCategoryStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this._adminService.changeCategoryStatus(req.body.id);
      res
        .status(result.status)
        .json({ success: result.success, message: result.message });
    } catch (error: unknown) {
      next(error);
    }
  }

  //-----------------------------------------------------------------------------------------------
  async menteeData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { search, sortField, sortOrder, statusFilter, page, limit } =
        req.query;

      const { message, status, success, totalPage, Data } =
        await this._adminService.menteeData(
          String(search),
          String(sortField),
          String(sortOrder),
          String(statusFilter),
          Number(page),
          Number(limit)
        );

      res.status(status).json({ message, success, totalPage, Data });
    } catch (error: unknown) {
      next(error);
    }
  }

  async changeMenteeStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this._adminService.changeMenteeStatus(req.body?.id);
      res
        .status(result.status)
        .json({ success: result.success, message: result.message });
    } catch (error: unknown) {
      next(error);
    }
  }

  async editMentee(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
     
      const { status, success, message } = await this._adminService.editMentee(
        req.body
      );

      res.status(status!).json({ success, message });
    } catch (error: unknown) {
      next(error);
    }
  }
  async addMentee(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await this._adminService.addMentee(req.body);

      res.status(Status?.Ok).json(response);
    } catch (error: unknown) {
      next(error);
    }
  }

  //-----------------------------------------------------------
  async mentorData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { searchQuery, sortField, sortOrder, page, limit, activeTab } =
        req.query;
      const result = await this._adminService.mentorData(
        String(searchQuery),
        String(activeTab),
        String(sortField),
        String(sortOrder),
        Number(page),
        Number(limit)
      );
      res.status(result.status).json({
        success: result.success,
        message: result.message,
        mentorData: result.mentorData,
        totalPage: result?.totalPage,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  async mentorVerify(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
     
      const result = await this._adminService.mentorVerify(req.body as string);

      res.status(result.status).json({
        success: result.success,
        message: result.message,
        metnorData: result.result,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
  //mentor status change
  async changeMentorStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this._adminService.mentorStatusChange(
        req.body.id as string
      );
      res
        .status(result.status)
        .json({ success: result.success, message: result.message });
    } catch (error: unknown) {
      next(error);
    }
  }
  async adminLogout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.clearCookie("adminToken");
      res
        .status(Status?.Ok)
        .json({ success: true, message: "Logout successfully" });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getDashboardData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { timeRange } = req.query;

      const { message, status, success, salesData } =
        await this._adminService.dashboardData(String(timeRange));

      res.status(status).json({ success, message, status, salesData });
    } catch (error: unknown) {
      next(error);
    }
  }
}
