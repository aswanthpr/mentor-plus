import { Types } from "mongoose";
import { Imentor } from "../../Model/mentorModel";
export declare class AdminListedMentorDTO {
    _id: Types.ObjectId;
    name: string;
    email: string;
    resume: string;
    isBlocked: boolean;
    verified: boolean;
    profileUrl: string;
    constructor(mentor: Imentor);
    static single(mentor: Imentor): AdminListedMentorDTO;
    static multiple(mentors: Imentor[]): AdminListedMentorDTO[];
}
//# sourceMappingURL=adminListedMentorDTO.d.ts.map