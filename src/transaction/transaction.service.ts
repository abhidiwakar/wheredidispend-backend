import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './schema/transaction.schema';
import { QueuedTransaction } from './interface/queued-transaction.interface';
import * as dayjs from 'dayjs';
import { S3Service } from 'src/s3.service';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
    @InjectFirebaseAdmin()
    private readonly firebase: FirebaseAdmin,

    private readonly s3Service: S3Service,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    return this.transactionModel.create(createTransactionDto);
  }

  async processQueuedTransactions(data: QueuedTransaction) {
    this.logger.debug('TRANSACTION DATA: ', data);
    const user = await this.firebase.auth.getUserByPhoneNumber(`+${data.from}`);

    return await this.create({
      metadata: [
        {
          name: 'UPI Reference ID',
          data: data.transactionData.upi_reference_id,
        },
        {
          name: 'Send To (Name)',
          data: data.transactionData.paid_to,
        },
        {
          name: 'Sent To (UPI ID)',
          data: data.transactionData.receiver_upi_id,
        },
        {
          name: 'UPI App',
          data: data.transactionData.upi_app,
        },
      ],
      amount: parseInt(data.transactionData.amount_paid),
      currency: data.transactionData.currency,
      date: dayjs(data.transactionData.datetime).toDate(),
      description: `Paid to ${data.transactionData.paid_to} (${data.transactionData.receiver_upi_id}) on ${data.transactionData.upi_app} app.\nUPI Reference ID: ${data.transactionData.upi_reference_id}`,
      uid: user.uid,
    });
  }

  averageSpending(uid: string) {
    return this.transactionModel.aggregate([
      {
        $match: {
          uid,
        },
      },
      {
        $group: {
          _id: '$uid',
          count: { $sum: 1 },
          averageSpending: {
            $avg: '$amount',
          },
        },
      },
      {
        $match: {
          count: { $gte: 3 },
        },
      },
      {
        $project: {
          _id: 0,
          averageSpending: 1,
        },
      },
    ]);
  }

  async findAll(
    uid: string,
    firstId: string | undefined,
    lastId: string | undefined,
    pageSize = 10,
  ) {
    // const skip = (page - 1) * pageSize;
    const filterQuery = {
      uid,
    };

    if (firstId && lastId) {
      filterQuery['$or'] = [
        {
          _id: {
            $gt: firstId,
          },
        },
        {
          _id: {
            $lt: lastId,
          },
        },
      ];
    }

    const result = await this.transactionModel
      .find(filterQuery)
      // .skip(skip)
      .limit(pageSize)
      .sort({
        createdAt: -1,
      })
      .exec();
    // const total = await this.transactionModel
    //   .countDocuments(filterQuery)
    //   .exec();

    // return {
    //   data: result,
    //   total,
    // };

    return result;
  }

  async findOne(uid: string, id: string) {
    const result = await this.transactionModel.findOne({
      _id: id,
      uid,
    });
    if (result.attachments.length > 0) {
      const urls = [];
      for (const attachment of result.attachments) {
        const url = await this.s3Service.generatePresignedURL(attachment);
        urls.push(url);
      }
      result.attachments = urls;
    }
    return result;
  }

  update(id: string, { uid, ...updateTransactionDto }: UpdateTransactionDto) {
    return this.transactionModel.findOneAndUpdate(
      {
        _id: id,
        uid,
      },
      {
        $set: updateTransactionDto,
        $unset: {
          description: updateTransactionDto.description ? undefined : 1,
        },
      },
      {
        new: true,
      },
    );
  }

  remove(uid: string, id: string) {
    return this.transactionModel.findOneAndDelete({
      _id: id,
      uid,
    });
  }

  removeAll(uid: string) {
    return this.transactionModel.deleteMany({
      uid,
    });
  }
}
