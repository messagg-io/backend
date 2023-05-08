import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatDto } from './dto';
import { Chat } from './entities';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatsModel: Model<Chat>,
  ) {
  }

  public async create(createChatDto: CreateChatDto): Promise<Chat> {
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

  public async addUser(chatId: string, userId: string): Promise<Chat> {
    return await this.chatsModel.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } },
      { new: true }
    ).exec();
  }

  public async removeUser(chatId: string, userId: string): Promise<Chat> {
    return await this.chatsModel.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    ).exec();
  }

  public async checkUserInChat(chatId: string, userId: string): Promise<boolean> {
    const chatObj = await this.findOne(chatId);

    return !(!chatObj || !chatObj.users.find((user) => String(user._id) === userId));
  }

  public async findAllUserChats(userId: string): Promise<Chat[]> {
    return await this.chatsModel.find({ users: userId }).exec();
  }
}
