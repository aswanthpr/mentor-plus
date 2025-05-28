import { ImailOption } from "src/Types";
export declare function generateOtpEmailTemplate(otp: string, email: string): {
    to: string;
    subject: string;
    text: string;
    html: string;
};
export declare function generateMentorVerifiedEmailTemplate(mentorName: string, email: string): ImailOption;
//# sourceMappingURL=email.template.util.d.ts.map