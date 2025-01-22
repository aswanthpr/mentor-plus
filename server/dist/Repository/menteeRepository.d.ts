import { UpdateWriteOpResult } from "mongoose";
import { Imentee } from "../Model/menteeModel";
import { baseRepository } from "./baseRepo";
import { ImenteeRepository } from "../Interface/Mentee/iMenteeRepository";
export declare class menteeRepository extends baseRepository<Imentee> implements ImenteeRepository {
    constructor();
    menteeData(): Promise<Imentee[] | null>;
    changeMenteeStatus(id: string): Promise<Imentee | null>;
    editMentee(formData: Partial<Imentee>): Promise<Imentee | null>;
    findMentee(email: string): Promise<Imentee | null>;
    addMentee(formData: Partial<Imentee>): Promise<Imentee | null>;
    googleAddMentee(formData: Partial<Imentee>): Promise<Imentee | null>;
    findById(id: string): Promise<Imentee | null>;
    changePassword(id: string, password: string): Promise<Imentee | null>;
    profileChange(image: string, id: string): Promise<Imentee | null>;
    updateMentee(email: string): Promise<UpdateWriteOpResult | null>;
    findByEmail(email: string): Promise<Imentee | null>;
    create_Mentee(userData: Imentee): Promise<Imentee>;
    mainLogin(email: string): Promise<Imentee | null>;
    forgot_PasswordChange(email: string, password: string): Promise<Imentee | null | undefined>;
    adminLogin(email: string): Promise<Imentee | null>;
}
declare const _default: menteeRepository;
export default _default;
//# sourceMappingURL=menteeRepository.d.ts.map