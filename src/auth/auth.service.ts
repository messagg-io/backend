import { User } from '@app/users/entities';
import { UsersService } from '@app/users/users.service';
import { IJwtPayload } from '@interfaces/auth';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as process from 'process';
import { SignupDto } from './dto';
import { IRawJwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }

  public async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneWithPass(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      delete user.password;
      return user;
    }

    return null;
  }

  public async login(user?: User) {
    if (!user) {
      throw new HttpException('No user in request', HttpStatus.UNAUTHORIZED);
    }

    const payload = { username: user.username, sub: String(user._id) };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  public async signup(signupDto: SignupDto) {
    return await this.usersService.create(signupDto);
  }

  public getPayload(accessToken: string): IJwtPayload {
    const payload = this.jwtService.decode(accessToken) as IRawJwtPayload;
    return { userId: payload.sub, username: payload.username };
  }
}
