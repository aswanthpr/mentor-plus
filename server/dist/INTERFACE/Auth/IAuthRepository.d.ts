import { IMentee } from "../../MODEL/MenteeModel";
export interface IAuthRepository {
    findByEmail(email: string): Promise<IMentee | null>;
    DBMainLogin(email: string): Promise<IMentee | null>;
}
//# sourceMappingURL=IAuthRepository.d.ts.map