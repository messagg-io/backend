import { WsAuthGuard } from '@app/auth/ws-auth.guard';
import { ChatsService } from '@app/chats/chats.service';
import { JoinRoomDto } from '@app/messaging/dto/join-room.dto';
import { LeaveRoomDto } from '@app/messaging/dto/leave-room.dto';
import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection, WebSocketServer
} from '@nestjs/websockets';
import { MessagingService } from './messaging.service';
import { Server, Socket } from 'socket.io';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ namespace: 'messaging' })
export class MessagingGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagingService: MessagingService,
  ) {}

  public handleConnection(client: any, ...args: any[]): any {
    return { client, args };
  }

  @SubscribeMessage('messageToServer')
  handleMessage(
    client: Socket,
    payload: any,
  ) {
    this.server.to(payload.chatId).emit('messageToClient', { payload });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    client: Socket,
    payload: JoinRoomDto,
  ) {
    const user = (client.handshake as any).user;
    await this.chatsService.addUser(payload.chatId, user.userId);
    client.join(payload.chatId);
    this.server.emit(`joinRoom|${user.userId}`, payload.chatId);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    client: Socket,
    payload: LeaveRoomDto,
  ) {
    const user = (client.handshake as any).user;
    await this.chatsService.removeUser(payload.chatId, user.userId);
    client.leave(payload.chatId);
    this.server.emit(`leaveRoom|${user.userId}`, payload.chatId);
  }
}
