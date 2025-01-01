import { BaseRepository } from "./BaseRepo";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import { IMentor } from "../MODEL/mentorModel";
import { IMentorApplication } from "../TYPES";
import mongoose from "mongoose";
declare class mentorRepository extends BaseRepository<IMentor> implements IMentorRepository {
    constructor();
    dbFindMentor(email?: string, phone?: string): Promise<IMentor | null>;
    dbCreateMentor(mentorData: IMentorApplication, imageUrl: string, fileUrl: string): Promise<IMentor | undefined>;
    dbFindAllMentor(): Promise<IMentor[] | null>;
    dbVerifyMentor(id: mongoose.Types.ObjectId): Promise<IMentor | null>;
    dbChangeMentorStatus(id: mongoose.Types.ObjectId): Promise<IMentor | null>;
    dbFindMentorAndUpdate(email: string, password: string): Promise<IMentor | null>;
    dbMentorProfile(mentorId: string): Promise<IMentor | null>;
}
declare const _default: mentorRepository;
export default _default;
//# sourceMappingURL=MentorRepository.d.ts.map