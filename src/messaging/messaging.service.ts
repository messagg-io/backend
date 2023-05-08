import { AuthService } from '@app/auth/auth.service';
import { IJwtPayload } from '@interfaces/auth';
import { IHandshake } from '@interfaces/ws';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class MessagingService {

  constructor(
    private readonly authService: AuthService,
  ) {
  }

  public getUserByHandshake(handshake: any) {
    try {
      const token = handshake.url.split('?')[1].split('bearerToken=')[1].split('&')[0];
      return this.authService.getPayload(token);
    } catch (e) {
      return null;
    }
  }

  public getUserFromSocket(client: Socket): IJwtPayload {
    return (client.handshake as IHandshake).user;
  }

}
