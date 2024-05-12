import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserHandler } from './command/handler/create-user.command';

import { User } from './entities/user.entity';

const commandHandlers = [CreateUserHandler]

@Module({
  imports:[CqrsModule,TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService,...commandHandlers],
})
export class UsersModule {}
