import { Types } from "mongoose";
import { Imentee } from "../../Model/menteeModel";
export declare class MenteeDTO {
    _id: Types.ObjectId;
    name: string;
    email: string;
    profileUrl: string | undefined;
    linkedinUrl: string;
    githubUrl: string;
    isBlocked: boolean;
    constructor(mentee: Imentee);
    static single(mentee: Imentee): MenteeDTO;
    static multiple(mentees: Imentee[]): MenteeDTO[];
}
//# sourceMappingURL=menteeDTO.d.ts.map