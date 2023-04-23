import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseGeneric } from '../utilities/dtos/response.dto';
import { NotificationDto } from './notification.dto';
import { JwtAuthGuard } from '../utilities/jwt-auth.guard';

@Controller('notifications')
@ApiTags('Notificatios')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: ResponseGeneric<NotificationDto> }) 
  async getNotifications(@Req() request): Promise<ResponseGeneric<NotificationDto>> {
    const data = await this.notificationsService.getNotifications(request.user.email);
    return new ResponseGeneric<NotificationDto>(data);
  }

  @Post('add-notifications')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: NotificationDto })
  @ApiResponse({ type: ResponseGeneric<NotificationDto> })
  async addNotifications(@Body() req: NotificationDto): Promise<ResponseGeneric<NotificationDto>> {
    const data = await this.notificationsService.addNotification(req);
    return new ResponseGeneric<NotificationDto>(data);
  }
}
