import otpGen from 'otp-generator';

 export default function genOtp():string{
   return  otpGen.generate(6,
    {upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        digits:true,
        specialChars:false
    }

   )
}