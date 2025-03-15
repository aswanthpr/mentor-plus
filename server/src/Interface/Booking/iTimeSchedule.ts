
import { DeleteResult, ObjectId } from 'mongoose';
import { Itime } from '../../Model/timeModel'

export interface ItimeSlotRepository {
    createTimeSlot(timeSlots:Itime[]): Promise<Itime[] | []> ;
    getTimeSlots(mentorId:ObjectId):Promise<Itime[]|[]>;
    removeTimeSlot(slotId:string):Promise<DeleteResult|undefined> ;
    getMentorSlots(mentorId: string): Promise<Itime[] | []>;
    makeTimeSlotBooked(slotId:string):Promise<Itime|null>;
    checkTimeSlots(mentorId:ObjectId,startDate:Date,endDate:Date):Promise<Itime[]|[]>;
}