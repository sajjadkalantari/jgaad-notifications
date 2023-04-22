import { IEvent } from '@nestjs/cqrs';
import { NotificationDto } from './notification.dto';

export class NotificationCreatedEvent implements IEvent {
    constructor(public readonly notification: NotificationDto) { }
}