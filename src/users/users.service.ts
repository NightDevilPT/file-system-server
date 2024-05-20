import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import {
  forgetResponse,
  loginResponse,
  verificationResponse,
  verificationSuccessResponse,
} from './user.interface';

import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgetUserDto } from './dto/forget-user.dto';
import { UpdatePasswordUserDto } from './dto/update-user-password.dto';

import { LoginUserCommand } from './command/handler/login-user.command';
import { VerifyUserCommand } from './command/handler/verify-user.command';
import { CreateUserCommand } from './command/handler/create-user.command';
import { ForgetPasswordCommand } from './command/handler/forget-user.command';
import { UpdatePasswordCommand } from './command/handler/update-user-password-command';

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

  forgetUser(forgetUserDto: ForgetUserDto): Promise<forgetResponse> {
    return this.commandBus.execute(new ForgetPasswordCommand(forgetUserDto));
  }

  updateUserPassword(
    updatePasswordUserDto: UpdatePasswordUserDto,
    token: string,
  ): Promise<forgetResponse> {
    return this.commandBus.execute(
      new UpdatePasswordCommand(updatePasswordUserDto.password, token),
    );
  }
}
