import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (_, ret) {
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  uid: string;

  @Prop()
  telegramId: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
