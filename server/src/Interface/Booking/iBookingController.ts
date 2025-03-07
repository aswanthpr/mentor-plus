import { Request, Response } from "express";
export interface IbookingController{
    getTimeSlots(req: Request, res: Response): Promise<void>;
    slotBooking(req: Request, res: Response): Promise<void>;
    stripeWebHook(req: Request, res: Response): Promise<void>;
    getBookedSlot(req: Request, res: Response): Promise<void> ;
    getBookedSession(req: Request, res: Response): Promise<void>;
    cancelSlot(req: Request, res: Response): Promise<void>;
    createSessionCode(req:Request,res:Response):Promise<void>;
    sessionCompleted(req:Request,res:Response):Promise<void>;
    validateSessionJoin(req:Request,res:Response):Promise<void>;
}