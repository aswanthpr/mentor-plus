import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";
import { IbookingController } from "../Interface/Booking/iBookingController";
import { IbookingService } from "../Interface/Booking/iBookingService";
import { Status } from "../Constants/httpStatusCode";

export class bookingControlelr implements IbookingController {
  constructor(private _bookingService: IbookingService) {}

  //mentee slot booking
  //get timeslots for booking page

  async getTimeSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { mentorId } = req.query;

      const { success, status, message, timeSlots } =
        await this._bookingService.getTimeSlots(mentorId as string);

      res.status(status).json({ success, message, timeSlots });
    } catch (error: unknown) {
      next(error);
    }
  }
  async slotBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
      next(error);
    }
  }
  //stripe webhook conifgureation
  async stripeWebHook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const signature = req.headers["stripe-signature"] as string;

      await this._bookingService.stripeWebHook(signature, req.body as Buffer);
      res.status(Status?.Ok).json({ success: true });
    } catch (error: unknown) {
      next(error);
    }
  }

  //in mentee retrive the booked slot
  async getBookedSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { activeTab, search, page, limit, sortField, sortOrder, filter } =
        req.query;

      const { status, message, success, slots, totalPage } =
        await this._bookingService.getBookedSlots(
          req.user as Express.User as ObjectId,
          String(activeTab),
          String(search),
          String(sortField),
          String(sortOrder),
          String(filter),
          Number(page),
          Number(limit)
        );

      res.status(status).json({ success, message, slots, totalPage });
    } catch (error: unknown) {
      next(error);
    }
  }
  //in mentor side to get show the sessions
  async getBookedSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { activeTab, search, sortField, sortOrder, filter, page, limit } =
        req.query;

      const { status, message, success, slots, totalPage } =
        await this._bookingService.getBookedSessions(
          req.user as Express.User as ObjectId,
          String(activeTab),
          String(search),
          String(sortField),
          String(sortOrder),
          String(filter),
          Number(page),
          Number(limit)
        );

      res.status(status).json({ success, message, slots, totalPage });
    } catch (error: unknown) {
      next(error);
    }
  }
  async cancelSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { success, result, message, status } =
        await this._bookingService.cancelSlot(
          req.params.sessionId as string,
          req.body?.reason,
          req.body?.customReason
        );

      res.status(status).json({ success, result, message });
    } catch (error: unknown) {
      next(error);
    }
  }
  //mentor side cancel request handle
  async mentorSlotCancel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { success, result, message, status } =
        await this._bookingService.mentorSlotCancel(
          req.params.sessionId as string,
          req.body?.value
        );

      res.status(status).json({ success, result, message });
    } catch (error: unknown) {
      next(error);
    }
  }

  //create sessionCode in MentorSide
  async createSessionCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.body;
      const { message, status, sessionCode, success } =
        await this._bookingService.createSessionCode(bookingId);
      res.status(status).json({ message, success, sessionCode });
    } catch (error: unknown) {
      next(error);
    }
  }

  //mentor marking session completed
  async sessionCompleted(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId } = req.body;
      const { message, sessionStatus, status, success } =
        await this._bookingService.sessionCompleted(
          bookingId,
          req.user as Express.User as ObjectId
        );
      res.status(status).json({ message, sessionStatus, success });
    } catch (error: unknown) {
      next(error);
    }
  }
  //check user is alloweded to join the sessin
  async validateSessionJoin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sessionId, sessionCode } = req.query;

      const { message, status, success, session_Code } =
        await this._bookingService.validateSessionJoin(
          String(sessionId),
          String(sessionCode),
          req.user as Express.User as ObjectId
        );
      res.status(status).json({ message, success, session_Code });
    } catch (error: unknown) {
      next(error);
    }
  }
  async turnServerConnection(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { turnServerConfig, status } =
        await this._bookingService.turnServerConnection();
      res.status(status).json({ turnServerConfig });
    } catch (error: unknown) {
      next(error);
    }
  }
}
