import { Itime } from "../../Model/timeModel";
import { ItimeSlotRepository } from "../interface/iTimeSlotRepository";
import { baseRepository } from "../baseRepo";
import { DeleteResult, ObjectId } from "mongoose";
declare class timeSlotRepository extends baseRepository<Itime> implements ItimeSlotRepository {
    constructor();
    createTimeSlot(timeSlots: Itime[]): Promise<Itime[] | []>;
    getTimeSlots(mentorId: ObjectId, limit: number, skip: number, search: string, filter: string, sortField: string, sortOrder: string): Promise<{
        timeSlots: Itime[] | [];
        totalDocs: number;
    }>;
    removeTimeSlot(slotId: string): Promise<DeleteResult | undefined>;
    getMentorSlots(mentorId: string): Promise<Itime[] | []>;
    makeTimeSlotBooked(slotId: string): Promise<Itime | null>;
    checkTimeSlots(mentorId: ObjectId, startDate: Date, endDate: Date): Promise<Itime[] | []>;
    releaseTimeSlot(slotId: string): Promise<Itime | null>;
}
declare const _default: timeSlotRepository;
export default _default;
//# sourceMappingURL=timeSlotRepository.d.ts.map