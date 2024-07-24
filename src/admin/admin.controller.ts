import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { APIGuard } from 'src/auth/api.guard';
import { UserService } from 'src/user/user.service';

@UseGuards(APIGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Get('/user-details')
  async findUser(
    @Query('uid') uid: string,
    @Query('uid_type') uidType: string,
  ) {
    let user = null;
    switch (uidType) {
      case 'telegram':
        user = await this.userService.getUserMetaData(uid, 'telegramId');
        break;
      default:
        throw new BadRequestException('Invalid UID type');
    }

    if (!user) {
      throw new NotFoundException('No user found with give UID!');
    }

    return user;
  }
}
