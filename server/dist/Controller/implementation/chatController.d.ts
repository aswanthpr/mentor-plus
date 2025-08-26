import { NextFunction, Request, Response } from "express";
import { IchatController } from "../interface/IchatController";
import { IchatService } from "../../Service/interface/IchatService";
export declare class chatController implements IchatController {
    private _chatService;
    constructor(_chatService: IchatService);
    getChats(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=chatController.d.ts.map