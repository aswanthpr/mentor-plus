import { IcheckedSlot } from "../Types";
export declare function genOtp(): string;
export declare const generateSessionCode: () => string;
export declare const getTodayStartTime: () => Date;
export declare const checkForOverlap: (checkedSlots: IcheckedSlot[], newSlots: {
    startTime: string;
    endTime: string;
}[]) => {
    startTime: string;
    endTime: string;
}[];
//# sourceMappingURL=reusable.util.d.ts.map