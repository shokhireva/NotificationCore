import type { NotificationId } from "../types/NotificationId.js";
import type { NotificationOptions } from "../types/NotificationOptions.js";
import type { Notification } from "../types/Notification.js";
import { NotificationPriority } from "../types/NotificationPriority.js";

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
            createdAt: new Date(),
            ...options
        }
        this.notifications.push(notification);
        return notification;
    }

    public getNotifications(): readonly Notification[] {
        return this.notifications;
    }   

    public getById(id: NotificationId): Notification | undefined {
        return this.notifications.find(notification => notification.id === id);
    }

    public remove(id: NotificationId): boolean {
        const index = this.notifications.findIndex(notification => notification.id === id);
        if (index === -1) {
            return false;
        }
        this.notifications.splice(index, 1);
        return true;
    }
    
    public clear(): void {
        this.notifications = [];
    }

    public getExpiredNotifications(): Notification[] {
        return this.notifications.filter(notification => {
            if (notification.duration === undefined) {
                return false;
            }

            return (Date.now() - notification.createdAt.getTime() > notification.duration);
        });
}
    
    public removeExpired(): number {
        const initialLength = this.notifications.length;

        this.notifications = this.notifications.filter(notification => {
            if (notification.duration === undefined) {
                return true;
            }

            return (Date.now() - notification.createdAt.getTime()<= notification.duration);
        });

        return initialLength - this.notifications.length;
    }

    public getNextNotification(): Notification | undefined {
        const importantNotification = this.notifications.find(
            notification => notification.priority === NotificationPriority.Important);

        if (importantNotification) {
            return importantNotification;
        }

        return this.notifications[0];
    }

    public dequeue(): Notification | undefined {
        const importantIndex = this.notifications.findIndex(
            notification => notification.priority === NotificationPriority.Important
        );

        if (importantIndex !== -1) {
            return this.notifications.splice(importantIndex, 1)[0];
        }

        return this.notifications.shift();
    }

    public hasNotifications(): boolean {
        return this.notifications.length > 0;
    }


}
