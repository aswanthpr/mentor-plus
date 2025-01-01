import { IMentorService } from "../INTERFACE/Mentor/IMentorService";
import { IMentorRepository } from "../INTERFACE/Mentor/IMentorRepository";
import { IMentor } from "../MODEL/mentorModel";
export declare class MentorService implements IMentorService {
    private _MentorRepository;
    constructor(_MentorRepository: IMentorRepository);
    blMentorProfile(token: string): Promise<{
        success: boolean;
        message: string;
        result: IMentor | null;
        status: number;
    }>;
    BLMentorRefreshToken(refresh: string): Promise<{
        success: boolean;
        message: string;
        status: number;
        accessToken?: string;
        refreshToken?: string;
    }>;
}
//# sourceMappingURL=MetnorService.d.ts.map