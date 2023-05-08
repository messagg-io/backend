import { UsersService } from '@app/users/users.service';
import { IJwtPayload } from '@interfaces/auth';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';
import { IRawJwtPayload } from './interfaces';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsjwt') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('bearerToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(payload: IRawJwtPayload): Promise<IJwtPayload> {
    const { username } = payload;
    if (await this.usersService.findOneWithPass(username)) {
      return { userId: payload.sub, username: payload.username };
    } else {
      throw new WsException('Unauthorized access');
    }
  }
}