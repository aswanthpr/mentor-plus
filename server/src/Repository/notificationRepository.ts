import { InotificationRepository } from "src/Interface/Notification/InotificationRepository";
import notificationModel, { Inotification } from "../Model/notificationModel";
import { baseRepository } from "./baseRepo";

class notificationRepository  extends baseRepository<Inotification> implements InotificationRepository{
constructor(){
    super(notificationModel)
}
}
export default new notificationRepository()