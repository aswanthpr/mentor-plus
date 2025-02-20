import { ObjectId } from "mongoose";
import { IslotSchedule } from "src/Model/slotSchedule";
import { InewSlotSchedule } from "src/Types";
export interface IslotScheduleRepository {
    newSlotBooking(newSlotSchedule: InewSlotSchedule): Promise<InewSlotSchedule | null>;
    getBookedSlot(menteeId: ObjectId, tabCond: boolean): Promise<IslotSchedule[] | []>;
    getBookedSession(menteeId: ObjectId, tabCond: boolean): Promise<IslotSchedule[] | []>;
    cancelSlot(sessionId: string, issue: string): Promise<IslotSchedule | null>;
    mentorSlotCancel(sessionId: string, slotValule: string): Promise<IslotSchedule | null>;
}
//# sourceMappingURL=iSlotScheduleRepository.d.ts.map