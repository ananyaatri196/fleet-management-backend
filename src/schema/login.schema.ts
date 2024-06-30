// onLogin collection - to store user details at the time of loggin in

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class OnLogin {
  @Prop({ type: mongoose.Schema.Types.Number })
  _id: number;

  @Prop({ type: String, unique: true, required: true })
  emailID: string;

  @Prop({ type: String })
  otp: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Date, default: () => Date.now() })
  createdAt: Date;

  @Prop({ type: Date, default: () => Date.now() })
  updatedAt: Date;

  @Prop({ type: Number, default: 0 })
  attempts: number;
}
export const onLoginSchema = SchemaFactory.createForClass(OnLogin);
