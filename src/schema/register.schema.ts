// onRegister collection - to store user details at the time of signing up

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class OnRegister {
  @Prop({ type: mongoose.Schema.Types.Number })
  _id: number;

  @Prop({ type: String, unique: true, required: true })
  emailID: string;

  @Prop({ type: String, default: 'User123' })
  fullName: string;

  @Prop({ type: String, default: 'Employee' })
  occupation: string;

  @Prop({ type: Boolean, default: false })
  isLoggedIn: boolean;

  @Prop({ type: Date, default: () => Date.now() })
  createdAt: Date;

  @Prop({ type: Date, default: () => Date.now() })
  updatedAt: Date;
}
export const onRegisterSchema = SchemaFactory.createForClass(OnRegister);
