import { CreateChatDto } from '@app/chats/dto/create-chat.dto';
import { Chat } from '@app/chats/entities/chat.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatsModel: Model<Chat>,
  ) {
  }

  public async create(createChatDto: CreateChatDto) {
    return await new this.chatsModel(createChatDto).save();
  }

  public async findAll(): Promise<Chat[]> {
    return await this.chatsModel
      .find()
      .populate('users')
      .exec();
  }

  public async findOne(chatId: string): Promise<Chat | null> {
    return await this.chatsModel
      .findById(chatId)
      .populate('users')
      .exec();
  }

  public async addUser(chatId: string, userId: string) {
    return await this.chatsModel.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } },
      { new: true }
    ).exec();
  }

  public async removeUser(chatId: string, userId: string) {
    return await this.chatsModel.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    ).exec();
  }

  public async checkUser(chatId: string, userId: string) {
    const chatObj = await this.findOne(chatId);

    return !(!chatObj || !chatObj.users.find((user) => String(user._id) === userId));
  }

  public async findAllUserChats(userId: string): Promise<Chat[]> {
    return await this.chatsModel.find({ users: userId }).exec()
  }
}
