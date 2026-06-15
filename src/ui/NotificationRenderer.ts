import type { Notification } from "../types/Notification.js";


export class NotificationRenderer {
    public render(notification: Notification): HTMLElement{
        const element = document.createElement("div");

        element.classList.add("notification");
        element.classList.add(`notification--${notification.type}`);

        if (notification.title) {
            const titleElement = document.createElement("div");

            titleElement.classList.add("notification__title");
            titleElement.textContent = notification.title;

            element.append(titleElement);
        }

        const messageElement = document.createElement("div");

        messageElement.classList.add("notification__message");
        messageElement.textContent = notification.message;

        element.append(messageElement);

        return element;
    }

    public remove(element: HTMLElement): void {
        element.remove();
    }   
}

