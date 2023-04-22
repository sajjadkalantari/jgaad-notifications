import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from '../notifications.service';
import { getModelToken } from '@nestjs/mongoose';
import { Notification } from '../notification.schema';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let notificationModel;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getModelToken(Notification.name),
          useValue: mockNotificationModel,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    notificationModel = module.get(getModelToken('Notification'));
  });

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


  it('should add new notification & return', async () => {
    //Arrange
    const newNotification = { email: 'test2@example.com', notifications: ['example2 notification'] };
    jest.spyOn(notificationModel, 'create').mockReturnValue(newNotification as any);

    //Act
    const notification = await service.addNotification(newNotification);

    //Assert
    expect(notification).toEqual(newNotification);
    expect(notificationModel.create).toBeCalledWith(newNotification);
  });
});


const mockNotificationModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};
