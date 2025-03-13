import { Request, Response } from "express";
export interface IwalletController {
    addMoneyToWallet(req: Request, res: Response): Promise<void>;
    getWalletData(req: Request, res: Response): Promise<void>;
    withdrawMentorEarnings(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=IwalletController.d.ts.map