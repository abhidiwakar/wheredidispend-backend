import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
export class Group {
  @Prop({ required: true })
  uid: string;

  @Prop({ required: true })
  name: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
