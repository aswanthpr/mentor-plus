import { DeleteResult, ObjectId } from 'mongoose';
import { Itime } from '../../Model/timeModel';
export interface ItimeSlotRepository {
    createTimeSlot(timeSlots: Itime[]): Promise<Itime | undefined>;
    getTimeSlots(mentorId: ObjectId): Promise<Itime[] | []>;
    removeTimeSlot(slotId: string): Promise<DeleteResult | undefined>;
    getMentorSlots(mentorId: string): Promise<Itime[] | []>;
    makeTimeSlotBooked(slotId: string): Promise<Itime | null>;
}
//# sourceMappingURL=iTimeSchedule.d.ts.map