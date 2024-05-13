import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

import { VerifyUserCommand } from './command/handler/verify-user.command';
import { CreateUserCommand } from './command/handler/create-user.command';

import {
  loginResponse,
  verificationResponse,
  verificationSuccessResponse,
} from './user.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserCommand } from './command/handler/login-user.command';

@Injectable()
export class UsersService {
  constructor(private commandBus: CommandBus) {}

  create(createUserDto: CreateUserDto): Promise<verificationResponse> {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  verifyUser(token: string): Promise<verificationSuccessResponse> {
    return this.commandBus.execute(new VerifyUserCommand(token));
  }

  loginUser(loginUserDto: LoginUserDto): Promise<loginResponse> {
    return this.commandBus.execute(new LoginUserCommand(loginUserDto));
  }
}
