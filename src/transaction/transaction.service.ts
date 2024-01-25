import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './schema/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<Transaction>,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    return this.transactionModel.create(createTransactionDto);
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

  findOne(uid: string, id: string) {
    return this.transactionModel.findOne({
      _id: id,
      uid,
    });
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
