import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TokenBlacklistModule } from './auth/token-blacklist/token-blacklist.module';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    TokenBlacklistModule,
    UsersModule,
    AuthModule,
    LoggingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
