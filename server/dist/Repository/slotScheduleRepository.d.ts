import { IslotSchedule } from "../Model/slotSchedule";
import { baseRepository } from "./baseRepo";
import { IslotScheduleRepository } from "../Interface/Booking/iSlotScheduleRepository";
import { ObjectId } from "mongoose";
import { InewSlotSchedule } from "../Types";
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
    getBookedSlot(menteeId: ObjectId, tabCond: boolean): Promise<IslotSchedule[] | []>;
    getBookedSession(mentorId: ObjectId, tabCond: boolean): Promise<IslotSchedule[] | []>;
    cancelSlot(sessionId: string, issue: string): Promise<IslotSchedule | null>;
    mentorSlotCancel(sessionId: string, slotValule: string): Promise<IslotSchedule | null>;
    createSessionCode(bookingId: string, sessionCode: string): Promise<string>;
    sessionCompleted(bookingId: string): Promise<IslotSchedule | null>;
    validateSessionJoin(sessionId: string, sessionCode: string): Promise<IslotSchedule | null>;
}
declare const _default: slotScheduleRepository;
export default _default;
//# sourceMappingURL=slotScheduleRepository.d.ts.map