import { NextFunction, Request, Response } from "express";
export interface IbookingController {
    getTimeSlots(req: Request, res: Response, next: NextFunction): Promise<void>;
    slotBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    stripeWebHook(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookedSlot(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookedSession(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelSlot(req: Request, res: Response, next: NextFunction): Promise<void>;
    createSessionCode(req: Request, res: Response, next: NextFunction): Promise<void>;
    sessionCompleted(req: Request, res: Response, next: NextFunction): Promise<void>;
    validateSessionJoin(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=iBookingController.d.ts.map