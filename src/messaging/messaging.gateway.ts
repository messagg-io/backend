import { WsAuthGuard } from '@app/auth/ws-auth.guard';
import { ChatsService } from '@app/chats/chats.service';
import { JoinRoomDto } from '@app/messaging/dto/join-room.dto';
import { LeaveRoomDto } from '@app/messaging/dto/leave-room.dto';
import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagingService } from './messaging.service';

@UseGuards(WsAuthGuard)
@WebSocketGateway({ namespace: 'messaging' })
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() _server: Server;

  private _logger = new Logger(MessagingGateway.name);

  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagingService: MessagingService,
  ) {
  }

  public async handleConnection(client: Socket) {
    this._logger.log(`Socket#${client.id} has connected`);

    const user = this.messagingService.getUserByHandshake(client.handshake) as any;

    if (!user) {
      client.disconnect();
      this._logger.error(`Socket#${client.id} has disconnected by the server cause of unauthorized`);
      return;
    }

    this._logger.log(`Socket#${client.id} is a user(${user.username}#${user.userId})`);

    const userChatsIds = (await this.chatsService.findAllUserChats(user?.userId))
      .map((chat) => String(chat._id));

    if (userChatsIds?.length <= 0) {
      return;
    }

    this._logger.log(`User ${user.username}#${user.userId} has reconnected to chats [${userChatsIds}]`);

    for (const chatId of userChatsIds) {
      client.join(chatId);
    }
  }

  public async handleDisconnect(client: Socket) {
    const user = this.messagingService.getUserByHandshake(client.handshake) as any;

    this._logger.log(`User ${user.username}#${user.userId} has disconnected`);
  }

  @SubscribeMessage('messageToServer')
  async handleMessage(
    client: Socket,
    payload: any,
  ) {
    const user = (client.handshake as any).user;

    if (!await this.chatsService.checkUser(payload.chatId, user.userId)) {
      throw new WsException('You are not in this chat');
    }

    this._server.to(payload.chatId).emit('messageToClient', { payload });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    client: Socket,
    payload: JoinRoomDto,
  ) {
    const user = (client.handshake as any).user;

    await this.chatsService.addUser(payload.chatId, user.userId);
    client.join(payload.chatId);

    this._logger.log(`User ${user.username}#${user.userId} has joined chat ${payload.chatId}`);

    this._server.emit(`joinRoom|${user.userId}`, payload.chatId);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    client: Socket,
    payload: LeaveRoomDto,
  ) {
    const user = (client.handshake as any).user;

    await this.chatsService.removeUser(payload.chatId, user.userId);
    client.leave(payload.chatId);

    this._logger.log(`User ${user.username}#${user.userId} has left chat ${payload.chatId}`);

    this._server.emit(`leaveRoom|${user.userId}`, payload.chatId);
  }
}
