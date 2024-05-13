import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppService } from './app.service';
import { typeOrmConfig } from './ormConfig';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { JwtAuthService } from './services/jwt/jwt.service';
import { HashPasswordService } from './services/hash-password/hash-password.service';

const modules = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) =>
      typeOrmConfig(configService),
    inject: [ConfigService],
  }),
  UsersModule
];

@Module({
  imports: modules,
  controllers: [AppController],
  providers: [AppService, JwtAuthService,JwtService, HashPasswordService],
})
export class AppModule {}
