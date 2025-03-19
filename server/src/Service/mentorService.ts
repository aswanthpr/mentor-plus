import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RRule } from "rrule";
import {
  genAccesssToken,
  genRefreshToken,
  verifyRefreshToken,
} from "../Utils/jwt.utils";
import { IcheckedSlot, ISchedule, ISlots } from "../Types";
import { Itime, slot } from "../Model/timeModel";
import { Imentor } from "../Model/mentorModel";
import hash_pass from "../Utils/hashPass.util";
import { Iquestion } from "../Model/questionModal";
import { Icategory } from "../Model/categorySchema";
import { uploadFile, uploadImage } from "../Config/cloudinary.util";
import { ImentorService } from "../Interface/Mentor/iMentorService";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { IcategoryRepository } from "../Interface/Category/iCategoryRepository";
import { IquestionRepository } from "../Interface/Qa/IquestionRepository";
import { WeekdayString } from "../Types/types";
import { ObjectId } from "mongoose";
import { ItimeSlotRepository } from "../Interface/Booking/iTimeSchedule";
import { Status } from "../Utils/httpStatusCode";
import moment from "moment";
import { checkForOverlap } from "../Utils/reusable.util";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";

export class mentorService implements ImentorService {
  constructor(
    private _mentorRepository: ImentorRepository,
    private _categoryRepository: IcategoryRepository,
    private _questionRepository: IquestionRepository,
    private _timeSlotRepository: ItimeSlotRepository,
    private readonly _slotScheduleRepository:IslotScheduleRepository,
  ) {}

  async mentorProfile(token: string): Promise<{
    success: boolean;
    message: string;
    result: Imentor | null;
    status: number;
    categories: Icategory[] | [];
  }> {
    try {
      const decode = jwt.verify(
        token,
        process.env?.JWT_ACCESS_SECRET as string
      ) as { userId: string };

      if (!decode) {
        return {
          success: false,
          message: "Your session has expired. Please log in again.",
          status: 403,
          result: null,
          categories: [],
        };
      }

      const result = await this._mentorRepository.findMentorById(
        decode?.userId
      );
      if (!result) {
        return {
          success: false,
          message: "invalid credential",
          status: 204,
          result: null,
          categories: [],
        };
      }
      const categoryData = await this._categoryRepository.allCategoryData();
      if (!categoryData) {
        return {
          success: false,
          message: "invalid credential",
          status: 204,
          result: null,
          categories: [],
        };
      }

      return {
        success: true,
        message: "successfull",
        status: 200,
        result: result,
        categories: categoryData,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while bl metneeProfile in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //mentor refresh token
  async mentorRefreshToken(refresh: string): Promise<{
    success: boolean;
    message: string;
    status: number;
    accessToken?: string;
    refreshToken?: string;
  }> {
    try {
      if (!refresh) {
        return {
          success: false,
          message: "You are not authorized. Please log in.",
          status: 401,
        };
      }

      const decode = verifyRefreshToken(refresh);

      if (!decode || !decode.userId) {
        return {
          success: false,
          message: "You are not authorized. Please log in.",
          status: 401,
        };
      }
      const { userId } = decode;

      const accessToken: string | undefined = genAccesssToken(userId as string,"mentor");

      const refreshToken: string | undefined = genRefreshToken(
        userId as string,"mentor"
      );

      return {
        success: true,
        message: "Token refresh successfully",
        accessToken,
        refreshToken,
        status: 200,
      };
    } catch (error: unknown) {
      console.error("Error while generating BLRefreshToken", error);
      return {
        success: false,
        message: "An internal server error occurred. Please try again later.",
        status: 500,
      };
    }
  }
  //mentor password change logic
  async passwordChange(
    currentPassword: string,
    newPassword: string,
    id: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!currentPassword || !newPassword || !id) {
        return {
          success: false,
          message: "Please provide all required credentials.",
          status: 400,
        };
      }
      if (currentPassword == newPassword) {
        return {
          success: false,
          message: "New password cannot be the same as the current password.",
          status: 400,
        };
      }
      const result = await this._mentorRepository.findMentorById(id);
      if (!result) {
        return {
          success: false,
          message: "User not found. Please check your credentials.",
          status: 404,
        };
      }

      const passCompare = await bcrypt.compare(
        currentPassword,
        `${result?.password}`
      );
      if (!passCompare) {
        return {
          success: false,
          message: "Incorrect current password. Please try again.",
          status: 401,
        };
      }
      const hashedPassword = await hash_pass(newPassword);
      const response = await this._mentorRepository.changeMentorPassword(
        id,
        hashedPassword
      );

      if (!response) {
        return {
          success: false,
          message: "Failed to update the password. Please try again later.",
          status: 503,
        };
      }
      return {
        success: true,
        message: "Password updated successfully.",
        status: 200,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error during password change${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //metnor profile image change

  async mentorProfileImageChange(
    image: Express.Multer.File | null,
    id: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    profileUrl?: string;
  }> {
    try {
      if (!image || !id) {
        return {
          success: false,
          message: "Image or ID is missing, please provide both.",
          status: Status.BadRequest,
        };
      }
      const profileUrl = await uploadImage(image?.buffer);
      if (!profileUrl) {
        return {
          success: false,
          message: "Failed to upload the image, please try again later.",
          status: Status.InternalServerError,
        };
      }
      // const currentPublicId = this.extractPublicIdFromCloudinaryUrl(currentProfile.profileUrl);

      // // If there's an existing image, delete it from Cloudinary
      // if (currentPublicId) {
      //   const deleteResult = await cloudinary.v2.uploader.destroy(currentPublicId);
      //   if (deleteResult.result !== 'ok') {
      //     return {
      //       success: false,
      //       message: "Failed to delete the old image from Cloudinary.",
      //       status: 500,
      //     };
      //   }
      // }

      const result = await this._mentorRepository.changeMentorProfileImage(
        profileUrl,
        id
      );

      if (!result) {
        return {
          success: false,
          message: "Mentor not found with the provided ID.",
          status: Status.NotFound,
        };
      }
      return {
        success: true,
        message: "Profile image updated successfully.",
        status: Status.Ok,
        profileUrl: result.profileUrl,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while bl metnee Profile  change in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async mentorEditProfile(
    mentorData: Imentor,
    resume: Express.Multer.File
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result: Imentor | null;
  }> {
    try {
      const {
        _id,
        name,
        email,
        phone,
        jobTitle,
        category,
        linkedinUrl,
        githubUrl,
        bio,
        skills,
      } = mentorData;
      console.log("\x1b[32m%s\x1b[0m", _id);

      if (
        !name ||
        !email ||
        !jobTitle ||
        !category ||
        !linkedinUrl ||
        !githubUrl ||
        !bio ||
        !skills
      ) {
        return {
          success: false,
          message: "credential is missing",
          status: 400,
          result: null,
        };
      }
      const existingMentor = await this._mentorRepository.findMentorById(
        `${_id}`
      );

      if (!existingMentor) {
        return {
          success: false,
          message: "Mentor not existing",
          status: 404,
          result: null,
        };
      }
      const updatedData: Partial<Imentor> = {};
      if (existingMentor) updatedData.skills = skills;
      if (existingMentor._id) updatedData._id = existingMentor._id;
      if (existingMentor.name !== name) updatedData.name = name;
      if (existingMentor.email !== email) updatedData.email = email;
      if (existingMentor.phone !== phone) updatedData.phone = phone;
      if (existingMentor.jobTitle !== jobTitle) updatedData.jobTitle = jobTitle;
      if (existingMentor.category !== category) updatedData.category = category;
      if (existingMentor.linkedinUrl !== linkedinUrl)
        updatedData.linkedinUrl = linkedinUrl;
      if (existingMentor.githubUrl !== githubUrl)
        updatedData.githubUrl = githubUrl;
      if (existingMentor.bio !== bio) updatedData.bio = bio;

      if (resume) {
        const fileUrl = await uploadFile(resume.buffer, resume.originalname);
        if (!fileUrl) {
          throw new Error("Error while uploading resume");
        }
        updatedData.resume = fileUrl;
      } else {
        updatedData.resume = existingMentor.resume;
      }

      const result = await this._mentorRepository.updateMentorById(updatedData);

      if (!result) {
        return {
          success: false,
          message: "unable to update",
          status: 404,
          result: null,
        };
      }

      return {
        success: true,
        message: "Details changed Successfully!",
        status: 200,
        result: result,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while  mentor Profile  edit details in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async homeData(filter: string,search:string,page:number,limit:number): Promise<{
    success: boolean;
    message: string;
    status: number;
    homeData: Iquestion[] | [],
    totalPage:number
    ;
  }> {
    try {
      console.log(filter,search,page,limit)
      if (!filter||!page||
        !limit
      ) {
        return {
          success: false,
          message: "credentials not found",
          status: 400,
          homeData: [],
          totalPage:0
        };
      }
      const pageNo = page||1;
      const limitNo = limit||6;
      const skip = (pageNo-1)*limitNo;

      const response = await this._questionRepository.allQuestionData(filter,search,skip,limit);
      const totalPage = Math.ceil(response?.count / limitNo);
      return {
        success: true,
        message: "Data successfully fetched",
        status: 200,
        homeData: response?.question,
        totalPage
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while  mentor home data fetching in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async createTimeSlots(
    type: string,
    schedule: unknown,
    mentorId: ObjectId
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    timeSlots: Itime[] | [];
  }> {
    try {
      let result: Itime[] = [];
      const timeSlotsToInsert: Itime[] = [];
      if (type === "recurring") {
        const { endDate, price, selectedDays, startDate, slots } =
          schedule as ISlots;

        if (
          !type ||
          !price ||
          !startDate ||
          slots.length === 0 ||
          !endDate ||
          selectedDays?.length == 0
        ) {
          console.log("haiiiii")
          return {
            success: false,
            message: "crdential not found",
            status: Status?.BadRequest,
            timeSlots: [],
          };
        }
        let res: slot[] = [];
        const checkedSlots = await this._timeSlotRepository.checkTimeSlots(
          mentorId,
          new Date(startDate),
          new Date(endDate)
        );
        console.log(checkedSlots)
        if (checkedSlots.length > 0) {
          res = checkForOverlap(checkedSlots as IcheckedSlot[], slots);
        }
        if (checkedSlots.length>0&&res.length == 0) {
          console.log("00000000000000000000")
          return {
            success: false,
            message: "all time periods are  duplicates ",
            status: Status?.BadRequest,
            timeSlots: [],
          };
        }

        const today = new Date();
        const startDateStr = new Date(startDate);
        const endDateStr = new Date(endDate!);

        if (startDateStr < today) {
          console.log("1111111111111111111")
          return {
            success: false,
            message: "Start date cannot be in the past.",
            status: Status.Ok,
            timeSlots: [],
          };
        }

        // Ensure endDate is after startDate
        if (endDateStr.getTime() <= startDateStr.getTime()) {
          console.log("2222222222222222")
          return {
            success: false,
            message: "The time duration must be between 30 and 60 minutes.",
            status: Status.Ok,
            timeSlots: [],
          };
        }

        const dayMap = {
          Monday: RRule.MO,
          Tuesday: RRule.TU,
          Wednesday: RRule.WE,
          Thursday: RRule.TH,
          Friday: RRule.FR,
          Saturday: RRule.SA,
          Sunday: RRule.SU,
        };
        const byWeekdays = (selectedDays as WeekdayString[]).map(
          (day: WeekdayString) => dayMap[day]
        );

        const rrule = new RRule({
          freq: RRule.WEEKLY,
          dtstart: new Date(startDate),
          until: new Date(endDate ?? ""),
          byweekday: byWeekdays,
          interval: 1,
        });

        const recurringDates = rrule.all();

        recurringDates.forEach((date) => {
          (res.length>0? res: slots).forEach((slot) => {
            const dateStr = date.toISOString();

            const start = moment(
              `${dateStr.split("T")[0]} ${slot?.startTime}`,
              "YYYY-MM-DD HH:mm:ss"
            );
            const end = moment(
              `${dateStr.split("T")[0]} ${slot?.endTime}`,
              "YYYY-MM-DD HH:mm:ss"
            );
            const duration = moment.duration(end.diff(start));
            const minutesDifference = duration.asMinutes();

            if (minutesDifference < 30 || minutesDifference > 60) {
              console.log("333333333333333")
              return {
                success: false,
                message: "The time duration must be between 30 and 60 minutes.",
                status: Status.Ok,
                timeSlots: [],
              };
            }
            if (end.isBefore(start)) {
              console.log("44444444444444")
              return {
                success: false,
                message: "The End Time is Befor Start Time",
                status: Status.Ok,
                timeSlots: [],
              };
            }
            const startStr = start.format("YYYY-MM-DDTHH:mm:ss");
            const endStr = end.format("YYYY-MM-DDTHH:mm:ss");

            const timeSlot = {
              startDate: date,
              slots: [
                {
                  startTime: startStr,
                  endTime: endStr,
                },
              ],
              price,
              mentorId,
              duration: minutesDifference,
            };
            timeSlotsToInsert.push(timeSlot as unknown as Itime);
          });
        });

        result = await this._timeSlotRepository.createTimeSlot(
          timeSlotsToInsert
        );
      } else {

        for (const entry of schedule as ISchedule[]) {
          const { slots, price, startDate } = entry;
console.log("slot:",slots,"price",price,"strtDAte",startDate,entry)
          if (!price || !startDate || !mentorId) {
            return {
              success: false,
              message: "credential missing",
              status: Status.BadRequest,
              timeSlots: [],
            };
          }
          let res: slot[] = [];
          const checkedSlots = await this._timeSlotRepository.checkTimeSlots(
            mentorId,
            new Date(`${startDate}T00:00:00.000Z`),
            new Date(`${startDate}T23:59:59.999Z`),
          );
          if (checkedSlots.length > 0) {
            res = checkForOverlap(checkedSlots as IcheckedSlot[], slots);
          }
          if (checkedSlots.length>0&&res.length == 0) {
            return {
              success: false,
              message: "all time periods are  duplicates ",
              status: Status?.BadRequest,
              timeSlots: [],
            };
          }

          const givenDate = moment(startDate, "YYYY-MM-DD");
          const currentDate = moment().startOf("day");

          if (givenDate.isBefore(currentDate)) {
            return {
              success: false,
              message: " The given date is in the past.",
              status: Status.BadRequest,
              timeSlots: [],
            };
          }

          const entrySlots = (res.length>0? res: slots).map((slot: slot) => {
            const start = moment(
              `${startDate} ${slot?.startTime}`,
              "YYYY-MM-DD HH:mm:ss"
            );
            const end = moment(
              `${startDate} ${slot?.endTime}`,
              "YYYY-MM-DD HH:mm:ss"
            );
            console.log(start, "11111111111111111111111111", end);
            const duration = moment.duration(end.diff(start));
            if (!duration) {
              return {
                success: false,
                message: "Time difference is not in between 20 to 60.",
                status: Status.BadRequest,
                timeSlots: [],
              };
            }

            const minutesDifference = duration.asMinutes();
            console.log(
              start,
              "start",
              "end:",
              end,
              "minutesDifference:",
              minutesDifference
            );

            if (minutesDifference < 30 || minutesDifference > 60) {
              return {
                success: false,
                message: "The time duration must be between 30 and 60 minutes.",
                status: Status.Ok,
                timeSlots: [],
              };
            }

            if (end.isBefore(start)) {
              return {
                success: false,
                message: "The End Time is Befor Start Time",
                status: Status.Ok,
                timeSlots: [],
              };
            }

            // Create a date string in ISO format

            const startStr = start.format("YYYY-MM-DDTHH:mm:ss");
            const endStr = end.format("YYYY-MM-DDTHH:mm:ss");

            console.log(
              start.format("YYYY-MM-DDTHH:mm:ss"),
              end.format("YYYY-MM-DDTHH:mm:ss"),

              end.toISOString(),
              "this is the time i converted",
              startStr,
              endStr
            );
            const startDateInDate = new Date(startDate);

            return {
              startDate: startDateInDate,
              slots: [
                {
                  startTime: startStr,
                  endTime: endStr,
                },
              ],
              price,
              mentorId,
              duration: minutesDifference,
            };
          });
          timeSlotsToInsert.push(...(entrySlots as unknown as Itime[]));
        }
      }
      result = await this._timeSlotRepository.createTimeSlot(timeSlotsToInsert);
      console.log(result, "thsi is the result ");
      if (!result) {
        console.log("555555555555")
        return {
          success: false,
          message: "error while slot creating ",
          status: Status.BadRequest,
          timeSlots: [],
        };
      }
      return {
        success: true,
        message: "slot created successfully",
        status: Status.Ok,
        timeSlots: result,
      };
    } catch (error: unknown) {
      throw new Error(
        `"\x1b[33m%s\x1b[0m",Error while mentor creating timeSlots in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async getTimeSlots(mentorId: ObjectId): Promise<{
    success: boolean;
    message: string;
    status: number;
    timeSlots: Itime[] | [];
  }> {
    try {
      if (!mentorId) {
        return {
          success: false,
          message: "credentials not found",
          status: Status.BadRequest,
          timeSlots: [],
        };
      }
      const response = await this._timeSlotRepository.getTimeSlots(mentorId);
      return {
        success: true,
        message: "Data successfully fetched",
        status: Status.Ok,
        timeSlots: response,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while  get time slots in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async removeTimeSlot(
    slotId: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!slotId) {
        return {
          success: false,
          message: "credentials not found",
          status: Status.BadRequest,
        };
      }
      const result = await this._timeSlotRepository.removeTimeSlot(slotId);
      if (!result?.acknowledged || result.deletedCount === 0) {
        return {
          success: false,
          message: "Slot not found or removal failed.",
          status: Status.NotFound,
        };
      }
      console.log(result, "result");
      return {
        success: true,
        message: "successfully removed",
        status: Status.Ok,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while  remove slots  in service: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  async mentorChartData(
    mentorId:ObjectId,timeRange: string
  ): Promise<{ success: boolean; message: string; status: number }> {
    try {
      if (!timeRange) {
        return {
          success: false,
          message: "credentials not found",
          status: Status.BadRequest,
        };
      }
     console.log(timeRange,'timerange');
     const result  = await  this._slotScheduleRepository.mentorChartData(mentorId,timeRange);
     console.log(result,'ressult')
      return {
        success: true,
        message: "successfully removed",
        status: Status.Ok,
      };
    } catch (error: unknown) {
      throw new Error(
        `Error while while finding chart data: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
