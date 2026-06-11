import { NotificationType } from "./NotificationType.js";
import { NotificationPriority } from "./NotificationPriority.js";

export interface NotificationOptions {
    message: string;
    title?: string;
    type: NotificationType;
    priority: NotificationPriority;
    duratiun?: number;
}
