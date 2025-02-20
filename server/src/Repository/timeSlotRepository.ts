import timeSchema, { Itime } from "../Model/timeModel";
import { ItimeSlotRepository } from "../Interface/Booking/iTimeSchedule";

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
            duration:1,
            startTime: "$slots.startTime",
            endTime: "$slots.endTime",
            startStr: "$slots.startStr",
            endStr: "$slots.endStr",
          },
        },
        {
          $match: {
            mentorId: mentorId, 
            isBooked: false,
            startDate: { $gte: new Date() }
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
              duration:1
            },
          },
        {
          $match: {
           mentorId:new mongoose.Types.ObjectId( mentorId),
            startDate: { $gt: new Date() },
            isBooked:false
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

  //make the timeslot booked
  async makeTimeSlotBooked(slotId:string):Promise<Itime|null>{
    try {
      return await this.find_By_Id_And_Update(timeSchema,slotId,{$set:{isBooked:true}})
    } catch (error:unknown) {
      throw new Error(
        `${"\x1b[35m%s\x1b[0m"}error while getting editing speific mentor time slots :${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
export default new timeSlotRepository();
