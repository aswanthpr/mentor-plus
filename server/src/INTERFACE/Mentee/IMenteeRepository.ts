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
  DBupdateMentee(email: string): Promise<any>;
  findByEmail(email: string): Promise<IMentee | null>;
  create_Mentee(userData: IMentee): Promise<IMentee>;
  DBMainLogin(email: string): Promise<IMentee | null>;
  DBforgot_PasswordChange(
    email: string,
    password: string
  ): Promise<IMentee | null | undefined>;
  DBadminLogin(email: string): Promise<IMentee | null>;
}
