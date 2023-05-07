import { User } from '@app/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';
import * as process from 'process';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    ) {
  }

  public async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOneWithPass(username);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      delete user.password
      return user;
    }

    return null;
  }

  public async login(user: any) {
    const payload = { username: user.username, sub: user._id };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    }
  }
}
