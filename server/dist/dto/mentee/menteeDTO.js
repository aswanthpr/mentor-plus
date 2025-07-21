"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenteeDTO = void 0;
class MenteeDTO {
    constructor(mentee) {
        this._id = mentee._id;
        this.name = mentee.name;
        this.email = mentee === null || mentee === void 0 ? void 0 : mentee.email;
        this.githubUrl = mentee.githubUrl;
        this.isBlocked = mentee.isBlocked;
        this.profileUrl = mentee.profileUrl;
        this.linkedinUrl = mentee.linkedinUrl;
    }
    static single(mentee) {
        return new MenteeDTO(mentee);
    }
    static multiple(mentees) {
        return mentees.map(MenteeDTO.single);
    }
}
exports.MenteeDTO = MenteeDTO;
