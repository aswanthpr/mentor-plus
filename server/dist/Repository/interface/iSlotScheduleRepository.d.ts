import { ObjectId } from "mongoose";
import { IslotSchedule } from "../../Model/slotSchedule";
import { IcardData, ImentorChartData, InewSlotSchedule } from "../../Types";
export interface IslotScheduleRepository {
    newSlotBooking(newSlotSchedule: InewSlotSchedule): Promise<InewSlotSchedule | null>;
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
    mentorDashboard(platformCommision: number, timeRange: string): Promise<IcardData | null>;
    mentorChartData(mentorId: ObjectId, timeRange: string): Promise<{
        mentorChart: ImentorChartData | null;
    }>;
}
//# sourceMappingURL=iSlotScheduleRepository.d.ts.map