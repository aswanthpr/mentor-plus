import { Request, Response } from "express";
import { IbookingController } from "../Interface/Booking/iBookingController";
import { IbookingService } from "../Interface/Booking/iBookingService";
export declare class bookingControlelr implements IbookingController {
    private _bookingService;
    constructor(_bookingService: IbookingService);
    /**
     * Retrieves available time slots for a given mentor.
     *
     * @param req - Express request object, expects `mentorId` in the query.
     * @param res - Express response object, returns a JSON with success status, message, available time slots, and platform fee.
     *
     * @returns void - Responds with the status and details of the time slots retrieval operation.
     *
     * @throws Error - Throws an error if there is an issue while fetching the time slots.
     */
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