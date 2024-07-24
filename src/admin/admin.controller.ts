import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { APIGuard } from 'src/auth/api.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserService } from 'src/user/user.service';

@UseGuards(APIGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Patch('/update-user')
  async updateUser(@Query('uid') uid: string, @Body() data: UpdateUserDto) {
    if (!uid) {
      throw new BadRequestException('Invalid UID!');
    }

    await this.userService.updateUser(uid, data);
    return {
      message: 'Updated successfully',
    };
  }

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
