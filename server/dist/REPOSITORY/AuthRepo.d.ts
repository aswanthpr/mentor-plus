import { IAuthRepository } from "../INTERFACE/Auth/IAuthRepository";
import { IMentee } from "../MODEL/MenteeModel";
import { BaseRepository } from "./BaseRepo";
declare class AuthRepository extends BaseRepository<IMentee> implements IAuthRepository {
    constructor();
    findByEmail(email: string): Promise<IMentee | null>;
    create_Mentee(userData: IMentee): Promise<IMentee>;
    DBMainLogin(email: string): Promise<IMentee | null>;
    DBfindBy_id(userId: string): Promise<IMentee | null | undefined>;
    DBforgot_PasswordChange(email: string, password: string): Promise<IMentee | null | undefined>;
    DBadminLogin(email: string): Promise<IMentee | null>;
}
declare const _default: AuthRepository;
export default _default;
//# sourceMappingURL=AuthRepo.d.ts.map