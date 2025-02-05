import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { IbookingController } from "../Interface/Booking/iBookingController";
import { IbookingService } from "../Interface/Booking/iBookingService";

export class bookingControlelr implements IbookingController {
  constructor(private _bookingService: IbookingService) {}

  //mentee slot booking
  //get timeslots for booking page
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

  async getTimeSlots(req: Request, res: Response): Promise<void> {
    try {
      const { mentorId } = req.query;

      const { success, status, message, timeSlots, platformFee } =
        await this._bookingService.getTimeSlots(mentorId as string);

      res.status(status).json({ success, message, timeSlots, platformFee });
    } catch (error: unknown) {
      throw new Error(
        `Error while  getting timeslots for booking  ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async slotBooking(req: Request, res: Response): Promise<void> {
    try {
      const {
        timeSlot,
        message,
        paymentMethod,
        totalAmount,
        duration,
        mentorName,
      } = req.body;

      const result = await this._bookingService.slotBooking(
        timeSlot,
        message,
        paymentMethod,
        totalAmount,
        duration,
        mentorName,
        req.user as ObjectId,
        req.protocol as string,
        req.get("host") as string
      );

      res
        .status(result?.status)
        .json({
          message: result?.message,
          success: result?.success,
          session: result?.session,
        });
    } catch (error: unknown) {
      throw new Error(
        `Error while  getting timeslots for booking  ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //stripe webhook conifgureation
  async stripeWebHook(req: Request, res: Response): Promise<void> {
    const signature = req.headers["stripe-signature"] as string ;

    await this._bookingService.stripeWebHook(signature, req.body as Buffer);
    res.status(200).json({ success: true });
  }
  catch(error: unknown) {
    throw new Error(
      `Error while  webhook config ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  //in mentee retrive the booked slot
  async getBookedSlot(req: Request, res: Response): Promise<void> {
    try {
      const { activeTab } = req.query;

      const { status, message, success, slots } =
        await this._bookingService.getBookedSlots(
          req.user as Express.User as ObjectId,
          activeTab as string
        );
      console.log(slots, "result");
      res.status(status).json({ success, message, slots });
    } catch (error: unknown) {
      throw new Error(
        `Error when fetching all the booked sessions in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //in mentor side to get show the sessions
  async getBookedSession(req: Request, res: Response): Promise<void> {
    try {
      const { activeTab } = req.query;
console.log(activeTab,'activeTab aane')
      const { status, message, success, slots } =
        await this._bookingService.getBookedSessions(
          req.user as Express.User as ObjectId,
          activeTab as string
        );
        
      console.log(slots, "result");
      res.status(status).json({ success, message, slots });
    } catch (error: unknown) {
      throw new Error(
        `Error when fetching all the booked sessions in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
