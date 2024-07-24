import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
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

  @Get('/get')
  async getUserDetails(@User() user: IUser) {
    try {
      const firebaseData = await this.userService.getUserDetailsById(user.uid);
      const localData = await this.userService.getUserMetaData(user.uid, 'uid');

      const userData = {
        name: firebaseData.displayName,
        uid: firebaseData.uid,
        email: firebaseData.email,
        photoURL: firebaseData.photoURL,
        phoneNumber: firebaseData.phoneNumber,
        telegramId: localData?.telegramId,
      };
      return userData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  @Get('/telegram-registration')
  async getTelegramRegistrationCode(@User() user: IUser) {
    try {
      const validityInSeconds = 60 * 10;
      const code = await this.userService.getTelegramRegistrationCode(
        user.uid,
        validityInSeconds,
      );
      const registrationMessage = `/register ${code}`;
      return {
        code,
        bot_handle: '@wheredidispend_bot',
        registrationMessage,
        link: `https://telegram.me/wheredidispend_bot?text=${registrationMessage}`,
        message: `Code is valid for ${validityInSeconds / 60} minutes`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Failed to generate the code! Please try again later.',
      );
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
      throw new InternalServerErrorException(
        'Failed to update the user! Please try again later.',
      );
    }
  }

  @Delete('delete')
  remove(@User() { uid }: IUser) {
    return this.userService.remove(uid);
  }
}
