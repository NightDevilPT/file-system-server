import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { CreateUserHandler } from './command/handler/create-user.command';
import { VerifyUserHandler } from './command/handler/verify-user.command';

import { User } from './entities/user.entity';
import { MailService } from 'src/services/mail/mail.service';
import { JwtAuthService } from 'src/services/jwt/jwt.service';
import { LoginUserHandler } from './command/handler/login-user.command';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';
import { ForgetPasswordHandler } from './command/handler/forget-user.command';
import { UpdatePasswordHandler } from './command/handler/update-user-password-command';

const commandHandlers = [
  CreateUserHandler,
  VerifyUserHandler,
  LoginUserHandler,
  ForgetPasswordHandler,
  UpdatePasswordHandler
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    MailService,
    HashPasswordService,
    JwtService,
    JwtAuthService,
    ...commandHandlers,
  ],
})
export class UsersModule {}
