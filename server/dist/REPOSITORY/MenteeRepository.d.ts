import { IMentee } from "../Model/MenteeModel";
import { BaseRepository } from "./BaseRepo";
import { IMenteeRepository } from "../Interface/Mentee/IMenteeRepository";
export declare class MenteeRepository extends BaseRepository<IMentee> implements IMenteeRepository {
    constructor();
    dbMenteeData(): Promise<IMentee[] | null>;
    dbChangeMenteeStatus(id: string): Promise<IMentee | null>;
    dbEditMentee(formData: Partial<IMentee>): Promise<IMentee | null>;
    dbFindMentee(email: string): Promise<IMentee | null>;
    dbAddMentee(formData: Partial<IMentee>): Promise<IMentee | null>;
    dbGoogleAddMentee(formData: Partial<IMentee>): Promise<IMentee | null>;
    dbFindById(id: string): Promise<IMentee | null>;
    dbChangePassword(id: string, password: string): Promise<IMentee | null>;
    dbProfileChange(image: string, id: string): Promise<IMentee | null>;
    DBupdateMentee(email: string): Promise<any>;
    findByEmail(email: string): Promise<IMentee | null>;
    create_Mentee(userData: IMentee): Promise<IMentee>;
    DBMainLogin(email: string): Promise<IMentee | null>;
    DBforgot_PasswordChange(email: string, password: string): Promise<IMentee | null | undefined>;
    DBadminLogin(email: string): Promise<IMentee | null>;
}
declare const _default: MenteeRepository;
export default _default;
//# sourceMappingURL=MenteeRepository.d.ts.map