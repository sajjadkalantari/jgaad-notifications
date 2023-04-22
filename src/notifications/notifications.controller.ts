import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResponseGeneric } from 'src/utilities/dtos/response.dto';
import { NotificationDto } from './notification.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get('messages/:email')
    @ApiResponse({type: ResponseGeneric<NotificationDto>})
    async getNotifications(@Param('email') email: string): Promise<ResponseGeneric<NotificationDto>> {
      const data = await this.notificationsService.getNotifications(email);
      return new ResponseGeneric<NotificationDto>(data);
    }

    @Post('add-notifications')
    @ApiBody({ type: NotificationDto })
    @ApiResponse({type: ResponseGeneric<NotificationDto>})
    async addNotifications(@Body() req: NotificationDto): Promise<ResponseGeneric<NotificationDto>> {
      const data = await this.notificationsService.addNotification(req);
      return new ResponseGeneric<NotificationDto>(data);
    }
}
