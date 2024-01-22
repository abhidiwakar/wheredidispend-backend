import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret.uid;
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
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
