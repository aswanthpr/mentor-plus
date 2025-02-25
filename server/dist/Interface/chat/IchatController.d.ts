import { Request, Response } from "express";
export interface IchatController {
    getChats(req: Request, res: Response): Promise<void>;
    getUserMessage(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=IchatController.d.ts.map