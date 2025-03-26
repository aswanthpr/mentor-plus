import { DeleteResult, ObjectId } from 'mongoose';
import { Itime } from '../../Model/timeModel';
export interface ItimeSlotRepository {
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
//# sourceMappingURL=iTimeSchedule.d.ts.map