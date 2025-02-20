import { baseRepository } from "./baseRepo";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { Imentor } from "../Model/mentorModel";
import mongoose from "mongoose";
import { ImentorApplication } from "src/Types";
declare class mentorRepository extends baseRepository<Imentor> implements ImentorRepository {
    constructor();
    findMentor(email?: string, phone?: string): Promise<Imentor | null>;
    createMentor(mentorData: ImentorApplication, imageUrl: string, fileUrl: string): Promise<Imentor | undefined>;
    findAllMentor(): Promise<Imentor[] | null>;
    findVerifiedMentor(): Promise<Imentor[] | null>;
    verifyMentor(id: mongoose.Types.ObjectId): Promise<Imentor | null>;
    changeMentorStatus(id: mongoose.Types.ObjectId): Promise<Imentor | null>;
    findMentorAndUpdate(email: string, password: string): Promise<Imentor | null>;
    findMentorById(mentorId: string): Promise<Imentor | null>;
    changeMentorPassword(mentorId: string, password: string): Promise<Imentor | null>;
    changeMentorProfileImage(profileUrl: string, id: string): Promise<Partial<Imentor> | null>;
    updateMentorById(mentorData: Partial<Imentor>): Promise<Imentor | undefined | null>;
    categoryWithSkills(): Promise<Imentor[] | undefined>;
    findMentorsByCategory(category: string, mentorId: string): Promise<Imentor[] | []>;
}
declare const _default: mentorRepository;
export default _default;
//# sourceMappingURL=mentorRepository.d.ts.map