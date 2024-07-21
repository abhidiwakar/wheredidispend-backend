import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Group } from '../group/schema/group.schema';
import * as dayjs from 'dayjs';

export type TransactionDocument = HydratedDocument<Transaction>;

class MetaData {
  name: string;
  data: unknown;
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (_, ret) {
      delete ret.__v;
      delete ret.uid;
      ret.date = dayjs(ret.date).toISOString().split('Z')[0];
      return ret;
    },
  },
})
export class Transaction {
  @Prop({ required: true })
  uid: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true, default: 'INR' })
  currency: string;

  @Prop({ default: [] })
  metadata?: MetaData[];

  @Prop({ default: [] })
  attachments: string[];

  @Prop({ type: Types.ObjectId, ref: Group.name })
  group?: Group;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
