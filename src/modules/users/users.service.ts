import { Response } from 'express';
import {
  loginUserResponse,
  userResponseInterface,
} from './interfaces/user.interface';
import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { LoginUserCommand } from './commands/impl/login-user.command';
import { ForgetPasswordUserDto } from './dto/forget-password-user.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { VerifyUserCommand } from './commands/impl/verify-user.command';
import { ForgetPasswordCommand } from './commands/impl/forget-password-user.command';
import { UpdatePasswordCommand } from './commands/impl/update-password-user.command';

@Injectable()
export class UsersService {
  constructor(private readonly commandBus: CommandBus) {}

  public createUser(
    createUserDto: CreateUserDto,
  ): Promise<userResponseInterface> {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  public verifyUser(token: string): Promise<userResponseInterface> {
    return this.commandBus.execute(new VerifyUserCommand(token));
  }

  public async loginUser(
    loginUserDto: LoginUserDto,
    res: Response,
  ): Promise<loginUserResponse> {
    return this.commandBus.execute(new LoginUserCommand(loginUserDto, res));
  }

  public forgetPassword(
    forgetPasswordDto: ForgetPasswordUserDto,
  ): Promise<userResponseInterface> {
    return this.commandBus.execute(
      new ForgetPasswordCommand(forgetPasswordDto),
    );
  }

  public updatePassword(
    upduatePasswordDto: UpdatePasswordUserDto,
    token: string,
  ): Promise<userResponseInterface> {
    return this.commandBus.execute(
      new UpdatePasswordCommand(upduatePasswordDto, token),
    );
  }
}
