NotificationCore

A lightweight, type-safe notification (toast) library built with TypeScript.

Features

- Show notifications with a message, optional title, and type (Success, Error, Info)
- Priority system (Default and Important) – important notifications jump the queue
- Queue with a limit – no more than 3 notifications visible at once
- Auto-dismiss with configurable duration (milliseconds)
- Smooth enter and exit animations via CSS transitions
- 6 predefined positions: top-left, top-right, bottom-left, bottom-right, top-center, bottom-center
- Smart ordering: new notifications appear on top for top positions, and at the bottom for bottom positions
- Full TypeScript with strict type checking

Installation - npm install

Build - npx tsc

Usage

import { NotificationService } from './dist/ui/NotificationService.js';
import { NotificationType } from './dist/types/NotificationType.js';
import { NotificationPriority } from './dist/types/NotificationPriority.js';

const service = new NotificationService('top-right');

service.show({
    message: 'Operation completed successfully!',
    title: 'Success',
    type: NotificationType.Success,
    priority: NotificationPriority.Default,
    duration: 3000
});

service.show({
    message: 'Critical error! Please check logs.',
    title: 'Important',
    type: NotificationType.Error,
    priority: NotificationPriority.Important,
    duration: 5000
});

service.setPosition('bottom-center');

API

NotificationService methods:
- constructor(position?) – default: 'bottom-right'
- show(options) – displays a notification
- remove(id) – removes with animation, returns Promise<boolean>
- setPosition(position) – changes container position
- getVisibleCount() – returns number of visible notifications

NotificationOptions fields:
- message: string (required)
- title?: string (optional)
- type: NotificationType (Success, Error, Info)
- priority: NotificationPriority (Default, Important)
- duration?: number (auto-dismiss in ms, optional)

Position type:
'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'

Demo

Run a local server and open demo/index.html: npx serve .

The demo includes buttons for all types, priority, queue, and position selector.

Project Structure

- src/core/ – notification manager (storage & queue)
- src/types/ – TypeScript types
- src/ui/ – renderer, container, service (facade)
- demo/ – interactive demo page with styles

Customisation

Override these CSS classes in your own stylesheet:
- .notification
- .notification--success, .notification--error, .notification--info
- .notification__title, .notification__message
- .notification-enter, .notification-enter-active
- .notification-exit, .notification-exit-active
- .notification-container and .notification-container--{position}

Requirements

- Node.js >= 14.17
- TypeScript >= 6.0 (dev dependency)