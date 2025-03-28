import { IslotSchedule } from "../Model/slotSchedule";
import { baseRepository } from "./baseRepo";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import { ObjectId } from "mongoose";
import { IcardData, ImentorChartData, InewSlotSchedule } from "../Types";
declare class slotScheduleRepository extends baseRepository<IslotSchedule> implements IslotScheduleRepository {
    constructor();
    newSlotBooking(newSlotSchedule: IslotSchedule): Promise<InewSlotSchedule | null>;
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
    getBookedSlot(userId: ObjectId, tabCond: boolean, userType: "mentee" | "mentor", skip: number, limitNo: number, search: string, sortOrder: string, sortField: string, filter: string): Promise<{
        slots: IslotSchedule[] | [];
        totalDocs: number;
    }>;
    getBookedSession(skip: number, limitNo: number, search: string, filter: string, sortOrder: string, sortField: string, tabCond: boolean, mentorId: ObjectId): Promise<{
        slots: IslotSchedule[] | [];
        totalDoc: number;
    }>;
    cancelSlot(sessionId: string, issue: string): Promise<IslotSchedule | null>;
    mentorSlotCancel(sessionId: string, slotValule: string): Promise<IslotSchedule | null>;
    createSessionCode(bookingId: string, sessionCode: string): Promise<string>;
    sessionCompleted(bookingId: string): Promise<IslotSchedule | null>;
    validateSessionJoin(sessionId: ObjectId, sessionCode: string, userId: ObjectId): Promise<IslotSchedule | null>;
    mentorDashboard(platformCommission: number, timeRange: string): Promise<IcardData | null>;
    mentorChartData(mentorId: ObjectId, timeRange: string): Promise<{
        mentorChart: ImentorChartData | null;
    }>;
}
declare const _default: slotScheduleRepository;
export default _default;
//# sourceMappingURL=slotScheduleRepository.d.ts.map