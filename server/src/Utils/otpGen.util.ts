
export default  function genOtp():string{
  return Math.floor(100000 + Math.random() * 900000).toString();
}