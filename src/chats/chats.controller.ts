import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { ChatsService } from '@app/chats/chats.service';
import { CreateChatDto } from '@app/chats/dto/create-chat.dto';
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
  findOne(@Query('id') id: string) {

  }

  @Post()
  public async create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }
}
