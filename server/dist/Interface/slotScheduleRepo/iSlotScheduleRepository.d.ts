import { IslotSchedule } from "src/Model/slotSchedule";
import { InewSlotSchedule } from "src/Types";
export interface IslotScheduleRepository {
    newSlotBooking(newSlotSchedule: InewSlotSchedule): Promise<IslotSchedule | null>;
}
//# sourceMappingURL=iSlotScheduleRepository.d.ts.map