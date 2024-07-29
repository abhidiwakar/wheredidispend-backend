import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase';
import { S3Service } from 'src/utils/s3.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueuedTransaction } from './interface/queued-transaction.interface';
import { Transaction } from './schema/transaction.schema';

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

  generateUploadPresignedUrl(key: string, tmp = false) {
    return this.s3Service.generateUploadPresignedURL(
      key,
      tmp ? process.env.AWS_S3_TMP_BUCKET_NAME : process.env.AWS_S3_BUCKET_NAME,
    );
  }

  async create(createTransactionDto: CreateTransactionDto) {
    // if ((createTransactionDto.attachments?.length ?? 0) > 0) {
    //   await this.s3Service.moveTmpObjectsToPermanentBucket(
    //     createTransactionDto.attachments,
    //   );
    // }
    return this.transactionModel.create({
      ...createTransactionDto,
      group: createTransactionDto.group
        ? new Types.ObjectId(createTransactionDto.group)
        : undefined,
    });
  }

  async processQueuedTransactions(data: QueuedTransaction) {
    this.logger.debug('TRANSACTION DATA: ', data);
    const user = await this.firebase.auth.getUser(data.senderInfo.id);

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
        {
          name: 'Added Via',
          data: data.source ?? 'Unknown',
        },
      ],
      amount: parseInt(data.transactionData.amount_paid),
      currency: data.transactionData.currency,
      date: data.transactionData.datetime,
      description:
        data.image.caption ??
        `Paid to ${data.transactionData.paid_to} (${data.transactionData.receiver_upi_id}) on ${data.transactionData.upi_app} app.\nUPI Reference ID: ${data.transactionData.upi_reference_id}`,
      uid: user.uid,
      attachments: [data.mediaKey],
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
    orderBy = 'createdAt',
    order = 'desc',
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
        [orderBy]: order === 'desc' ? -1 : 1,
      })
      .populate('group', { name: true })
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
    const result = await this.transactionModel
      .findOne({
        _id: id,
        uid,
      })
      .populate('group', { name: true });

    if (!result) {
      throw new BadRequestException('Invalid ID');
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
        $set: {
          ...updateTransactionDto,
          group: updateTransactionDto.group
            ? new Types.ObjectId(updateTransactionDto.group)
            : undefined,
        },
        $unset: {
          group: updateTransactionDto.group ? undefined : 1,
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

  findTransactionSumWithDateGroup(
    uid: string,
    startDate?: string,
    endDate?: string,
  ) {
    const match = {
      uid,
    };
    const dateFilter = {};
    if (startDate) {
      dateFilter['$gte'] = startDate;
    }
    if (endDate) {
      dateFilter['$lt'] = endDate;
    }
    if (Object.values(dateFilter).length > 0) {
      match['date'] = dateFilter;
    }
    return this.transactionModel.aggregate([
      {
        $match: match,
      },
      {
        $addFields: {
          // dateOnly: {
          //   $dateToString: { format: '%Y-%m-%d', date: '$date' },
          // },
          dateOnly: '$date',
        },
      },
      {
        $group: {
          _id: '$dateOnly',
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalAmount: 1,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);
  }

  countTransactionByUserId(userId: string) {
    return this.transactionModel.countDocuments({
      uid: userId,
    });
  }

  sumTransactionAmountByUserId(userId: string) {
    return this.transactionModel.aggregate([
      {
        $match: {
          uid: userId,
        },
      },
      {
        $group: {
          _id: {
            uid: '$uid',
            currency: '$currency',
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          currency: '$_id.currency',
          totalAmount: 1,
        },
      },
    ]);
  }

  countTransactionByGroupId(groupId: string) {
    return this.transactionModel.countDocuments({
      group: groupId,
    });
  }
}
