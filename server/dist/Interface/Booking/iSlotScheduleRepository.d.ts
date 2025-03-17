import { ObjectId } from "mongoose";
import { IslotSchedule } from "../../Model/slotSchedule";
import { IcardData, InewSlotSchedule } from "../../Types";
export interface IslotScheduleRepository {
    newSlotBooking(newSlotSchedule: InewSlotSchedule): Promise<InewSlotSchedule | null>;
    getBookedSlot(userId: ObjectId, tabCond: boolean, userType: "mentee" | "mentor"): Promise<IslotSchedule[] | []>;
    getBookedSession(menteeId: ObjectId, tabCond: boolean): Promise<IslotSchedule[] | []>;
    cancelSlot(sessionId: string, issue: string): Promise<IslotSchedule | null>;
    mentorSlotCancel(sessionId: string, slotValule: string): Promise<IslotSchedule | null>;
    createSessionCode(bookingId: string, sessionCode: string): Promise<string>;
    sessionCompleted(bookingId: string): Promise<IslotSchedule | null>;
    validateSessionJoin(sessionId: string, sessionCode: string): Promise<IslotSchedule | null>;
    mentorDashboard(platformCommision: number, timeRange: string): Promise<IcardData | null>;
    mentorChartData(mentorId: ObjectId, timeRange: string): Promise<void>;
}
//# sourceMappingURL=iSlotScheduleRepository.d.ts.map