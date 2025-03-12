
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