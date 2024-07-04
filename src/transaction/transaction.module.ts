import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Constants } from 'src/utils/constants';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { TransactionConsumer } from './transaction.consumer';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { S3Service } from 'src/utils/s3.service';
import { GroupModule } from './group/group.module';
import { UtilsModule } from 'src/utils/utils.module';
import { modifyTransactionDoc } from 'src/utils/general.utils';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Transaction.name,
        useFactory(s3Service: S3Service) {
          const schema = TransactionSchema;
          schema.post(['find', 'findOne'], async function (docs, next) {
            if (Array.isArray(docs)) {
              for (let doc of docs) {
                doc = await modifyTransactionDoc(doc, s3Service);
              }
            } else {
              docs = await modifyTransactionDoc(docs, s3Service);
            }
            next();
          });
          return schema;
        },
        inject: [S3Service],
        imports: [UtilsModule],
      },
    ]),
    BullModule.registerQueue({
      name: Constants.DataQueue,
    }),
    forwardRef(() => GroupModule),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionConsumer, S3Service],
  exports: [TransactionService],
})
export class TransactionModule {}
