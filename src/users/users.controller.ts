import { CreateUserDto } from '@app/users/dto';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  public async findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  public async findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
