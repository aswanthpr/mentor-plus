/* eslint-disable @typescript-eslint/no-unused-vars */
import slotScheduleSchema, { IslotSchedule } from "../Model/slotSchedule";
import { baseRepository } from "./baseRepo";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import mongoose, { ObjectId } from "mongoose";
import slotSchedule from "../Model/slotSchedule";
import { InewSlotSchedule } from "../Types";
import { getTodayStartTime } from "../Utils/reusable.util";

class slotScheduleRepository
  extends baseRepository<IslotSchedule>
  implements IslotScheduleRepository
{
  constructor() {
    super(slotScheduleSchema);
  }

  async newSlotBooking(
    newSlotSchedule: IslotSchedule
  ): Promise<InewSlotSchedule | null> {
    try {
      const res = await this.createDocument(newSlotSchedule);
      const result = await this.aggregateData(slotSchedule, [
        {
          $match: {
            slotId: res?.slotId,
          },
        },
        {
          $lookup: {
            from: "times",
            localField: "slotId",
            foreignField: "_id",
            as: "times",
          },
        },
        {
          $unwind: {
            path: "$times",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   $project:{
        //     mentorId:"$times.mentorId",

        //   }
        // }
      ]);
      console.log(result, "result");
      return result[0];
    } catch (error: unknown) {
      throw new Error(
        ` error while creating new Booking slots${
          error instanceof Error ? error.message : String(error)
        }`
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

  async getBookedSlot(
    menteeId: ObjectId,
    tabCond: boolean
  ): Promise<IslotSchedule[] | []> {
    try {
      const todayStart = getTodayStartTime();

      console.log(todayStart, "today start");
      const matchFilter: Record<string, unknown> = {
        menteeId,
        paymentStatus: "Paid",
      };

      if (tabCond) {
        matchFilter["status"] = { $in: ["CANCELLED", "COMPLETED"] };
      } else {
        matchFilter["status"] = {
          $in: [
            "RESCHEDULED",
            "CONFIRMED",
            "PENDING",
            "CANCEL_REQUESTED",
            "REJECTED",
          ],
        };
      }

      const dateFilter = tabCond
        ? { "slotDetails.startTime": { $lt: todayStart } }
        : {
            $or: [
              { "slotDetails.startTime": { $gte: todayStart } }, // Future sessions
              { status: "CONFIRMED" }, // Include past confirmed sessions
            ],
          };

      return await this.aggregateData(slotSchedule, [
        {
          $match: matchFilter,
        },
        {
          $lookup: {
            from: "times",
            localField: "slotId",
            foreignField: "_id",
            as: "slotDetails",
          },
        },
        {
          $unwind: {
            path: "$slotDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "mentors",
            localField: "slotDetails.mentorId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   $match: dateFilter,
        // },
        {
          $sort: {
            "slotDetails.startTime": tabCond ? -1 : 1,
          },
        },
      ]);
    } catch (error: unknown) {
      throw new Error(
        `${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  async getBookedSession(
    mentorId: ObjectId,
    tabCond: boolean
  ): Promise<IslotSchedule[] | []> {
    try {
      const todayStart = getTodayStartTime();

      const matchFilter: Record<string, unknown> = {
        "slotDetails.mentorId": mentorId,
        paymentStatus: "Paid",
      };
      console.log("\x1b[32m%s\x1b[0m", mentorId,todayStart);
      if (tabCond) {
        //based on the tab

        matchFilter["status"] = { $in: ["CANCELLED", "COMPLETED"] };
      } else {
        matchFilter["status"] = {
          $in: [
            "RESCHEDULED",
            "CONFIRMED",
            "PENDING",
            "CANCEL_REQUESTED",
            "CANCEL_REJECTED",
          ],
        };
      }

      console.log(matchFilter, "filter");
      const dateFilter = tabCond
      ? { "slotDetails.startDate": { $lt: todayStart } }
      : { "slotDetails.startTime": { $gte: todayStart } }
      return await this.aggregateData(slotSchedule, [
        {
          $lookup: {
            from: "times",
            localField: "slotId",
            foreignField: "_id",
            as: "slotDetails",
          },
        },
        {
          $unwind: {
            path: "$slotDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        
        {
          $lookup: {
            from: "mentees",
            localField: "menteeId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: matchFilter,
        },
        // {
        //   $match: dateFilter,
        // },
        {
          $sort: {
            "slotDetails.startTime": tabCond ? -1 : 1,
          },
        },
      ]);
    } catch (error: unknown) {
      throw new Error(
        `${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async cancelSlot(
    sessionId: string,
    issue: string
  ): Promise<IslotSchedule | null> {
    try {
      console.log(sessionId, issue);
      return await this.find_By_Id_And_Update(
        slotSchedule,
        new mongoose.Types.ObjectId(sessionId),
        { $set: { status: "CANCEL_REQUESTED", cancelReason: issue } }
      );
    } catch (error: unknown) {
      throw new Error(
        `error while cancel the slot in slot schedule repositry${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async mentorSlotCancel(
    sessionId: string,
    slotValule: string
  ): Promise<IslotSchedule | null> {
    try {
      return await this.find_By_Id_And_Update(
        slotSchedule,
        new mongoose.Types.ObjectId(sessionId),
        { $set: { status: slotValule } }
      );
    } catch (error: unknown) {
      throw new Error(
        `error while mentor handle  cancel  slot request  in slot schedule repositry${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
export default new slotScheduleRepository();
