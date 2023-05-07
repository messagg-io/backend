import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { LocalAuthGuard } from '@app/auth/local-auth.guard';
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req: Express.Request) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  public async test(@Request() req: Express.Request) {
    return req.user;
  }
}
