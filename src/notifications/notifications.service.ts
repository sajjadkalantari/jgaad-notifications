import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDto } from './notification.dto';
import { plainToClass } from 'class-transformer';
import { Notification, NotificationSchema } from './notification.schema';
import { validate } from 'class-validator';
import { InvalidRequestException } from '../utilities/dtos/global-exception.filter';
import { NotificationCreatedEvent } from './notifications.event';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<Notification>,
    private readonly eventBus: EventBus) { }

    async getNotifications(email: string): Promise<NotificationDto> {
        const notification = await this.notificationModel.findOne({ email }).lean().exec();
        if (!notification) throw new NotFoundException("user notifications not found");
        const response = plainToClass(NotificationDto, notification);
        return response;
    }

    async addNotification(notification: NotificationDto): Promise<NotificationDto> {
        let notificationDto = plainToClass(NotificationDto, notification);
        const errors = await validate(notificationDto);
        if (errors.length > 0) {
            throw new InvalidRequestException(`invalid request`, errors);
        }
        
        const notificationDoc = await this.notificationModel.create(notificationDto);
        
        //publish event created event
        await this.eventBus.publish(new NotificationCreatedEvent(notificationDto));
        return notificationDto;
    }
}
