/* eslint-disable @typescript-eslint/no-unused-vars */
import slotScheduleSchema, { IslotSchedule } from "../Model/slotSchedule";
import { baseRepository } from "./baseRepo";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import mongoose, { ObjectId, PipelineStage } from "mongoose";
import slotSchedule from "../Model/slotSchedule";
import { InewSlotSchedule } from "../Types";
import { getTodayStartTime } from "../Utils/reusable.util";
import moment from "moment";
import { Pipe } from "stream";

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

      const matchFilter: Record<string, unknown> = {
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
        ? { "slotDetails.startDate": { $lt: new Date() } }
        : {
            "slotDetails.startDate": {
              $gte: todayStart,
            },
          };

      const pipeLine: PipelineStage[] = [
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
          $match: matchFilter,
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

        {
          $match: dateFilter,
        },
        {
          $sort: {
            "slotDetails.startDate": -1,
          },
        },
      ];
      if (tabCond) {
        pipeLine.push(
          {
            $lookup: {
              from:"reviews",
              localField:"_id",
              foreignField:"sessionId",
              as:"review",
            },
          },
          {
            $unwind: {
              path: "$review",
              preserveNullAndEmptyArrays: true,
            },
          },
        );
      }
      const resp = await this.aggregateData(slotSchedule, pipeLine);
      console.log(resp, "resp", pipeLine);
      return resp;
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
        ? { "slotDetails.startDate": { $lt: new Date() } }
        : { "slotDetails.startDate": { $gte: todayStart } };
      const pipeLine: PipelineStage[] = [
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
          $match: dateFilter,
        },
        {
          $match: matchFilter,
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
      ];

      pipeLine.push({
        $sort: {
          "slotDetails.startDate": -1,
        },
      });
      return await this.aggregateData(slotSchedule, pipeLine);
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
  async createSessionCode(
    bookingId: string,
    sessionCode: string
  ): Promise<string> {
    try {
      const response = await this.find_By_Id_And_Update(
        slotScheduleSchema,
        bookingId,
        { $set: { sessionCode } }
      );

      return response?.sessionCode as string;
    } catch (error: unknown) {
      throw new Error(
        `error while mentor handle  cancel  slot request  in slot schedule repositry${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //mentor  make as session completed
  async sessionCompleted(bookingId: string): Promise<IslotSchedule | null> {
    try {
      return this.find_By_Id_And_Update(slotScheduleSchema, bookingId, {
        $set: { status: "COMPLETED" },
      });
    } catch (error: unknown) {
      throw new Error(
        `error while mentor handle  cancel  slot request  in slot schedule repositry${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  //checking user is alllowed to join session

  async validateSessionJoin(
    sessionId: string,
    sessionCode: string
  ): Promise<IslotSchedule | null> {
    try {
      return await this.find_One({
        _id: sessionId,
        sessionCode,
        status: "CONFIRMED",
      });
    } catch (error: unknown) {
      throw new Error(
        ` error while validate user is allowed to join session ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
export default new slotScheduleRepository();
