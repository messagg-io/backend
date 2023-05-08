import { User } from '@app/users/entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  _id: ObjectId;

  messages: [];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: User[];

  @Prop({ required: true })
  title: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
