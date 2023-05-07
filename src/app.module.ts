import { AuthModule } from '@app/auth/auth.module';
import { UsersModule } from '@app/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagingModule } from './messaging/messaging.module';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}/${process.env.DB_DATABASE}`),
    UsersModule,
    AuthModule,
    MessagingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
