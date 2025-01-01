import mongoose from "mongoose";
import { IMentor } from "../../MODEL/mentorModel";
import { IMentorApplication } from "../../TYPES";
export interface IMentorRepository {
    dbFindMentor(email?: string, phone?: string): Promise<IMentor | null>;
    dbCreateMentor(mentorData: IMentorApplication, imageUrl: string, fileUrl: string): Promise<IMentor | undefined>;
    dbFindAllMentor(): Promise<IMentor[] | null>;
    dbVerifyMentor(id: mongoose.Types.ObjectId): Promise<IMentor | null>;
    dbChangeMentorStatus(id: mongoose.Types.ObjectId): Promise<IMentor | null>;
    dbFindMentorAndUpdate(email: string, password: string): Promise<IMentor | null>;
    dbMentorProfile(mentorId: string): Promise<IMentor | null>;
}
//# sourceMappingURL=IMentorRepository.d.ts.map