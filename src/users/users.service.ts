import { CreateUserDto } from '@app/users/dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities';

type UserWithoutPass = Omit<User, 'password'>;

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await new this.userModel(createUserDto).save();
      user.password = '';
      return user;
    } catch (e) {
      throw new HttpException('Username is already used', HttpStatus.CONFLICT);
    }
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  public async findOne(username: string): Promise<UserWithoutPass | null> {
    return await this.userModel.findOne({
        username
      })
      .exec();
  }

  public async findOneWithPass(username: string): Promise<User | null> {
    return await this.userModel.findOne({
        username
      })
      .populate('password')
      .exec();
  }
}
