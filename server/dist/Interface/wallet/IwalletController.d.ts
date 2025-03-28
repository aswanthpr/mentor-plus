import { NextFunction, Request, Response } from "express";
export interface IwalletController {
    addMoneyToWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
    getWalletData(req: Request, res: Response, next: NextFunction): Promise<void>;
    withdrawMentorEarnings(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=IwalletController.d.ts.map