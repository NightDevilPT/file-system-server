import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

import { UserCommands } from './commands';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './users.controller';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/services/mails/mail.service';
import { MailTemplateService } from 'src/templates/email.template';
import { JwtAuthService } from 'src/services/jwt/jwt.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    JwtService,
    MailService,
    UsersService,
    JwtAuthService,
    MailTemplateService,
    HashPasswordService,
    ...UserCommands,
  ],
})
export class UsersModule {}
