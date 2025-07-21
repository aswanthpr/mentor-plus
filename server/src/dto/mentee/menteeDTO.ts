import {  Types } from "mongoose";
import { Imentee } from "../../Model/menteeModel";

export class MenteeDTO {
  _id: Types.ObjectId;
  name: string;
  email:string;
  profileUrl: string|undefined;
  linkedinUrl: string;
  githubUrl: string;
  isBlocked: boolean;



constructor(mentee: Imentee) {
    this._id = mentee._id;
    this.name = mentee.name;
    this.email = mentee?.email;
    this.githubUrl = mentee.githubUrl;
    this.isBlocked = mentee.isBlocked;
    this.profileUrl = mentee.profileUrl;
    this.linkedinUrl = mentee.linkedinUrl;
    
}
  static single(mentee: Imentee): MenteeDTO {
    return new MenteeDTO(mentee);
  }
  static multiple(mentees: Imentee[]): MenteeDTO[] {
    return mentees.map(MenteeDTO.single);
  }
}
