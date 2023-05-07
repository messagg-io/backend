import { WsAuthGuard } from '@app/auth/ws-auth.guard';
import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection, WebSocketServer
} from '@nestjs/websockets';
import { MessagingService } from './messaging.service';
import { Server, Socket } from 'socket.io';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ namespace: 'messaging' })
export class MessagingGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly messagingService: MessagingService) {}

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
  handleJoinRoom(
    client: Socket,
    payload: any,
  ) {
    const user = (client.handshake as any).user;
    client.join(payload.chatId);
    this.server.emit(`joinRoom|${user.userId}`, payload.chatId);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    client: Socket,
    payload: any,
  ) {
    const user = (client.handshake as any).user;
    client.leave(payload.chatId);
    this.server.emit(`leaveRoom|${user.userId}`, payload.chatId);
  }
}
