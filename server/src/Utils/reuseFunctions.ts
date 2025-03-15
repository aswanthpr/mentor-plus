
import { IcheckedSlot } from "src/Types";

export const checkForOverlap = (
  checkedSlots: IcheckedSlot[],
  newSlots: { startTime: string; endTime: string }[]
) => {
  return newSlots.filter(({ startTime, endTime }) => {
  //here checking the slot is exist in db slot 
    const isOverlapping = checkedSlots.some((dbSlot) => {
      const dbStartTime = dbSlot?.slots?.startTime?.substring(11, 16);
      const dbEndTime = dbSlot?.slots?.endTime?.substring(11, 16); 
      return (
        (startTime === dbStartTime && endTime === dbEndTime) || 
        (startTime >= dbStartTime && startTime < dbEndTime) || 
        (endTime > dbStartTime && endTime <= dbEndTime) || 
        (startTime <= dbStartTime && endTime >= dbEndTime) 
      );
    });

    return !isOverlapping; //only return non overlapping slots
  });
};
