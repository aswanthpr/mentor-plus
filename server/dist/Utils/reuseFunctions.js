"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForOverlap = void 0;
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
