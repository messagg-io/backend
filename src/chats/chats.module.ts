import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';
import { Chat, ChatSchema } from './entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsGateway, ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {
}
