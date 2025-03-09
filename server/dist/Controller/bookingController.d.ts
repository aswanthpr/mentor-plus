import { Request, Response } from "express";
import { IbookingController } from "../Interface/Booking/iBookingController";
import { IbookingService } from "../Interface/Booking/iBookingService";
export declare class bookingControlelr implements IbookingController {
    private _bookingService;
    constructor(_bookingService: IbookingService);
    getTimeSlots(req: Request, res: Response): Promise<void>;
    slotBooking(req: Request, res: Response): Promise<void>;
    stripeWebHook(req: Request, res: Response): Promise<void>;
    catch(error: unknown): void;
    getBookedSlot(req: Request, res: Response): Promise<void>;
    getBookedSession(req: Request, res: Response): Promise<void>;
    cancelSlot(req: Request, res: Response): Promise<void>;
    mentorSlotCancel(req: Request, res: Response): Promise<void>;
    createSessionCode(req: Request, res: Response): Promise<void>;
    sessionCompleted(req: Request, res: Response): Promise<void>;
    validateSessionJoin(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=bookingController.d.ts.map