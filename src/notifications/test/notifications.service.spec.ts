import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications.service';
import { getModelToken } from '@nestjs/mongoose';
import { Notification } from '../notification.schema';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { NotificationCreatedEvent } from '../notifications.event';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let eventBus: EventBus;
  let notificationModel;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        EventBus,
        CommandBus,
        {
          provide: getModelToken(Notification.name),
          useValue: mockNotificationModel,
        }        
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    notificationModel = module.get(getModelToken('Notification'));
    eventBus = module.get<EventBus>(EventBus);
  });

  describe("get notifications", () => {

    it('should return valid notification', async () => {
      //Arrange
      const expectedNotification = { email: 'test@example.com', notifications: ['example notification'] };
      jest.spyOn(notificationModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockReturnValue({ exec: jest.fn().mockReturnValue(expectedNotification) }),
      } as any);

      //Act
      const notification = await service.getNotifications("test@example.com");

      //Assert
      expect(notification).toEqual(expectedNotification);
      expect(notificationModel.findOne).toBeCalledWith({ email: 'test@example.com' });
    });

    it('should throw not found exception', async () => {
      //Arrange
      const expectedNotification = null;
      jest.spyOn(notificationModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockReturnValue({ exec: jest.fn().mockReturnValue(expectedNotification) }),
      } as any);


      //Act & Assert
      await expect(service.getNotifications("test@example.com")).rejects.toThrow("user notifications not found");

    });
  })

  describe("add notifications", () => {
    it('should add new notification & return', async () => {
      //Arrange
      const newNotification = { email: 'test2@example.com', notifications: ['example2 notification'] };
      const event = new NotificationCreatedEvent(newNotification);
      jest.spyOn(notificationModel, 'create').mockReturnValue(newNotification as any);
      const publishSpy = jest.spyOn(eventBus, 'publish');

      //Act
      const notification = await service.addNotification(newNotification);

      //Assert
      expect(publishSpy).toHaveBeenCalledWith(event);
      expect(notification).toEqual(newNotification);
      expect(notificationModel.create).toBeCalledWith(newNotification);
    });

    it('should throw email validation error', async () => {
      //Arrange
      const newNotification = { email: 'test.com', notifications: ['example2 notification'] };

      //Act & Arrange
      await expect(service.addNotification(newNotification)).rejects.toThrow("invalid request");
    });

    it('should throw notifications validation error', async () => {
      //Arrange
      const newNotification = { email: 'test@test.com', notifications: null };

      //Act & Arrange
      await expect(service.addNotification(newNotification)).rejects.toThrow("invalid request");
    });
  })

});


const mockNotificationModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};
