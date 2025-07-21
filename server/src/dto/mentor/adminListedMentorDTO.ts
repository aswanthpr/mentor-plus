import  { Types } from "mongoose";
import { Imentor } from "../../Model/mentorModel";

export class AdminListedMentorDTO {
  _id: Types.ObjectId;
  name: string;
  email: string;
  resume: string;
  isBlocked: boolean;
  verified: boolean;
  profileUrl:string;

  constructor(mentor: Imentor) {
    this._id = mentor?._id;
    this.name = mentor.name;
    this.email = mentor.email;
    this.resume = mentor.resume;
    this.verified = mentor.verified;
    this.isBlocked = mentor.isBlocked;
    this.profileUrl = mentor?.profileUrl;
  }
  static single(mentor: Imentor): AdminListedMentorDTO {
    return new AdminListedMentorDTO(mentor);
  }
  static multiple(mentors: Imentor[]): AdminListedMentorDTO[] {
    return mentors.map(AdminListedMentorDTO.single);
  }
}
