import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from '../notifications.controller';
import { NotificationsService } from '../notifications.service';
import { NotificationDto } from '../notification.dto';
import { Notification } from '../notification.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CommandBus, EventBus } from '@nestjs/cqrs';

describe('NotificationsController', () => {
    let controller: NotificationsController;
    let service: NotificationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationsController],
            providers: [NotificationsService, {
                provide: getModelToken(Notification.name),
                useValue: {},
            }, EventBus, CommandBus],
        }).compile();

        controller = module.get<NotificationsController>(NotificationsController);
        service = module.get<NotificationsService>(NotificationsService);
    });

    describe('getMessages', () => {

        it('should return user notifications', async () => {
            //Arrange
            const userNotification = { email: "test@test.com", notifications: ["TEST #1"] } as NotificationDto;
            jest.spyOn(service, 'getNotifications').mockResolvedValue(userNotification);

            //Act
            const result = await controller.getNotifications(userNotification.email);

            //Assert
            expect(result.data).toEqual(userNotification);
            expect(result.succeeded).toBe(true);
        });
    })

    describe('addNotifications', () => {
        it('should return added notification', async () => {
            //Arrange
            const newNotification = { email: "test@test.com", notifications: ["TEST #1"] } as NotificationDto;
            jest.spyOn(service, 'addNotification').mockResolvedValue(newNotification);

            //Act
            const result = await controller.addNotifications(newNotification);

            //Assert
            expect(result.data).toEqual(newNotification);
            expect(result.succeeded).toBe(true);
        });
    })

});



