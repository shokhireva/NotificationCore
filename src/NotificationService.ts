import { NotificationManager } from "./core/NotificationManager.js";
import { NotificationRenderer } from "./ui/NotificationRenderer.js";
import { NotificationContainer } from "./ui/NotificationContainer.js";
import { NotificationPriority } from "./types/NotificationPriority.js";

import type { Notification } from "./types/Notification.js";
import type { NotificationId } from "./types/NotificationId.js";
import type { NotificationOptions } from "./types/NotificationOptions.js";

export class NotificationService {
    private manager = new NotificationManager();
    private renderer = new NotificationRenderer();
    private container = new NotificationContainer();

    private elements = new Map<
        NotificationId,
        HTMLElement
    >();

    private maxVisible = 3;        
    private visibleCount = 0;     
    private waiting: Notification[] = []; 

    private addToWaiting(notification: Notification): void {
        if (notification.priority === NotificationPriority.Important) {
            const firstNormalIndex = this.waiting.findIndex(
                n => n.priority !== NotificationPriority.Important
            );
            if (firstNormalIndex === -1) {
                this.waiting.push(notification);
            } else {
                this.waiting.splice(firstNormalIndex, 0, notification);
            }
        } else {
            this.waiting.push(notification);
        }
    }

    private renderNotification(notification: Notification): void {
        const element = this.renderer.render(notification);
        this.container.append(element);
        this.elements.set(notification.id, element);
        this.visibleCount++;

        if (notification.duration !== undefined) {
            setTimeout(() => {
                this.remove(notification.id);
            }, notification.duration);
        }
    }

    private tryShowNext(): void {
        while (this.visibleCount < this.maxVisible && this.waiting.length > 0) {
            const next = this.waiting.shift()!;
            this.renderNotification(next);
        }
    }

    public show(options: NotificationOptions): Notification {
        const notification = this.manager.show(options);
        this.addToWaiting(notification);
        this.tryShowNext();
        return notification;
    }

    public remove(id: NotificationId): boolean {
        const element = this.elements.get(id);
        if (element) {
            const removed = this.manager.remove(id);
            if (!removed) return false;

            this.renderer.remove(element);
            this.elements.delete(id);
            this.visibleCount--;
            this.tryShowNext();
            return true;
        }

        const waitingIndex = this.waiting.findIndex(n => n.id === id);
        if (waitingIndex !== -1) {
            const notification = this.waiting[waitingIndex];
            const removed = this.manager.remove(id);
            if (removed) {
                this.waiting.splice(waitingIndex, 1);
            }
            return removed;
        }

        return false;
    }
}
