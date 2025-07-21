import { ImailOption } from "../Types";

export function generateOtpEmailTemplate(otp: string,email:string) {
  return {
    to:email,
    subject: "Your OTP Verification Code-MentorPlus",
    text: `Your OTP code is ${otp}. It is valid for the next 5 minutes.`,
    html: `
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #ff8800;text-decoration:none;font-weight:600"></a>Mentor Plus
        </div>
        <p style="font-size:1.1em">Hi,</p>
        <p>Thank you for choosing Mentor Plus. Use the following OTP to complete your Sign Up procedures. OTP is valid for 2 minutes</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
        <p style="font-size:0.9em;">Regards,<br />Mentor Plus</p>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Mentor Plus</p>
        <p>Amphitheatre Parkway</p>
        <p>calicut</p>
        </div>
        </div>
        </div>`,
  };
}


export function generateMentorVerifiedEmailTemplate(mentorName: string,email:string):ImailOption {
  return {
    to:email,
    subject: "Mentor Verification Successful - MentorPlus",
    text: `Hi ${mentorName}, your mentor profile has been successfully verified. You can now log in to your account.`,
    html: `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="#" style="font-size:1.4em;color: #ff8800;text-decoration:none;font-weight:600">Mentor Plus</a>
          </div>
          <p style="font-size:1.1em">Hi ${mentorName},</p>
          <p>Congratulations! Your mentor profile has been successfully verified.</p>
          <p>You can now log in to your account and start mentoring.</p>
          <a href="https://mentorplus.vercel.app/auth/login/mentor" style="display:inline-block;padding:10px 20px;margin:10px 0;background:#00466a;color:#fff;border-radius:5px;text-decoration:none;font-weight:500;">Login to Mentor Portal</a>
          <p style="font-size:0.9em;">Regards,<br />Mentor Plus Team</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Mentor Plus</p>
            <p>Amphitheatre Parkway</p>
            <p>Calicut</p>
          </div>
        </div>
      </div>
    `,
  };
}
