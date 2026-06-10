import type { NotificationId } from "../types/NotificationId.js";
import type { NotificationOptions } from "../types/NotificationOptions.js";
import type { Notification } from "../types/Notification.js";

export class NotificationManager {
    private notifications: Notification[] = [];
    private nextId = 1;

    private generateId():NotificationId{
        const id = `notification-${this.nextId}`;
        this.nextId++;
        return id;
    }
    public show(options: NotificationOptions): Notification{
        const notification:Notification = {
            id:this.generateId(),
            ...options
        }
        this.notifications.push(notification);
        return notification;
    }
}