import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { generate as shortUUID } from 'short-uuid';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from './schema/user.schema';
import { RedisService } from 'src/utils/redis.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    private readonly transactionService: TransactionService,

    private readonly redisService: RedisService,
  ) {}

  async updateUser(uid: string, data: UpdateUserDto) {
    return this.userModel.updateOne(
      { uid },
      {
        $set: {
          ...data,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async getTelegramRegistrationCode(uid: string, validityInSeconds: number) {
    const user = await this.userModel.findOne({ uid });
    if (user && user.telegramId) {
      throw new BadRequestException(
        'This service is already enabled for your account.',
      );
    }

    const code = shortUUID();
    await this.redisService.setTempKeyValue(
      `telegram-registration:${code}`,
      uid,
      validityInSeconds,
    );
    return code;
  }

  getUserDetailsById(id: string) {
    return this.firebase.auth.getUser(id);
  }

  getUserMetaData(uid: string, uidType: string) {
    return this.userModel.findOne({
      [uidType]: uid,
    });
  }

  updatePhoneNumber(id: string, phone: string | null) {
    return this.firebase.auth.updateUser(id, {
      phoneNumber: phone,
    });
  }

  async getUserByPhoneNumber(phone: string) {
    return this.firebase.auth.getUserByPhoneNumber(phone);
  }

  async remove(id: string) {
    try {
      await this.transactionService.removeAll(id);
      await this.firebase.auth.deleteUser(id);
      return {
        message: 'User deleted successfully!',
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Failed to delete user! Please try again later.',
      };
    }
  }
}
