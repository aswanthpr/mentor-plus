import { Imentee } from "../../Model/menteeModel";

export interface ImenteeRepository {
  menteeData(skip:number,limit:number,search:string,sortOrder:string,sortField:string,statusFilter:string): Promise<{mentees:Imentee[] | [],totalDoc:number}>;
  changeMenteeStatus(id: string): Promise<Imentee | null>;
  editMentee(formData: Partial<Imentee>): Promise<Imentee | null>;
  addMentee(formData: Partial<Imentee>): Promise<Imentee | null>;
  findMentee(email: string): Promise<Imentee | null>;
  addMentee(formData: Partial<Imentee>): Promise<Imentee | null>;
  findById(id: string): Promise<Imentee | null>;
  googleAddMentee(formData: Partial<Imentee>): Promise<Imentee | null>;
  changePassword(id: string, password: string): Promise<Imentee | null>;
  profileChange(image: string, id: string): Promise<Imentee | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateMentee(email: string): Promise<any>;
  findByEmail(email: string): Promise<Imentee | null>;
  create_Mentee(userData: Imentee): Promise<Imentee>;
  mainLogin(email: string): Promise<Imentee | null>;
  forgot_PasswordChange(
    email: string,
    password: string
  ): Promise<Imentee | null | undefined>;
  adminLogin(email: string): Promise<Imentee | null>;
  _find(): Promise<Imentee | null>;
}
