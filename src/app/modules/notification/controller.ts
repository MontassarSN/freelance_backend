import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './service';
import { Resource } from '../auth/decorators/resource.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { QueryNotificationDto } from './dto/dto';
import { AuthenticatedUser } from '../auth/decorators/user.decorator';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { FirebaseService } from './firebase.service';

@Resource('notifications')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  constructor(
    private readonly service: NotificationsService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get('me')
  async getMany(
    @Query() query: QueryNotificationDto,
    @AuthenticatedUser() userJwt: JwtPayloadType,
  ) {
    const res = await this.service.findUserNotifications({
      query,
      user_id: userJwt.user_id,
    });
    return res;
  }

  // @Post('subscribe')
  // async subscribeToTopic(@Body() body: SubscribeToTopicDto) {
  //   return await this.firebaseService.subscribeToTopic({
  //     topic: 'all',
  //     token: body.token,
  //   });
  // }

  // @Post('unsubscribe')
  // async unsubscribeToTopic(@Body() body: SubscribeToTopicDto) {
  //   return await this.firebaseService.unsubscribeFromTopic({
  //     topic: 'all',
  //     token: body.token,
  //   });
  // }
}
