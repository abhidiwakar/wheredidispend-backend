import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Constants } from 'src/utils/constants';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { TransactionConsumer } from './transaction.consumer';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { S3Service } from 'src/s3.service';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    BullModule.registerQueue({
      name: Constants.DataQueue,
    }),
    GroupModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionConsumer, S3Service],
  exports: [TransactionService],
})
export class TransactionModule {}
