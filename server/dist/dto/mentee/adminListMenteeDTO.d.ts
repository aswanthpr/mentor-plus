import { Types } from "mongoose";
import { Imentee } from "../../Model/menteeModel";
export declare class AdminListedMenteeDTO {
    _id: Types.ObjectId;
    name: string;
    email: string;
    profileUrl: string | undefined;
    isBlocked: boolean;
    constructor(mentee: Imentee);
    static single(mentee: Imentee): AdminListedMenteeDTO;
    static multiple(mentees: Imentee[]): AdminListedMenteeDTO[];
}
//# sourceMappingURL=adminListMenteeDTO.d.ts.map