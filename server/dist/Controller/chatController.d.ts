import { Request, Response } from "express";
import { IchatController } from "../Interface/chat/IchatController";
import { IchatService } from "../Interface/chat/IchatService";
export declare class chatController implements IchatController {
    private _chatService;
    constructor(_chatService: IchatService);
    getChats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=chatController.d.ts.map