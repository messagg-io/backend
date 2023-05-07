import { Injectable } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {
  }

  public async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) { // TODO change password to hash (bcrypt)
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
