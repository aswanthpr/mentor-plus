"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminListedMenteeDTO = void 0;
class AdminListedMenteeDTO {
    constructor(mentee) {
        this._id = mentee._id;
        this.name = mentee.name;
        this.email = mentee.email;
        this.isBlocked = mentee.isBlocked;
        this.profileUrl = mentee.profileUrl;
    }
    static single(mentee) {
        return new AdminListedMenteeDTO(mentee);
    }
    static multiple(mentees) {
        return mentees.map(AdminListedMenteeDTO.single);
    }
}
exports.AdminListedMenteeDTO = AdminListedMenteeDTO;
