import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';

import { ICommand } from '@nestjs/cqrs';
import { forgetResponse } from 'src/users/user.interface';
import { ForgetUserDto } from 'src/users/dto/forget-user.dto';

export class ForgetPasswordCommand implements ICommand {
  constructor(public readonly payload: ForgetUserDto) {}
}

@CommandHandler(ForgetPasswordCommand)
export class ForgetPasswordHandler
  implements ICommandHandler<ForgetPasswordCommand>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashPasswordService,
  ) {}

  async execute({ payload }: ForgetPasswordCommand): Promise<forgetResponse> {
    const { email } = payload;

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found with that email');
    }

    // Generate new token
    const token = await this.hashService.hashPassword(`${Date.now()}`);

    // Update user's token
    user.token = token;
    await this.userRepository.save(user);
    return {
      message: `update password link sent to ${user.email}`,
    };
  }
}
