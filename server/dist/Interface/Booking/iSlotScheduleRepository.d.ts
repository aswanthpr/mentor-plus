import { ObjectId } from "mongoose";
import { IslotSchedule } from "src/Model/slotSchedule";
import { InewSlotSchedule } from "src/Types";
export interface IslotScheduleRepository {
    newSlotBooking(newSlotSchedule: InewSlotSchedule): Promise<IslotSchedule | null>;
    getBookedSlot(menteeId: ObjectId, tabCond: boolean): Promise<IslotSchedule[] | []>;
    getBookedSession(menteeId: ObjectId, tabCond: boolean): Promise<IslotSchedule[] | []>;
}
//# sourceMappingURL=iSlotScheduleRepository.d.ts.map