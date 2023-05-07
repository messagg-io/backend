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
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: any,
  ) {
    this.server.emit('messageToClient', { data });
  }
}
