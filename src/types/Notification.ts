import { NotificationType } from "./NotificationType.js";
import { NotificationPriority } from "./NotificationPriority.js";
import type { NotificationId } from "./NotificationId.js";


export interface Notification {
    id:NotificationId;
    message:string;
    title?:string;
    type:NotificationType;
    priority:NotificationPriority;
    duration?: number;
    createdAt: Date;
}