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

    private timers = new Map<NotificationId, ReturnType<typeof setTimeout>>();
    private removingIds = new Set<NotificationId>();

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

    private async renderNotification(notification: Notification): Promise<void> {
        const element = this.renderer.render(notification);
        this.elements.set(notification.id, element);
        this.visibleCount++;
        await this.animateIn(element, this.container.getElement());

        if (notification.duration !== undefined) {
            const timer = setTimeout(() => {
                this.remove(notification.id);
            }, notification.duration);

            this.timers.set(notification.id, timer);
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

    public async remove(id: NotificationId): Promise<boolean> {
        if (this.removingIds.has(id)) return false;
        this.removingIds.add(id);

        const timer = this.timers.get(id);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(id);
        }

        const element = this.elements.get(id);
        if (element) {
            const removed = this.manager.remove(id);
            if (!removed) {
                this.removingIds.delete(id);
                return false;
            }

            await this.animateOut(element);
            this.elements.delete(id);
            this.visibleCount--;
            this.removingIds.delete(id);
            this.tryShowNext();
            return true;
        }

        const waitingIndex = this.waiting.findIndex(n => n.id === id);
        if (waitingIndex !== -1) {
            const removed = this.manager.remove(id);
            if (removed) {
                this.waiting.splice(waitingIndex, 1);
            }

            this.removingIds.delete(id);
            
            return removed;
        }

        this.removingIds.delete(id);
        return false;
    }

    private animateIn(element: HTMLElement, container: HTMLElement): Promise<void> {
        return new Promise((resolve) => {
            element.classList.add('notification-enter');
            container.appendChild(element);
            
            void element.offsetHeight;
            element.classList.add('notification-enter-active');
            const onEnd = () => {
                element.classList.remove('notification-enter', 'notification-enter-active');
                element.removeEventListener('transitionend', onEnd);
                resolve();
            };
            element.addEventListener('transitionend', onEnd, { once: true });
        });
    }

    private animateOut(element: HTMLElement): Promise<void> {
        return new Promise((resolve) => {
            element.classList.add('notification-exit');
            void element.offsetHeight;
            element.classList.add('notification-exit-active');
            const onEnd = () => {
                element.remove();
                element.removeEventListener('transitionend', onEnd);
                resolve();
            };
            element.addEventListener('transitionend', onEnd, { once: true });
        });
    }
}
