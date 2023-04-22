import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NotificationCreatedEvent } from "./notifications.event";

@EventsHandler(NotificationCreatedEvent)
export class NotificationEventHandler implements IEventHandler<NotificationCreatedEvent> {
  handle(event: NotificationCreatedEvent) {
    const { email, notifications } = event.notification;
    console.log(`Notification created for email:${email}, with message:${JSON.stringify(notifications)}`);
  }
}