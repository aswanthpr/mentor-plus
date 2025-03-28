import { IcheckedSlot } from "../Types";

export   function genOtp():string{
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const generateSessionCode = () => {
  const randomString = Math.random().toString(36).substring(2, 11).toUpperCase();
  return randomString.match(/.{1,3}/g)?.join("-") || "";
};

export const getTodayStartTime = () => {
 
  return  new Date(new Date().setUTCHours(0,0,0,0));
};
export const getTodayEndTime = () => {
 
  return  new Date(new Date().setUTCHours(23,59,59,999));
};



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
export const createSkip =(page:number,limit:number)=>{
  const pageNo = Math.max(page, 1);
  const limitNo = Math.max(limit, 1);
  const skip = (pageNo - 1) * limitNo;
  return {pageNo,limitNo,skip};

}