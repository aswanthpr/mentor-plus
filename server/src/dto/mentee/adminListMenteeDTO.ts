import {  Types } from "mongoose";
import { Imentee } from "../../Model/menteeModel";

export class AdminListedMenteeDTO {
  _id: Types.ObjectId;
  name: string;
  email: string;
  profileUrl: string|undefined;
  isBlocked: boolean;

  constructor(mentee: Imentee) {
    this._id = mentee._id;
    this.name = mentee.name;
    this.email = mentee.email;
    this.isBlocked = mentee.isBlocked;
    this.profileUrl = mentee.profileUrl;

  }
  static single(mentee: Imentee): AdminListedMenteeDTO {
    return new AdminListedMenteeDTO(mentee);
  }
  static multiple(mentees: Imentee[]): AdminListedMenteeDTO[] {
    return mentees.map(AdminListedMenteeDTO.single);
  }
}
