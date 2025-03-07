import { ObjectId } from "mongoose";
import { IslotSchedule } from "../../Model/slotSchedule";
import { InewSlotSchedule } from "../../Types";
export interface IslotScheduleRepository {
    newSlotBooking(newSlotSchedule: InewSlotSchedule): Promise<InewSlotSchedule | null>;
    getBookedSlot(menteeId: ObjectId, tabCond: boolean): Promise<IslotSchedule[] | []>;
    getBookedSession(menteeId: ObjectId, tabCond: boolean): Promise<IslotSchedule[] | []>;
    cancelSlot(sessionId: string, issue: string): Promise<IslotSchedule | null>;
    mentorSlotCancel(sessionId: string, slotValule: string): Promise<IslotSchedule | null>;
    createSessionCode(bookingId: string, sessionCode: string): Promise<string>;
    sessionCompleted(bookingId: string): Promise<IslotSchedule | null>;
    validateSessionJoin(sessionId: string, sessionCode: string): Promise<IslotSchedule | null>;
}
//# sourceMappingURL=iSlotScheduleRepository.d.ts.map