import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUser, User } from 'src/common/decorators/user.decorator';
import { UpdateFirebaseUserDto } from './dto/update-firebase-user.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get('/telegram-registration')
  async getTelegramRegistrationCode(@User() user: IUser) {
    try {
      const validityInSeconds = 60 * 10;
      const code = await this.userService.getTelegramRegistrationCode(
        user.uid,
        validityInSeconds,
      );
      const registrationMessage = `Register ${code}`;
      return {
        code,
        bot_handle: '@wheredidispend_bot',
        registrationMessage,
        link: `https://telegram.me/wheredidispend_bot?text=${registrationMessage}`,
        message: `Code is valid for ${validityInSeconds / 60} minutes`,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        message: 'Failed to generate the code! Please try again later.',
      };
    }
  }

  @Patch('update')
  async update(@User() { uid }: IUser, @Body() body: UpdateFirebaseUserDto) {
    try {
      await this.userService.updatePhoneNumber(uid, body.phoneNumber);
      return {
        message: 'User updated successfully!',
      };
    } catch (error) {
      this.logger.error(error);
      return {
        message: 'Failed to update the user! Please try again later.',
      };
    }
  }

  @Delete('delete')
  remove(@User() { uid }: IUser) {
    return this.userService.remove(uid);
  }
}
