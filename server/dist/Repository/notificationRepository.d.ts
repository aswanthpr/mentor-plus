import { InotificationRepository } from "src/Interface/Notification/InotificationRepository";
import { Inotification } from "../Model/notificationModel";
import { baseRepository } from "./baseRepo";
declare class notificationRepository extends baseRepository<Inotification> implements InotificationRepository {
    constructor();
}
declare const _default: notificationRepository;
export default _default;
//# sourceMappingURL=notificationRepository.d.ts.map