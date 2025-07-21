"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorDTO = void 0;
class MentorDTO {
    constructor(mentor) {
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
    static single(mentor) {
        return new MentorDTO(mentor);
    }
    static multiple(mentors) {
        return mentors.map(MentorDTO.single);
    }
}
exports.MentorDTO = MentorDTO;
