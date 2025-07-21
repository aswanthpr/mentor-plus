"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminListedMentorDTO = void 0;
class AdminListedMentorDTO {
    constructor(mentor) {
        this._id = mentor === null || mentor === void 0 ? void 0 : mentor._id;
        this.name = mentor.name;
        this.email = mentor.email;
        this.resume = mentor.resume;
        this.verified = mentor.verified;
        this.isBlocked = mentor.isBlocked;
        this.profileUrl = mentor === null || mentor === void 0 ? void 0 : mentor.profileUrl;
    }
    static single(mentor) {
        return new AdminListedMentorDTO(mentor);
    }
    static multiple(mentors) {
        return mentors.map(AdminListedMentorDTO.single);
    }
}
exports.AdminListedMentorDTO = AdminListedMentorDTO;
