import { IwalletController } from "../Interface/wallet/IwalletController";
import { IwalletService } from "../Interface/wallet/IwalletService";
import { NextFunction, Request, Response } from "express";
export declare class walletController implements IwalletController {
    private __walletService;
    constructor(__walletService: IwalletService);
    addMoneyToWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
    walletStripeWebHook(req: Request, res: Response, next: NextFunction): Promise<void>;
    getWalletData(req: Request, res: Response, next: NextFunction): Promise<void>;
    withdrawMentorEarnings(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=walletController.d.ts.map