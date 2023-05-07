import { AuthModule } from '@app/auth/auth.module';
import { UsersModule } from '@app/users/users.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
