import { baseRepository } from "./baseRepo";
import { ImentorRepository } from "../Interface/Mentor/iMentorRepository";
import { Imentor } from "../Model/mentorModel";
import mongoose, { PipelineStage } from "mongoose";
import { ImentorApplication } from "../Types";
declare class mentorRepository extends baseRepository<Imentor> implements ImentorRepository {
    constructor();
    findMentor(email?: string, phone?: string): Promise<Imentor | null>;
    createMentor(mentorData: ImentorApplication, imageUrl: string, fileUrl: string): Promise<Imentor | undefined>;
    findAllMentor(skip: number, limit: number, activeTab: string, search: string, sortField: string, sortOrder: string): Promise<{
        mentors: Imentor[] | [];
        totalDoc: number;
    }>;
    findVerifiedMentor(aggregateData: PipelineStage[]): Promise<{
        mentor: Imentor[] | null;
        count: number;
    }>;
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