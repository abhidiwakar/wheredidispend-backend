import { Module } from '@nestjs/common';
import { TransactionModule } from 'src/transaction/transaction.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TransactionModule],
  exports: [UserService],
})
export class UserModule {}
