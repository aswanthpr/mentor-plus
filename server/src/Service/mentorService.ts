import bcrypt from "bcrypt";
import { RRule } from "rrule";
import {
  genAccesssToken,
  genRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hash_pass,
  checkForOverlap,
  createSkip,
  HttpError
} from "../Utils/index";
import { IcheckedSlot, ImentorChartData, ISchedule, ISlots } from "../Types";
import { Itime, slot } from "../Model/timeModel";
import { Imentor } from "../Model/mentorModel";

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
import { Status } from "../Constants/httpStatusCode";
import moment from "moment";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import { HttpResponse } from "../Constants/httpResponse";
import { MentorDTO } from "../dto/mentor/mentorDTO";

export class mentorService implements ImentorService {
  constructor(
    private _mentorRepository: ImentorRepository,
    private _categoryRepository: IcategoryRepository,
    private _questionRepository: IquestionRepository,
    private _timeSlotRepository: ItimeSlotRepository,
    private readonly _slotScheduleRepository: IslotScheduleRepository
  ) {}

  async mentorProfile(token: string): Promise<{
    success: boolean;
    message: string;
    result: MentorDTO | null;
    status: number;
    categories: Icategory[] | [];
  }> {
    try {
      const decode = verifyAccessToken(token, "mentor");

      if (!decode?.result?.userId) {
        return {
          success: false,
          message: HttpResponse?.UNAUTHORIZED,
          status: Status?.Forbidden,
          result: null,
          categories: [],
        };
      }

      const result = await this._mentorRepository.findMentorById(
        decode?.result?.userId
      );
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.NoContent,
          result: null,
          categories: [],
        };
      }
      const categoryData = await this._categoryRepository.allCategoryData();
      if (!categoryData) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.NoContent,
          result: null,
          categories: [],
        };
      }
      const mentorDTO = MentorDTO.single(result);
      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status?.Ok,
        result: mentorDTO,
        categories: categoryData,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
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
          message: HttpResponse?.UNAUTHORIZED,
          status: Status?.Unauthorized,
        };
      }

      const decode = verifyRefreshToken(refresh, "mentor");

      if (
        !decode?.isValid ||
        !decode?.result?.userId ||
        decode?.error == "TamperedToken" ||
        decode?.error == "TokenExpired"
      ) {
        return {
          success: false,
          message: HttpResponse?.UNAUTHORIZED,
          status: Status?.Unauthorized,
        };
      }

      const userId = decode?.result?.userId;

      const accessToken: string | undefined = genAccesssToken(
        userId as string,
        "mentor"
      );

      const refreshToken: string | undefined = genRefreshToken(
        userId as string,
        "mentor"
      );

      return {
        success: true,
        message: HttpResponse?.TOKEN_GENERATED,
        accessToken,
        refreshToken,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
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
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
        };
      }
      if (currentPassword == newPassword) {
        return {
          success: false,
          message: HttpResponse?.NEW_PASS_REQUIRED,
          status: Status?.BadRequest,
        };
      }
      const result = await this._mentorRepository.findMentorById(id);
      if (!result) {
        return {
          success: false,
          message: HttpResponse?.USER_NOT_FOUND,
          status: Status?.NotFound,
        };
      }

      const passCompare = await bcrypt.compare(
        currentPassword,
        `${result?.password}`
      );
      if (!passCompare) {
        return {
          success: false,
          message: HttpResponse?.PASSWORD_INCORRECT,
          status: Status?.BadRequest,
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
          message: HttpResponse?.FAILED,
          status: Status?.BadRequest,
        };
      }
      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status?.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
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
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
        };
      }
      const profileUrl = await uploadImage(image?.buffer);
      if (!profileUrl) {
        return {
          success: false,
          message: HttpResponse?.FAILED,
          status: Status.InternalServerError,
        };
      }

      const result = await this._mentorRepository.changeMentorProfileImage(
        profileUrl,
        id
      );

      if (!result) {
        return {
          success: false,
          message: HttpResponse?.USER_NOT_FOUND,
          status: Status.NotFound,
        };
      }
      return {
        success: true,
        message: HttpResponse?.PROFILE_PICTURE_CHANGED,
        status: Status.Ok,
        profileUrl: result.profileUrl,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
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
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          result: null,
        };
      }
      const existingMentor = await this._mentorRepository.findMentorById(
        `${_id}`
      );

      if (!existingMentor) {
        return {
          success: false,
          message: HttpResponse?.USER_NOT_FOUND,
          status: Status?.NotFound,
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
          message: HttpResponse?.FAILED,
          status: Status?.NotFound,
          result: null,
        };
      }

      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status?.Ok,
        result: result,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async questionData(
    filter: string,
    search: string,
    sortField: string,
    sortOrder: string,
    page: number,
    limit: number
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    homeData: Iquestion[] | [];
    totalPage: number;
  }> {
    try {
      if (!filter || page < 1 || limit < 1 || !sortField || !sortOrder) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status?.BadRequest,
          homeData: [],
          totalPage: 0,
        };
      }
      const pageNo = page || 1;
      const limitNo = limit || 6;
      const skip = (pageNo - 1) * limitNo;

      const response = await this._questionRepository.allQuestionData(
        filter,
        search,
        sortOrder,
        sortField,
        skip,
        limit
      );

      const totalPage = Math.ceil(response?.count / limitNo);
      return {
        success: true,
        message: HttpResponse?.DATA_RETRIEVED,
        status: Status?.Ok,
        homeData: response?.question,
        totalPage,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
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
          return {
            success: false,
            message: HttpResponse?.INVALID_CREDENTIALS,
            status: Status?.BadRequest,
            timeSlots: [],
          };
        }

        const checkedSlots = await this._timeSlotRepository.checkTimeSlots(
          mentorId,
          new Date(startDate),
          new Date(endDate)
        );

        const res = checkForOverlap(checkedSlots as IcheckedSlot[], slots);

        const today = new Date();
        const startDateStr = new Date(startDate);
        const endDateStr = new Date(endDate!);

        if (startDateStr < today) {
          return {
            success: false,
            message: HttpResponse?.START_DATE_CANNOT_BE_PAST,
            status: Status.Ok,
            timeSlots: [],
          };
        }

        // Ensure endDate is after startDate
        if (endDateStr.getTime() <= startDateStr.getTime()) {
          return {
            success: false,
            message: HttpResponse?.DURATION_DIFFERNT_REQUIRED,
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
          res.forEach((slot) => {
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
              return {
                success: false,
                message: HttpResponse?.DURATION_DIFFERNT_REQUIRED,
                status: Status.Ok,
                timeSlots: [],
              };
            }
            if (end.isBefore(start)) {
              return {
                success: false,
                message: HttpResponse?.END_TIME_PAST,
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
      } else {
        for (const entry of schedule as ISchedule[]) {
          const { slots, price, startDate } = entry;

          if (!price || !startDate || !mentorId) {
            return {
              success: false,
              message: HttpResponse?.INVALID_CREDENTIALS,
              status: Status.BadRequest,
              timeSlots: [],
            };
          }

          const checkedSlots = await this._timeSlotRepository.checkTimeSlots(
            mentorId,
            new Date(`${startDate}T00:00:00.000Z`),
            new Date(`${startDate}T23:59:59.999Z`)
          );

          const res = checkForOverlap(checkedSlots as IcheckedSlot[], slots);

          const givenDate = moment(startDate, "YYYY-MM-DD");
          const currentDate = moment().startOf("day");

          if (givenDate.isBefore(currentDate)) {
            return {
              success: false,
              message: HttpResponse?.DATE_CANNOT_BE_PAST,
              status: Status.BadRequest,
              timeSlots: [],
            };
          }

          const entrySlots = res.map((slot: slot) => {
            const start = moment(
              `${startDate} ${slot?.startTime}`,
              "YYYY-MM-DD HH:mm:ss"
            );
            const end = moment(
              `${startDate} ${slot?.endTime}`,
              "YYYY-MM-DD HH:mm:ss"
            );

            const duration = moment.duration(end.diff(start));
            if (!duration) {
              return {
                success: false,
                message: HttpResponse?.TIME_DIFF_REQUIRED,
                status: Status.BadRequest,
                timeSlots: [],
              };
            }

            const minutesDifference = duration.asMinutes();

            if (minutesDifference < 30 || minutesDifference > 60) {
              return {
                success: false,
                message: HttpResponse?.DURATION_DIFFERNT_REQUIRED,
                status: Status.Ok,
                timeSlots: [],
              };
            }

            if (end.isBefore(start)) {
              return {
                success: false,
                message: HttpResponse?.END_TIME_PAST,
                status: Status.Ok,
                timeSlots: [],
              };
            }

            // Create a date string in ISO format

            const startStr = start.format("YYYY-MM-DDTHH:mm:ss");
            const endStr = end.format("YYYY-MM-DDTHH:mm:ss");
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
      if (timeSlotsToInsert.length === 0) {
        return {
          success: false,
          message: HttpResponse?.NO_SLOT_AVAIL_TO_CREATE,
          status: Status.Ok,
          timeSlots: [],
        };
      }

      result = await this._timeSlotRepository.createTimeSlot(timeSlotsToInsert);

      if (!result) {
        return {
          success: false,
          message: HttpResponse?.FAILED,
          status: Status.BadRequest,
          timeSlots: [],
        };
      }
      return {
        success: true,
        message: HttpResponse?.SLOTS_CREATED,
        status: Status.Ok,
        timeSlots: result,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async getTimeSlots(
    mentorId: ObjectId,
    limit: number,
    page: number,
    search: string,
    filter: string,
    sortField: string,
    sortOrder: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    timeSlots: Itime[] | [];
    totalPage: number;
  }> {
    try {
      if (
        !mentorId ||
        !filter ||
        !sortField ||
        !sortOrder ||
        limit < 1 ||
        page < 1
      ) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          timeSlots: [],
          totalPage: 0,
        };
      }

      const skipData = createSkip(page, limit);
      const limitNo = skipData?.limitNo;
      const skip = skipData?.skip;

      const response = await this._timeSlotRepository.getTimeSlots(
        mentorId,
        limitNo,
        skip,
        search,
        filter,
        sortField,
        sortOrder
      );
      const totalPage = Math.ceil(response?.totalDocs / limitNo);
      return {
        success: true,
        message: HttpResponse?.DATA_RETRIEVED,
        status: Status.Ok,
        timeSlots: response?.timeSlots,
        totalPage,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
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
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
        };
      }
      const result = await this._timeSlotRepository.removeTimeSlot(slotId);
      if (!result?.acknowledged || result.deletedCount === 0) {
        return {
          success: false,
          message: HttpResponse?.FAILED,
          status: Status.NotFound,
        };
      }

      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status.Ok,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
  async mentorChartData(
    mentorId: ObjectId,
    timeRange: string
  ): Promise<{
    success: boolean;
    message: string;
    status: number;
    result: ImentorChartData | null;
  }> {
    try {
      if (!timeRange) {
        return {
          success: false,
          message: HttpResponse?.INVALID_CREDENTIALS,
          status: Status.BadRequest,
          result: null,
        };
      }

      const result = await this._slotScheduleRepository.mentorChartData(
        mentorId,
        timeRange
      );

      return {
        success: true,
        message: HttpResponse?.SUCCESS,
        status: Status.Ok,
        result: result?.mentorChart,
      };
    } catch (error: unknown) {
      throw new HttpError(
        error instanceof Error ? error.message : String(error),
        Status?.InternalServerError
      );
    }
  }
}
