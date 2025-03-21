"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSkip = exports.checkForOverlap = exports.getTodayEndTime = exports.getTodayStartTime = exports.generateSessionCode = void 0;
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
    return new Date(new Date().setUTCHours(0, 0, 0, 0));
};
exports.getTodayStartTime = getTodayStartTime;
const getTodayEndTime = () => {
    return new Date(new Date().setUTCHours(23, 59, 59, 999));
};
exports.getTodayEndTime = getTodayEndTime;
const checkForOverlap = (checkedSlots, newSlots) => {
    return newSlots.filter(({ startTime, endTime }) => {
        //here checking the slot is exist in db slot 
        const isOverlapping = checkedSlots.some((dbSlot) => {
            var _a, _b, _c, _d;
            const dbStartTime = (_b = (_a = dbSlot === null || dbSlot === void 0 ? void 0 : dbSlot.slots) === null || _a === void 0 ? void 0 : _a.startTime) === null || _b === void 0 ? void 0 : _b.substring(11, 16);
            const dbEndTime = (_d = (_c = dbSlot === null || dbSlot === void 0 ? void 0 : dbSlot.slots) === null || _c === void 0 ? void 0 : _c.endTime) === null || _d === void 0 ? void 0 : _d.substring(11, 16);
            return ((startTime === dbStartTime && endTime === dbEndTime) ||
                (startTime >= dbStartTime && startTime < dbEndTime) ||
                (endTime > dbStartTime && endTime <= dbEndTime) ||
                (startTime <= dbStartTime && endTime >= dbEndTime));
        });
        return !isOverlapping; //only return non overlapping slots
    });
};
exports.checkForOverlap = checkForOverlap;
const createSkip = (page, limit) => {
    const pageNo = Math.max(page, 1);
    const limitNo = Math.max(limit, 1);
    const skip = (pageNo - 1) * limitNo;
    return { pageNo, limitNo, skip };
};
exports.createSkip = createSkip;
