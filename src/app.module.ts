import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './ormConfig';
import { UsersModule } from './users/users.module';
import { JwtAuthService } from './jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { HashPasswordService } from './hash-password/hash-password.service';

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
