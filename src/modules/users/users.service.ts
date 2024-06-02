import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { User } from './entities/user.entity';
import { loginUserResponse, userResponseInterface } from './interfaces/user.interface';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { VerifyUserCommand } from './commands/impl/verify-user.command';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserCommand } from './commands/impl/login-user.command';
import { ForgetPasswordUserDto } from './dto/forget-password-user.dto';
import { ForgetPasswordCommand } from './commands/impl/forget-password-user.command';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
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

  public loginUser(loginUserDto:LoginUserDto):Promise<loginUserResponse>{
    return this.commandBus.execute(new LoginUserCommand(loginUserDto))
  }

  public forgetPassword(forgetPasswordDto:ForgetPasswordUserDto):Promise<userResponseInterface>{
    return this.commandBus.execute(new ForgetPasswordCommand(forgetPasswordDto))
  }

  public updatePassword(upduatePasswordDto:UpdatePasswordUserDto,token:string):Promise<userResponseInterface>{
    return this.commandBus.execute(new UpdatePasswordCommand(upduatePasswordDto,token))
  }
}
