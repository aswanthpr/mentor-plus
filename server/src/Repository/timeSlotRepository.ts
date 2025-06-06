import timeSchema, { Itime } from "../Model/timeModel";
import { ItimeSlotRepository } from "../Interface/Booking/iTimeSchedule";

import { baseRepository } from "./baseRepo";
import mongoose, { DeleteResult, ObjectId, PipelineStage } from "mongoose";
import { getTodayEndTime, getTodayStartTime } from "../Utils/reusable.util";
import { Status } from "../Constants/httpStatusCode";
import { HttpError } from "../Utils/http-error-handler.util";

class timeSlotRepository
  extends baseRepository<Itime>
  implements ItimeSlotRepository {
  constructor() {
    super(timeSchema);
  }
  async createTimeSlot(timeSlots: Itime[]): Promise<Itime[] | []> {
    try {
      return timeSchema.insertMany(timeSlots) as unknown as Itime[];
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async getTimeSlots(
    mentorId: ObjectId,
    limit: number,
    skip: number,
    search: string,
    filter: string,
    sortField: string,
    sortOrder: string
  ): Promise<{ timeSlots: Itime[] | []; totalDocs: number }> {
    try {

      const dateSearch = new Date(search);
      const isValidDate = !isNaN(dateSearch.getTime());

    
      const pipeline: PipelineStage[] = [
        {
          $unwind: "$slots",
        },
        {
          $match: {
            mentorId: mentorId,
            isBooked: false,
            startDate: { $gte: new Date() },
          },
        },
        {
          $project: {
            startDate: 1,
            isBooked: 1,
            mentorId: 1,
            price: 1,
            duration: 1,
            startTime: "$slots.startTime",
            endTime: "$slots.endTime",
            startStr: "$slots.startStr",
            endStr: "$slots.endStr",
            createdAt: 1
          },
        },

      ];

      if (search) {
        pipeline.push({
          $match: {
            $or: [
              { startDate: isValidDate ? dateSearch! : undefined },
            ],
          },
        });

      }
      const order = sortOrder === "asc" ? 1 : -1;
      if (sortField === "createdAt") {
        pipeline.push({ $sort: { createdAt: order } });
      } else {
        pipeline.push({ $sort: { startTime: order } });
      }

      if (filter == "today") {
        pipeline.push({
          $match: {
            startDate: {
              $gte: getTodayStartTime(),
              $lte: getTodayEndTime(),
            },
          },
        });
      }
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });

      const countPipeline = [
        ...pipeline.slice(0, pipeline.length - 2),

        {
          $count: "totalDocuments",
        },
      ];

      // Execute Aggregations
      const [timeSlots, totalCount] = await Promise.all([
        this.aggregateData(timeSchema, pipeline),
        timeSchema.aggregate(countPipeline),
      ]);
      return { timeSlots, totalDocs: totalCount[0]?.totalDocuments };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async removeTimeSlot(slotId: string): Promise<DeleteResult | undefined> {
    try {
      return this.deleteDocument(slotId);
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
            duration: 1,
          },
        },
        {
          $match: {
            mentorId: new mongoose.Types.ObjectId(mentorId),
            startDate: { $gt: new Date() },
            isBooked: false,
          },
        },
        {
          $sort: { startTime: 1 }
        }
      ]);
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  //make the timeslot booked
  async makeTimeSlotBooked(slotId: string): Promise<Itime | null> {
    try {
      return await this.find_By_Id_And_Update(timeSchema, slotId, {
        $set: { isBooked: true },
      });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async checkTimeSlots(
    mentorId: ObjectId,
    startDate: Date,
    endDate: Date
  ): Promise<Itime[] | []> {
    try {
      return await this.aggregateData(timeSchema, [
        {
          $match: {
            mentorId,
            startDate: { $gte: startDate, $lte: endDate },
          },
        },
        { $unwind: "$slots" },
        {
          $project: {
            slots: 1,
          },
        },
      ]);
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }

  async releaseTimeSlot(slotId: string): Promise<Itime | null> {
    try {
      return await this.find_By_Id_And_Update(timeSchema, slotId, {
        $set: { isBooked: false },
      });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}
export default new timeSlotRepository();
