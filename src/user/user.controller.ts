import {
  Body,
  Controller,
  Delete,
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
