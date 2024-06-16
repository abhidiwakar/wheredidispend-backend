import { Injectable, Logger } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    private readonly transactionService: TransactionService,
  ) {}

  getUserDetails(id: string) {
    return this.firebase.auth.getUser(id);
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
