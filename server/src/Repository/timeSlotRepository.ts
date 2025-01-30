import timeSchema, { Itime } from "../Model/timeModel";
import { ItimeSlotRepository } from "../Interface/timeSchedule/iTimeSchedule";

import { baseRepository } from "./baseRepo";
import mongoose, { DeleteResult, ObjectId } from "mongoose";

class timeSlotRepository
  extends baseRepository<Itime>
  implements ItimeSlotRepository
{
  constructor() {
    super(timeSchema);
  }
  async createTimeSlot(timeSlots: Itime[]): Promise<Itime | undefined> {
    try {
      return timeSchema.insertMany(timeSlots) as unknown as Itime;
    } catch (error: unknown) {
      throw new Error(
        `${"\x1b[35m%s\x1b[0m"}error while creating tiem slot :${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getTimeSlots(mentorId: ObjectId): Promise<Itime[] | []> {
    try {
      const currentDate = new Date(); // Get the current date and time

      const res = await this.aggregateData(timeSchema, [
        {
          $unwind: "$slots",
        },
        {
          $project: {
            startDate: 1,
            isBooked: 1,
            mentorId: 1,
            price: 1,
            startTime: "$slots.startTime",
            endTime: "$slots.endTime",
            startStr: "$slots.startStr",
            endStr: "$slots.endStr",
          },
        },
        {
          $match: {
            mentorId: mentorId, // Replace mentorId with the actual value
            isBooked: false,
            startTime: { $gt: currentDate }, // Ensures the startTime is greater than the current date
          },
        },
        {
          $sort: {
            startTime: 1,
          },
        },
      ]);

      return res;
    } catch (error: unknown) {
      throw new Error(`${"\x1b[35m%s\x1b[0m"}error while getting based on
            slot :${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async removeTimeSlot(slotId: string): Promise<DeleteResult | undefined> {
    try {
      return this.deleteDocument(slotId);
    } catch (error: unknown) {
      throw new Error(
        `${"\x1b[35m%s\x1b[0m"}error while removing time slot :${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //mentee side for mentor booking
  async getMentorSlots(mentorId: string): Promise<Itime[] | []> {
    try {
      const currentDate = new Date();
      return this.aggregateData(timeSchema, [
        {
            $unwind: "$slots",
          },
          {
            $project: {
              startDate: 1,
              isBooked: 1,
              mentorId: 1,
              price: 1,
              startTime: "$slots.startTime",
              endTime: "$slots.endTime",
              startStr: "$slots.startStr",
              endStr: "$slots.endStr",
            },
          },
        {
          $match: {
           mentorId:new mongoose.Types.ObjectId( mentorId),
            startTime: { $gt: currentDate },
          },
        },
      ]);
    } catch (error: unknown) {
      throw new Error(
        `${"\x1b[35m%s\x1b[0m"}error while getting error while get speific mentor time slots :${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
export default new timeSlotRepository();
