import {
  BadRequestException,
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IUser, User } from 'src/common/decorators/user.decorator';
import { UserService } from 'src/user/user.service';
import { EnableAddViaWhatsAppDto } from './dto/enable-whatsapp-feature';
import { WhatsappService } from './whatsapp.service';
import { AxiosError } from 'axios';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('/whatsapp')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly userService: UserService,
  ) {}

  @Post('/disable')
  async disableAddViaWhatsApp(@User() user: IUser) {
    try {
      const userDetails = await this.userService.getUserDetailsById(user.uid);
      if (!userDetails.phoneNumber) {
        throw new BadRequestException('Feature already disabled!');
      }

      await this.userService.updatePhoneNumber(user.uid, null);

      const result = await this.whatsappService.addViaWhatsAppDisabled(
        userDetails.phoneNumber,
        userDetails.displayName,
      );
      this.logger.debug(result.data);
      return {
        message: 'Disabled successfully',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(error, error.response.data);
      } else {
        this.logger.error(error);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  @Post('/enable')
  async enableAddViaWhatsApp(
    @User() user: IUser,
    @Body() body: EnableAddViaWhatsAppDto,
  ) {
    try {
      const updateResult = await this.userService.updatePhoneNumber(
        user.uid,
        body.phoneNumber,
      );

      const result = await this.whatsappService.addViaWhatsAppEnabled(
        body.phoneNumber,
        updateResult.displayName,
      );
      this.logger.debug(result.data);
      return {
        message: 'Enabled successfully',
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(error, error.response.data);
      } else {
        this.logger.error(error);
      }

      throw new InternalServerErrorException('Failed to enable!');
    }
  }
}
