import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { IbookingController } from "../Interface/Booking/iBookingController";
import { IbookingService } from "../Interface/Booking/iBookingService";

export class bookingControlelr implements IbookingController {
  constructor(private _bookingService: IbookingService) {}

  //mentee slot booking
  //get timeslots for booking page

  async getTimeSlots(req: Request, res: Response): Promise<void> {
    try {
      const { mentorId } = req.query;

      const { success, status, message, timeSlots } =
        await this._bookingService.getTimeSlots(mentorId as string);

      res.status(status).json({ success, message, timeSlots });
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
      const { timeSlot, message, paymentMethod, totalAmount, mentorName } =
        req.body;

      const result = await this._bookingService.slotBooking(
        timeSlot,
        message,
        paymentMethod,
        totalAmount,
        mentorName,
        req.user as ObjectId,
        req.protocol as string,
        req.get("host") as string
      );

      res.status(result?.status).json({
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
    const signature = req.headers["stripe-signature"] as string;

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
      console.log(activeTab, "activeTab aane");
      const { status, message, success, slots } =
        await this._bookingService.getBookedSessions(
          req.user as Express.User as ObjectId,
          activeTab as string
        );

    
      res.status(status).json({ success, message, slots });
    } catch (error: unknown) {
      throw new Error(
        `Error when fetching all the booked sessions in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async cancelSlot(req: Request, res: Response): Promise<void> {
    try {
      const { success, result, message, status } =
        await this._bookingService.cancelSlot(
          req.params.sessionId as string,
          req.body?.reason,
          req.body?.customReason
        );

      res.status(status).json({ success, result, message });
    } catch (error: unknown) {
      throw new Error(
        `Error when cancelling booked sessions in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //mentor side cancel request handle
  async mentorSlotCancel(req: Request, res: Response): Promise<void>{
    try {
console.log( req.params.sessionId,req.body?.value)
      const { success, result, message, status } =
        await this._bookingService.mentorSlotCancel(
          req.params.sessionId as string,
          req.body?.value,
        );

      res.status(status).json({ success, result, message });
    } catch (error: unknown) {
      throw new Error(
        `Error when mentor handle cancel  booked sessions in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

   //create sessionCode in MentorSide
   async createSessionCode(req: Request, res: Response): Promise<void> {
     try {
    const {bookingId} = req.body;
    const{message,status,sessionCode,success} = await this._bookingService.createSessionCode(bookingId);
    res.status(status).json({message,success,sessionCode});
   
     } catch (error:unknown) {
      throw new Error(
        `Error when mentor handle cancel  booked sessions in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
     }
   }

   //mentor marking session completed
   async sessionCompleted(req: Request, res: Response): Promise<void> {
     try {
      const {bookingId} =req.body;
     const {message,sessionStatus,status,success} = await this._bookingService.sessionCompleted(bookingId,req.user as Express.User as ObjectId);
     res.status(status).json({message,sessionStatus,success});
     } catch (error:unknown) {
      throw new Error(
        `Error when mentor marking session completed in controller ${
          error instanceof Error ? error.message : String(error)
        }`
      );
     }
   }
   //check user is alloweded to join the sessin
   async validateSessionJoin(req: Request, res: Response): Promise<void> {
    try {

      const {sessionId,sessionCode} =req.body;

     const {message,status,success,session_Code} = await this._bookingService.validateSessionJoin(sessionId,sessionCode);
     res.status(status).json({message,success,session_Code});
     } catch (error:unknown) {
      throw new Error(
        `Error when user is alloweded to join this session ${
          error instanceof Error ? error.message : String(error)
        }`
      );
     }
   }
}
