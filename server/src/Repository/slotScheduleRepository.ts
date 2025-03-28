import slotScheduleSchema, { IslotSchedule } from "../Model/slotSchedule";
import { baseRepository } from "./baseRepo";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import mongoose, { ObjectId, PipelineStage } from "mongoose";
import slotSchedule from "../Model/slotSchedule";
import {
  IcardData,
  IcardResult,
  ImentorChartData,
  InewSlotSchedule,
  ItopMentors,
  TimeData,
} from "../Types";
import { getTodayStartTime } from "../Utils/reusable.util";
import { Status } from "../Constants/httpStatusCode";
import { HttpError } from "../Utils/http-error-handler.util";

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
      ]);
      console.log(result, "result");
      return result[0];
    } catch (error: unknown) {
      throw new HttpError(
             error instanceof Error ? error.message : String(error),
             Status?.InternalServerError
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
    userId: ObjectId,
    tabCond: boolean,
    userType: "mentee" | "mentor",
    skip: number,
    limitNo: number,
    search: string,
    sortOrder: string,
    sortField: string,
    filter: string
  ): Promise<{ slots: IslotSchedule[] | []; totalDocs: number }> {
    try {
      const todayStart = getTodayStartTime();

      const matchFilter: Record<string, unknown> = {
        paymentStatus: "Paid",
        menteeId: userId
      };

      if (tabCond) {
        matchFilter["status"] = { $in: ["CANCELLED", "COMPLETED"] };
        matchFilter['menteeId'] = userId
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
              from: "reviews",
              localField: "_id",
              foreignField: "sessionId",
              as: "review",
            },
          },
          {
            $unwind: {
              path: "$review",
              preserveNullAndEmptyArrays: true,
            },
          }
        );
      }
      if (search) {
        pipeLine.push({
          $match: {
            $or: [
              {
                status: { $regex: search, $options: "i" },
              },
              { description: { $regex: search, $options: "i" } },
              { "user.name": { $regex: search, $options: "i" } },
              { bio: { $regex: search, $options: "i" } },
            ],
          },
        });
      }
      const order = sortOrder === "asc" ? 1 : -1;
      if (sortField === "createdAt") {
        pipeLine.push({ $sort: { createdAt: order } });
      }

      if (filter !== "all") {
        matchFilter["status"] =
          filter === "CANCEL_REQUESTED"
            ? "CANCEL_REQUESTED"
            : { $in: [filter] };
      }

      // Pagination
      pipeLine.push({ $skip: skip });
      pipeLine.push({ $limit: limitNo });
      const countPipeline = [
        ...pipeLine.slice(0, pipeLine.length - 2),

        {
          $count: "totalDocuments",
        },
      ];

      // Execute Aggregations
      const [slots, totalCount] = await Promise.all([
        this.aggregateData(slotSchedule, pipeLine),
        slotSchedule.aggregate(countPipeline),
      ]);

      console.log(slots, "resp", totalCount);
      return { slots: slots, totalDocs: totalCount[0]?.totalDocuments };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async getBookedSession(
    skip: number,
    limitNo: number,
    search: string,
    filter: string,
    sortOrder: string,
    sortField: string,
    tabCond: boolean,
    mentorId: ObjectId
  ): Promise<{ slots: IslotSchedule[] | []; totalDoc: number }> {
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
      if (search) {
        pipeLine.push({
          $match: {
            $or: [
              {
                status: { $regex: search, $options: "i" },
              },
              { description: { $regex: search, $options: "i" } },
              { "user.name": { $regex: search, $options: "i" } },
              { bio: { $regex: search, $options: "i" } },
            ],
          },
        });
      }
      const order = sortOrder === "asc" ? 1 : -1;
      if (sortField === "createdAt") {
        pipeLine.push({ $sort: { createdAt: order } });
      }

      if (filter !== "all") {
        matchFilter["status"] =
          filter === "CANCEL_REQUESTED"
            ? "CANCEL_REQUESTED"
            : { $in: [filter] };
      }

      // Pagination
      pipeLine.push({ $skip: skip });
      pipeLine.push({ $limit: limitNo });
      const countPipeline = [
        ...pipeLine.slice(0, pipeLine.length - 2),

        {
          $count: "totalDocuments",
        },
      ];

      // Execute Aggregations
      const [slots, totalCount] = await Promise.all([
        this.aggregateData(slotSchedule, pipeLine),
        slotSchedule.aggregate(countPipeline),
      ]);

      console.log(slots, "resp", totalCount);
      return { slots: slots, totalDoc: totalCount[0]?.totalDocuments };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
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
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //mentor  make as session completed
  async sessionCompleted(bookingId: string): Promise<IslotSchedule | null> {
    try {
      return this.find_By_Id_And_Update(slotScheduleSchema, bookingId, {
        $set: { status: "COMPLETED" },
      });
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //checking user is alllowed to join session

  async validateSessionJoin(
    sessionId: ObjectId,
    sessionCode: string,
    userId: ObjectId
  ): Promise<IslotSchedule | null> {
    try {
      const result = await this.aggregateData(slotSchedule, [
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
          $match: {
            _id: sessionId,
            sessionCode,
            status: "CONFIRMED",
            $or: [
              {
                menteeId: userId,
              },
              { "slotDetails.mentorId": userId },
            ],
          },
        },
      ]);
      console.log(result[0],'this is the session code and data')
      return result[0];
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  async mentorDashboard(
    platformCommission: number,
    timeRange: string
  ): Promise<IcardData | null> {
    try {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const startOfNextYear = new Date(new Date().getFullYear() + 1, 0, 1);
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const startOfNextMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      );

      const res = (await this.aggregateData(slotSchedule, [
        {
          $facet: {
            totalRevenue: [
              {
                $match: {
                  createdAt: { $gte: startOfYear, $lt: startOfNextYear },
                  status: { $in: ["COMPLETED"] },
                },
              },
              {
                $addFields: {
                  paymentAmountNumeric: { $toDouble: "$paymentAmount" },
                },
              },
              {
                $group: {
                  _id: null,
                  totalRevenue: {
                    $sum: {
                      $multiply: ["$paymentAmountNumeric", platformCommission],
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalRevenue: { $ifNull: ["$totalRevenue", 0] },
                },
              },
            ],

            totalBookings: [
              {
                $match: {
                  createdAt: { $gte: startOfYear, $lt: startOfNextYear },
                  status: {
                    $in: ["CONFIRMED", "REJECTED", "COMPLETED"],
                  },
                },
              },
              { $group: { _id: null, totalBookings: { $sum: 1 } } },
              {
                $project: {
                  _id: 0,
                  totalBookings: { $ifNull: ["$totalBookings", 0] },
                },
              },
            ],

            totalCancelledBookings: [
              {
                $match: {
                  createdAt: { $gte: startOfYear, $lt: startOfNextYear },
                  status: "CANCELLED",
                },
              },
              { $group: { _id: null, totalCancelledBookings: { $sum: 1 } } },
              {
                $project: {
                  _id: 0,
                  totalCancelledBookings: {
                    $ifNull: ["$totalCancelledBookings", 0],
                  },
                },
              },
            ],

            uniqueMentorsThisMonth: [
              {
                $match: {
                  createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
                  status: { $in: ["CONFIRMED", "COMPLETED"] },
                },
              },
              {
                $lookup: {
                  from: "times",
                  localField: "slotId",
                  foreignField: "_id",
                  as: "slotData",
                },
              },
              { $unwind: "$slotData" },
              { $group: { _id: "$slotData.mentorId" } },
              { $count: "uniqueMentors" },
            ],
          },
        },
        {
          $project: {
            totalRevenue: { $arrayElemAt: ["$totalRevenue.totalRevenue", 0] },
            totalBookings: {
              $arrayElemAt: ["$totalBookings.totalBookings", 0],
            },
            totalCancelledBookings: {
              $arrayElemAt: [
                "$totalCancelledBookings.totalCancelledBookings",
                0,
              ],
            },
            uniqueMentorsThisMonth: {
              $arrayElemAt: ["$uniqueMentorsThisMonth.uniqueMentors", 0],
            },
          },
        },
      ])) as IcardData[] | [];

      //  Time-Based Revenue Calculation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const timeFacets: { [key: string]: any[] } = {};

      if (timeRange === "week") {
        timeFacets.weekly = [
          {
            $addFields: {
              week: { $week: "$createdAt" },
              year: { $year: "$createdAt" },
            },
          },
          {
            $group: {
              _id: { week: "$week", year: "$year" },
              totalRevenue: {
                $sum: {
                  $multiply: ["$paymentAmountNumeric", platformCommission],
                },
              },
              totalBookings: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.week": 1 } },
          {
            $project: {
              _id: 0,
              week: "$_id.week",
              year: "$_id.year",
              revenue: "$totalRevenue",
              sessions: "$totalBookings",
            },
          },
        ];
      } else if (timeRange === "month") {
        timeFacets.monthly = [
          {
            $addFields: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
          },
          {
            $group: {
              _id: { month: "$month", year: "$year" },
              totalRevenue: {
                $sum: {
                  $multiply: ["$paymentAmountNumeric", platformCommission],
                },
              },
              totalBookings: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          {
            $project: {
              _id: 0,
              month: "$_id.month",
              year: "$_id.year",
              revenue: "$totalRevenue",
              sessions: "$totalBookings",
            },
          },
        ];
      } else {
        timeFacets.yearly = [
          { $addFields: { year: { $year: "$createdAt" } } },
          {
            $group: {
              _id: "$year",
              totalRevenue: {
                $sum: {
                  $multiply: ["$paymentAmountNumeric", platformCommission],
                },
              },
              totalBookings: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              _id: 0,
              year: "$_id",
              revenue: "$totalRevenue",
              sessions: "$totalBookings",
            },
          },
        ];
      }

      const timeData = await this.aggregateData(slotSchedule, [
        {
          $match: {
            status: { $in: ["CONFIRMED", "REJECTED", "COMPLETED"] },
            createdAt: { $gte: startOfYear },
          },
        },
        {
          $lookup: {
            from: "times",
            localField: "slotId",
            foreignField: "_id",
            as: "slotData",
          },
        },
        { $unwind: "$slotData" },
        {
          $addFields: { paymentAmountNumeric: { $toDouble: "$paymentAmount" } },
        },
        { $facet: timeFacets },
      ]);

      const categoryDistribution = (await this.aggregateData(slotSchedule, [
        { $match: { status: { $in: ["CONFIRMED", "COMPLETED", "REJECTED"] } } },

        {
          $lookup: {
            from: "times",
            localField: "slotId",
            foreignField: "_id",
            as: "slotData",
          },
        },
        { $unwind: "$slotData" },

        {
          $lookup: {
            from: "mentors",
            localField: "slotData.mentorId",
            foreignField: "_id",
            as: "mentorData",
          },
        },
        { $unwind: "$mentorData" },

        {
          $group: {
            _id: "$mentorData.category",
            totalBookings: { $sum: 1 },
          },
        },

        { $sort: { totalBookings: -1 } },

        {
          $project: {
            _id: 0,
            category: "$_id",
            value: "$totalBookings",
          },
        },
      ])) as unknown as IcardData["categoryDistribution"];

      const topMentors = (await this.aggregateData(slotSchedule, [
        {
          $match: {
            status: { $in: ["CONFIRMED", "COMPLETED", "REJECTED"] },
            createdAt: { $gte: startOfYear, $lt: startOfNextYear },
          },
        },
        {
          $lookup: {
            from: "times",
            localField: "slotId",
            foreignField: "_id",
            as: "slotData",
          },
        },
        { $unwind: "$slotData" },

        {
          $lookup: {
            from: "mentors",
            localField: "slotData.mentorId",
            foreignField: "_id",
            as: "mentorData",
          },
        },
        { $unwind: "$mentorData" },
        {
          $lookup: {
            from: "reviews",
            localField: "slotData.mentorId",
            foreignField: "mentorId",
            as: "ratings",
          },
        },
        { $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true } },

        {
          $addFields: { paymentAmountNumeric: { $toDouble: "$paymentAmount" } },
        },
        {
          $group: {
            _id: "$slotData.mentorId",
            mentorName: { $first: "$mentorData.name" },
            category: { $first: "$mentorData.category" },
            totalSessions: { $sum: 1 },
            profileUrl: { $first: "$mentorData.profileUrl" },
            totalRevenue: {
              $sum: {
                $multiply: [
                  "$paymentAmountNumeric",
                  Number(process.env?.MENTOR_COMMISION),
                ],
              },
            },
            averageRating: { $avg: "$ratings.rating" },
          },
        },

        { $sort: { totalSessions: -1 } },
        { $limit: 5 },

        {
          $project: {
            _id: 0,
            mentorId: "$_id",
            mentorName: 1,
            totalSessions: 1,
            totalRevenue: 1,
            category: 1,
            averageRating: 1,
            profileUrl: 1,
          },
        },
      ])) as unknown as IcardData["topMentors"];

      return { ...res[0], ...timeData[0], categoryDistribution, topMentors };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
  //mentor chart data
  async mentorChartData(
    mentorId: ObjectId,
    timeRange: string
  ): Promise<{ mentorChart: ImentorChartData | null }> {
    try {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);

      const startOfNextYear = new Date(new Date().getFullYear() + 1, 0, 1);
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const startOfNextMonth = new Date(
        new Date().getFullYear(),
        (new Date().getMonth() + 1) % 12,
        1
      );
      const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
      const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the current week
      const startOfNextWeek = new Date(startOfWeek.getDate());
      startOfNextWeek.setDate(startOfWeek.getDate() + 7);
      const cardResult = (await this.aggregateData(slotSchedule, [
        {
          $lookup: {
            from: "times",
            localField: "slotId",
            foreignField: "_id",
            as: "slotData",
          },
        },
        {
          $unwind: "$slotData",
        },
        {
          $match: {
            "slotData.mentorId": mentorId,
          },
        },
        {
          $addFields: {
            paymentAmountNumeric: { $toDouble: "$paymentAmount" },
          },
        },
        {
          $facet: {
            // Month Revenue
            currentMonthRevenue: [
              {
                $match: {
                  status: "COMPLETED",
                  createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
                },
              },
              {
                $group: {
                  _id: null,
                  totalRevenue: {
                    $sum: {
                      $multiply: [
                        "$paymentAmountNumeric",
                        Number(process.env.MENTOR_COMMISION),
                      ],
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalRevenue: 1,
                },
              },
            ],

            // Current Month Total Bookings
            currentMonthTotalBookings: [
              {
                $match: {
                  createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
                  status: { $in: ["CONFIRMED", "COMPLETED"] },
                },
              },
              {
                $group: {
                  _id: null,
                  totalBookings: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalBookings: 1,
                },
              },
            ],

            // Current Month Cancelled Bookings
            currentMonthCancelledBookings: [
              {
                $match: {
                  createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
                  status: "CANCELLED",
                },
              },
              {
                $group: {
                  _id: null,
                  totalCancelledBookings: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalCancelledBookings: 1,
                },
              },
            ],

            // Current Day Sessions to Attend
            currentDaySessionsToAttend: [
              {
                $match: {
                  createdAt: { $gte: startOfDay, $lt: endOfDay },
                  status: "CONFIRMED",
                },
              },
              {
                $group: {
                  _id: null,
                  totalSessionsToAttend: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalSessionsToAttend: 1,
                },
              },
            ],
          },
        },
      ])) as unknown as IcardResult[];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const timeFacets: { [key: string]: any[] } = {};

      if (timeRange === "week") {
        timeFacets.period = [
          {
            $addFields: {
              week: { $week: "$createdAt" },
              year: { $year: "$createdAt" },
            },
          },
          {
            $group: {
              _id: { week: "$week", year: "$year" },
              totalRevenue: {
                $sum: {
                  $multiply: [
                    "$paymentAmountNumeric",
                    Number(process.env.MENTOR_COMMISION),
                  ],
                },
              },
              totalBookings: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.week": 1 } },
          {
            $project: {
              _id: 0,
              week: "$_id.week",
              year: "$_id.year",
              revenue: "$totalRevenue",
              sessions: "$totalBookings",
            },
          },
        ];
      } else if (timeRange === "month") {
        timeFacets.period = [
          {
            $addFields: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
          },
          {
            $group: {
              _id: { month: "$month", year: "$year" },
              totalRevenue: {
                $sum: {
                  $multiply: [
                    "$paymentAmountNumeric",
                    Number(process.env.MENTOR_COMMISION),
                  ],
                },
              },
              totalBookings: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          {
            $project: {
              _id: 0,
              month: "$_id.month",
              year: "$_id.year",
              revenue: "$totalRevenue",
              sessions: "$totalBookings",
            },
          },
        ];
      } else {
        timeFacets.period = [
          { $addFields: { year: { $year: "$createdAt" } } },
          {
            $group: {
              _id: "$year",
              totalRevenue: {
                $sum: {
                  $multiply: [
                    "$paymentAmountNumeric",
                    Number(process.env.MENTOR_COMMISION),
                  ],
                },
              },
              totalBookings: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          {
            $project: {
              _id: 0,
              year: "$_id",
              revenue: "$totalRevenue",
              sessions: "$totalBookings",
            },
          },
        ];
      }
      timeFacets.cumulativeSession = [
        {
          $addFields: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
        },
        {
          $group: {
            _id: { month: "$month", year: "$year" },
            revenue: {
              $sum: {
                $multiply: [
                  "$paymentAmountNumeric",
                  Number(process.env.MENTOR_COMMISION),
                ],
              },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
          $setWindowFields: {
            partitionBy: "$_id.year",
            sortBy: { "_id.month": 1 },
            output: {
              cumulativeRevenue: {
                $sum: "$revenue",
                window: {
                  documents: ["unbounded", "current"],
                },
              },
            },
          },
        },
        {
          $project: {
            month: "$_id.month",
            year: "$_id.year",
            revenue: 1,
            cumulativeRevenue: 1,
            _id: 0,
          },
        },
      ];
      const timeData = (await this.aggregateData(slotSchedule, [
        {
          $lookup: {
            from: "times",
            localField: "slotId",
            foreignField: "_id",
            as: "slotData",
          },
        },
        {
          $unwind: "$slotData",
        },
        {
          $match: {
            "slotData.mentorId": mentorId,
            status: "COMPLETED",
            "slotData.startDate": { $gte: startOfYear },
          },
        },
        {
          $addFields: {
            paymentAmountNumeric: { $toDouble: "$paymentAmount" },
          },
        },
        { $facet: timeFacets },
      ])) as unknown as TimeData[];
      const topMentors = (await this.aggregateData(slotSchedule, [
        {
          $match: {
            status: { $in: ["CONFIRMED", "COMPLETED", "REJECTED"] },
            createdAt: { $gte: startOfYear, $lt: startOfNextYear },
          },
        },
        {
          $lookup: {
            from: "times",
            localField: "slotId",
            foreignField: "_id",
            as: "slotData",
          },
        },
        { $unwind: "$slotData" },

        {
          $lookup: {
            from: "mentors",
            localField: "slotData.mentorId",
            foreignField: "_id",
            as: "mentorData",
          },
        },
        { $unwind: "$mentorData" },
        {
          $lookup: {
            from: "reviews",
            localField: "slotData.mentorId",
            foreignField: "mentorId",
            as: "ratings",
          },
        },
        { $unwind: { path: "$ratings", preserveNullAndEmptyArrays: true } },

        {
          $addFields: { paymentAmountNumeric: { $toDouble: "$paymentAmount" } },
        },
        {
          $group: {
            _id: "$slotData.mentorId",
            mentorName: { $first: "$mentorData.name" },
            category: { $first: "$mentorData.category" },
            totalSessions: { $sum: 1 },
            profileUrl: { $first: "$mentorData.profileUrl" },
            totalRevenue: {
              $sum: {
                $multiply: [
                  "$paymentAmountNumeric",
                  Number(process.env?.MENTOR_COMMISION),
                ],
              },
            },
            averageRating: { $avg: "$ratings.rating" },
          },
        },

        { $sort: { totalSessions: -1 } },
        { $limit: 5 },

        {
          $project: {
            _id: 0,
            mentorId: "$_id",
            mentorName: 1,
            totalSessions: 1,
            totalRevenue: 1,
            category: 1,
            averageRating: 1,
            profileUrl: 1,
          },
        },
      ])) as unknown as ItopMentors[];
      const mentorChart = {
        currentMonthRevenue:
          cardResult[0]?.currentMonthRevenue[0]?.totalRevenue ?? 0,
        currentMonthTotalBookings:
          cardResult[0]?.currentMonthTotalBookings[0]?.totalBookings ?? 0,
        currentMonthCancelledBookings:
          cardResult[0]?.currentMonthCancelledBookings[0]
            ?.totalCancelledBookings ?? 0,
        currentDaySessionsToAttend:
          cardResult[0]?.currentDaySessionsToAttend[0]?.totalSessionsToAttend ??
          0,
        period: timeData[0]?.period ?? [],
        cumulativeSession: timeData?.[0]?.cumulativeSession ?? [],
        topMentors: topMentors ?? [],
      };

      return { mentorChart };
    } catch (error: unknown) {
      throw new HttpError(error instanceof Error ? error.message : String(error), Status?.InternalServerError);
    }
  }
}
export default new slotScheduleRepository();
