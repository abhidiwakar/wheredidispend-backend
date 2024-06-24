import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
  date: Date;

  @Prop({ required: true, default: 'INR' })
  currency: string;

  @Prop({ default: [] })
  metadata?: MetaData[];

  @Prop({ default: [] })
  attachments: string[];
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
