import { ChatsModule } from '@app/chats/chats.module';
import { Module } from '@nestjs/common';
import { MessagingGateway } from './messaging.gateway';
import { MessagingService } from './messaging.service';

@Module({
  imports: [ChatsModule],
  providers: [MessagingGateway, MessagingService],
})
export class MessagingModule {
}
