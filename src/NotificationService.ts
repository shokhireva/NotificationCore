import { NotificationManager } from "./core/NotificationManager.js";
import { NotificationRenderer } from "./ui/NotificationRenderer.js";
import { NotificationContainer } from "./ui/NotificationContainer.js";

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

    public show(options: NotificationOptions): Notification {
        const notification =this.manager.show(options);
        const element =this.renderer.render(notification);

        this.container.append(element);
        this.elements.set(notification.id, element);

        return notification;
}
}
