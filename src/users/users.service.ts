import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './command/handler/create-user.command';

@Injectable()
export class UsersService {
  constructor(private commandBus: CommandBus) {}

  create(createUserDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto))
  }
}
