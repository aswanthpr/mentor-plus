import { Types } from "mongoose";
import { Imentor } from "../../Model/mentorModel";
export declare class MentorDTO {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    bio: string;
    profileUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    resume: string;
    skills: string[];
    isBlocked: boolean;
    verified: boolean;
    jobTitle: string;
    category: string;
    constructor(mentor: Imentor);
    static single(mentor: Imentor): MentorDTO;
    static multiple(mentors: Imentor[]): MentorDTO[];
}
//# sourceMappingURL=mentorDTO.d.ts.map