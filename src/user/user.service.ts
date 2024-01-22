import { Injectable } from '@nestjs/common';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class UserService {
  constructor(
    @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    private readonly transactionService: TransactionService,
  ) {}

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

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
