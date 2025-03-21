import { IcheckedSlot } from "../Types";
export declare function genOtp(): string;
export declare const generateSessionCode: () => string;
export declare const getTodayStartTime: () => Date;
export declare const getTodayEndTime: () => Date;
export declare const checkForOverlap: (checkedSlots: IcheckedSlot[], newSlots: {
    startTime: string;
    endTime: string;
}[]) => {
    startTime: string;
    endTime: string;
}[];
export declare const createSkip: (page: number, limit: number) => {
    pageNo: number;
    limitNo: number;
    skip: number;
};
//# sourceMappingURL=reusable.util.d.ts.map