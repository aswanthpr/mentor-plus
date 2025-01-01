import { IMentee } from "../../MODEL/MenteeModel";
export interface IMenteeRepository {
    dbMenteeData(): Promise<IMentee[] | null>;
    dbChangeMenteeStatus(id: string): Promise<IMentee | null>;
    dbEditMentee(formData: Partial<IMentee>): Promise<IMentee | null>;
    dbAddMentee(formData: Partial<IMentee>): Promise<IMentee | null>;
    dbFindMentee(email: string): Promise<IMentee | null>;
    dbAddMentee(formData: Partial<IMentee>): Promise<IMentee | null>;
    dbFindById(id: string): Promise<IMentee | null>;
    dbGoogleAddMentee(formData: Partial<IMentee>): Promise<IMentee | null>;
    dbChangePassword(id: string, password: string): Promise<IMentee | null>;
    dbProfileChange(image: string, id: string): Promise<IMentee | null>;
}
//# sourceMappingURL=IMenteeRepository.d.ts.map