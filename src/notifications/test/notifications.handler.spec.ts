import { Test } from "@nestjs/testing";
import { NotificationEventHandler } from "../notifications.handler";
import { NotificationCreatedEvent } from "../notifications.event";

describe('NotificationCreatedEventHandler', () => {
    let handler: NotificationEventHandler;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [NotificationEventHandler],
        }).compile();

        handler = moduleRef.get<NotificationEventHandler>(NotificationEventHandler,);
    });

    describe('handle', () => {
        it('should log a message with the notification data', async () => {
            //Arrange            
            const data = { email: "test@test.com", notifications: ["TEST #1"] };
            const event = new NotificationCreatedEvent(data);
            const consoleSpy = jest.spyOn(console, 'log');

            //Act
            await handler.handle(event);
            
            //Assert
            expect(consoleSpy).toHaveBeenCalledWith(
                `Notification created for email:${data.email}, with message:${JSON.stringify(data.notifications)}`,
            );
        });
    });
});
