import slotScheduleSchema, { IslotSchedule } from "../Model/slotSchedule";
import { baseRepository } from "./baseRepo";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import { ObjectId } from "mongoose";
import slotSchedule from "../Model/slotSchedule";

class slotScheduleRepository
  extends baseRepository<IslotSchedule>
  implements IslotScheduleRepository
{
  constructor() {
    super(slotScheduleSchema);
  }

  async newSlotBooking(
    newSlotSchedule: IslotSchedule
  ): Promise<IslotSchedule | null> {
    try {
      return await this.createDocument(newSlotSchedule);
    } catch (error: unknown) {
      throw new Error(
        ` error while creating new Booking slots${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
/**
 * Retrieves the booked slots for a specified mentee.
 *
 * @param menteeId - The ObjectId of the mentee for whom the booked slots are to be retrieved.
 * @param tabCond - A boolean condition used to filter slots based on additional criteria.
 * 
 * @returns A promise resolving to an array of booked slots (`IslotSchedule[]`) or an empty array if no slots are found.
 * 
 * @throws Error - Throws an error if there is an issue during the aggregation process.
 */


  async getBookedSlot(menteeId: ObjectId,tabCond:boolean): Promise<IslotSchedule[] | []> {
    try {
      // const pipeline 
      const matchFilter:Record<string, unknown>={
        menteeId,
        paymentStatus:"Paid",

      }
      if (tabCond) {//based on the tab

        matchFilter['status'] = { $in: ["CANCELLED", "COMPLETED"] };
        matchFilter['isAttended'] = true;
      } else {
        
        matchFilter['status'] = { $in: ["RESCHEDULED", "PENDING", "CONFIRMED"] };
        matchFilter['isAttended'] = false;
      }
console.log(matchFilter,'matchFilter')
      return await this.aggregateData(slotSchedule,[
        {
          $match:matchFilter
        },
        {
          $lookup:{
            from:'times',
            localField:'slotId',
            foreignField:'_id',
            as:'slotDetails'
          }
        },
        {
          $unwind:{
            path:'$slotDetails',
            preserveNullAndEmptyArrays:true
,          }
        },
        {
          $lookup: {
            from: "mentors",
            localField: "slotDetails.mentorId",
            foreignField: "_id",

            as:"user",
          },
        },
        {
          $unwind:{
            path:'$user',
            preserveNullAndEmptyArrays:true
,          }
        },
        {
          $sort:{
            createdAt:-1
          }
        }
      ])
    } catch (error:unknown) {
      throw new Error(
        `${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  async getBookedSession(mentorId: ObjectId,tabCond:boolean): Promise<IslotSchedule[] | []> {
    try {

      const matchFilter: Record<string, unknown> = {
        'slotDetails.mentorId': mentorId,
        paymentStatus: "Paid",
      };

      if (tabCond) {//based on the tab

        matchFilter['status'] = { $in: ["PENDING", "CANCELLED", "COMPLETED"] };
        matchFilter['isAttended'] = true;
      } else {
        
        matchFilter['status'] = { $in: ["RESCHEDULED", "PENDING", "CONFIRMED"] };
        matchFilter['isAttended'] = false;
      }


      return await this.aggregateData(slotSchedule,[
        {
          $lookup:{
            from:'times',
            localField:'slotId',
            foreignField:'_id',
            as:'slotDetails'
          }
        },
        {
          $unwind:{
            path:'$slotDetails',
            preserveNullAndEmptyArrays:true
,          }
        },
         {
          $lookup: {
            from: "mentees",
            localField: "menteeId",
            foreignField: "_id",

            as:"user",
          },
        },
        {
          $unwind:{
            path:'$user',
            preserveNullAndEmptyArrays:true
,          }
        },
         {
          $match:matchFilter
        },
        
        {
          $sort:{
            createdAt:-1
          }
        }
      ])
    } catch (error:unknown) {
      throw new Error(
        `${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
export default new slotScheduleRepository();
