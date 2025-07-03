import { NextFunction, Request, Response } from "express";
import { IbookingController } from "../Interface/Booking/iBookingController";
import { IbookingService } from "../Interface/Booking/iBookingService";
export declare class bookingControlelr implements IbookingController {
    private _bookingService;
    constructor(_bookingService: IbookingService);
    getTimeSlots(req: Request, res: Response, next: NextFunction): Promise<void>;
    slotBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    stripeWebHook(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookedSlot(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBookedSession(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelSlot(req: Request, res: Response, next: NextFunction): Promise<void>;
    mentorSlotCancel(req: Request, res: Response, next: NextFunction): Promise<void>;
    createSessionCode(req: Request, res: Response, next: NextFunction): Promise<void>;
    sessionCompleted(req: Request, res: Response, next: NextFunction): Promise<void>;
    validateSessionJoin(req: Request, res: Response, next: NextFunction): Promise<void>;
    turnServerConnection(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=bookingController.d.ts.map