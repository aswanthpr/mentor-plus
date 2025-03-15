import { Itime } from "../Model/timeModel";
import { ItimeSlotRepository } from "../Interface/Booking/iTimeSchedule";
import { baseRepository } from "./baseRepo";
import { DeleteResult, ObjectId } from "mongoose";
declare class timeSlotRepository extends baseRepository<Itime> implements ItimeSlotRepository {
    constructor();
    createTimeSlot(timeSlots: Itime[]): Promise<Itime[] | []>;
    getTimeSlots(mentorId: ObjectId): Promise<Itime[] | []>;
    removeTimeSlot(slotId: string): Promise<DeleteResult | undefined>;
    getMentorSlots(mentorId: string): Promise<Itime[] | []>;
    makeTimeSlotBooked(slotId: string): Promise<Itime | null>;
    checkTimeSlots(mentorId: ObjectId, startDate: Date, endDate: Date): Promise<Itime[] | []>;
}
declare const _default: timeSlotRepository;
export default _default;
//# sourceMappingURL=timeSlotRepository.d.ts.map