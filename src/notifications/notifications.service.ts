import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationDto } from './notification.dto';
import { plainToClass } from 'class-transformer';
import { Notification, NotificationSchema } from './notification.schema';
import { validate } from 'class-validator';
import { InvalidRequestException } from 'src/utilities/dtos/global-exception.filter';
@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<Notification>) { }

    async getNotifications(email: string): Promise<NotificationDto> {
        const notification = await this.notificationModel.findOne({ email }).lean().exec();
        const response = plainToClass(NotificationDto, notification);
        return response;
    }

    async addNotification(notification: NotificationDto): Promise<NotificationDto> {
        let notificationDto = plainToClass(NotificationDto, notification);
        const errors = await validate(notificationDto);
        if (errors.length > 0) {
          throw new InvalidRequestException(`invalid request`, errors);
        }
       
        const notificationDoc = new this.notificationModel(notificationDto);                
        await notificationDoc.save();
        return notificationDto;
    }
}