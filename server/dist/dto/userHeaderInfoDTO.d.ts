import { Imentee } from "../Model/menteeModel";
import { Imentor } from "../Model/mentorModel";
export declare class UserHeaderDTO {
    name: string | null;
    email: string | null;
    profileUrl: string | undefined;
    constructor(user: Imentee | Imentor);
    static single(user: Imentee | Imentor): UserHeaderDTO;
}
//# sourceMappingURL=userHeaderInfoDTO.d.ts.map