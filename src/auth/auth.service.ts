import { Injectable } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    ) {
  }

  public async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) { // TODO change password to hash (bcrypt)
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  public async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    }
  }
}
