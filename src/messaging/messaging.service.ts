import { AuthService } from '@app/auth/auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagingService {

  constructor(
    private readonly authService: AuthService,
  ) {
  }

  public getUserByHandshake(handshake: any) {
    const token = handshake.url.split('?')[1].split('bearerToken=')[1].split('&')[0];
    console.log('token', token);

    return this.authService.getPayload(token);
  }

}
