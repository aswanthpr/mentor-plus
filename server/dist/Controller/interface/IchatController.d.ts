import { NextFunction, Request, Response } from "express";
export interface IchatController {
    getChats(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=IchatController.d.ts.map