import {  Types } from "mongoose";
import { Imentor } from "../../Model/mentorModel";

export class MentorDTO {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  bio: string;
  profileUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  resume: string;
  skills: string[];
  isBlocked: boolean;
  verified: boolean;
  jobTitle: string;
  category: string;

  constructor(mentor: Imentor) {
    this._id = mentor._id;
    this.bio = mentor.bio;
    this.name = mentor.name;
    this.email = mentor.email;
    this.phone = mentor.phone;
    this.skills = mentor.skills;
    this.resume = mentor.resume;
    this.category = mentor.category;
    this.jobTitle = mentor.jobTitle;
    this.verified = mentor.verified;
    this.githubUrl = mentor.githubUrl;
    this.isBlocked = mentor.isBlocked;
    this.profileUrl = mentor.profileUrl;
    this.linkedinUrl = mentor.linkedinUrl;
  }
  static single(mentor: Imentor): MentorDTO {
    return new MentorDTO(mentor);
  }
  static multiple(mentors: Imentor[]): MentorDTO[] {
    return mentors.map(MentorDTO.single);
  }
}
