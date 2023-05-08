import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  public async findAll() {
    return this.chatsService.findAll();
  }

  @Get(':id')
  public async findOne(@Query('id') id: string) {
    return this.chatsService.findOne(id);
  }

  @Post()
  public async create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }
}
