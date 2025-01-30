import { Itime } from "../Model/timeModel";
import { ItimeSlotRepository } from "../Interface/timeSchedule/iTimeSchedule";
import { baseRepository } from "./baseRepo";
import { DeleteResult, ObjectId } from "mongoose";
declare class timeSlotRepository extends baseRepository<Itime> implements ItimeSlotRepository {
    constructor();
    createTimeSlot(timeSlots: Itime[]): Promise<Itime | undefined>;
    getTimeSlots(mentorId: ObjectId): Promise<Itime[] | []>;
    removeTimeSlot(slotId: string): Promise<DeleteResult | undefined>;
    getMentorSlots(mentorId: string): Promise<Itime[] | []>;
}
declare const _default: timeSlotRepository;
export default _default;
//# sourceMappingURL=timeSlotRepository.d.ts.map