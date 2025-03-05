"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayStartTime = exports.generateSessionCode = void 0;
exports.genOtp = genOtp;
function genOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
const generateSessionCode = () => {
    var _a;
    const randomString = Math.random().toString(36).substring(2, 11).toUpperCase();
    return ((_a = randomString.match(/.{1,3}/g)) === null || _a === void 0 ? void 0 : _a.join("-")) || "";
};
exports.generateSessionCode = generateSessionCode;
const getTodayStartTime = () => {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0); // Set time to 12:00 AM UTC
    return now.toISOString();
};
exports.getTodayStartTime = getTodayStartTime;
