import { User } from '@app/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

type UserWithoutPass = Omit<User, 'password'>;

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
  }

  public async create(createUserDto: CreateUserDto): Promise<UserWithoutPass> {
    return new this.userModel(createUserDto).save();
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  public async findOne(username: string): Promise<UserWithoutPass> {
    return await this.userModel.findOne({
      username
    })
      .exec();
  }

  public async findOneWithPass(username: string): Promise<User> {
    return await this.userModel.findOne({
        username
      })
      .populate('password')
      .exec();
  }
}
