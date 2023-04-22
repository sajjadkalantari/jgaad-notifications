import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationEventHandler } from './notifications.handler';
import { CommandBus, CqrsModule, EventBus } from '@nestjs/cqrs';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    CqrsModule
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationEventHandler, EventBus, CommandBus],
})
export class NotificationsModule { 

  constructor(private readonly eventBus: EventBus) {
    this.eventBus.register([NotificationEventHandler]);
  }
}
