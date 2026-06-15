export class NotificationContainer {
    private element: HTMLElement;

    public constructor() {
        this.element = document.createElement("div");

        this.element.classList.add(
            "notification-container"
        );

        document.body.append(this.element);
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public append(notificationElement: HTMLElement): void {
        this.element.append(notificationElement);
    }

    public remove(notificationElement: HTMLElement): void {
        notificationElement.remove();
    }
}