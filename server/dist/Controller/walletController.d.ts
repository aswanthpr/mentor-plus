import { IwalletController } from "../Interface/wallet/IwalletController";
import { IwalletService } from "../Interface/wallet/IwalletService";
import { Request, Response } from "express";
export declare class walletController implements IwalletController {
    private __walletService;
    constructor(__walletService: IwalletService);
    addMoneyToWallet(req: Request, res: Response): Promise<void>;
    walletStripeWebHook(req: Request, res: Response): Promise<void>;
    getWalletData(req: Request, res: Response): Promise<void>;
    withdrawMentorEarnings(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=walletController.d.ts.map