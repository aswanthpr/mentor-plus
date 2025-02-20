import mongoose from "mongoose";
import { Imentor } from "../../Model/mentorModel";
import { ImentorApplication } from "../../Types";
export interface ImentorRepository {
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
    updateMentorById(mentorData: Partial<Imentor>): Promise<Imentor | null | undefined>;
    categoryWithSkills(): Promise<Imentor[] | undefined>;
    findMentorsByCategory(category: string, mentorId: string): Promise<Imentor[] | []>;
}
//# sourceMappingURL=iMentorRepository.d.ts.map