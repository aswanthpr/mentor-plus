"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHeaderDTO = void 0;
class UserHeaderDTO {
    constructor(user) {
        this.name = user.name;
        this.email = user.email;
        this.profileUrl = user.profileUrl;
    }
    static single(user) {
        return new UserHeaderDTO(user);
    }
}
exports.UserHeaderDTO = UserHeaderDTO;
