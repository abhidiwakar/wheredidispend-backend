import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Group } from '../group/schema/group.schema';
import * as dayjs from 'dayjs';
import { Constants } from 'src/utils/constants';

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
      const addedVia = ret.metadata?.find((f) => f.name === 'Added Via')?.data;
      if (addedVia && Constants.DataPlugins.includes(addedVia)) {
        ret.date = dayjs(ret.date).toISOString().split('Z')[0];
      }
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
