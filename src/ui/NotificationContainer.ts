import type { Position } from '../types/Position.js';

export class NotificationContainer {
    private element: HTMLElement;
    private position: Position;

    public constructor(position: Position = 'bottom-right') {
        this.position = position;
        this.element = document.createElement('div');
        this.element.classList.add('notification-container');
        this.updatePositionClass();
        document.body.append(this.element);
    }

    private updatePositionClass(): void {
        const positions: Position[] = [
            'top-left', 'top-right', 'bottom-left', 'bottom-right',
            'top-center', 'bottom-center'
        ];
        for (const pos of positions) {
            this.element.classList.remove(`notification-container--${pos}`);
        }
        this.element.classList.add(`notification-container--${this.position}`);
    }

    public getElement(): HTMLElement {
        return this.element;
    }

    public addNotification(notificationElement: HTMLElement): void {
        const isTop = this.position.startsWith('top');
        if (isTop) {
            this.element.prepend(notificationElement);
        } else {
            this.element.append(notificationElement);
        }
    }


    public append(notificationElement: HTMLElement): void {
        this.element.append(notificationElement);
    }

    public remove(notificationElement: HTMLElement): void {
        notificationElement.remove();
    }

    public setPosition(position: Position): void {
        this.position = position;
        this.updatePositionClass();
    }
}