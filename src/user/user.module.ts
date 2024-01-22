import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TransactionModule],
})
export class UserModule {}
