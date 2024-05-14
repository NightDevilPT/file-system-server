import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';

import { ICommand } from '@nestjs/cqrs';
import { forgetResponse } from 'src/users/user.interface';

export class UpdatePasswordCommand implements ICommand {
  constructor(public readonly password: string, public readonly token: string) {}
}


@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler implements ICommandHandler<UpdatePasswordCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashPasswordService,
  ) {}

  async execute(command: UpdatePasswordCommand): Promise<forgetResponse> {
    const { password, token } = command;

    const user = await this.userRepository.findOne({ where: { token } });

    if (!user) {
      throw new NotFoundException('Invalid token');
    }

    const hashedPassword = await this.hashService.hashPassword(password);

    user.password = hashedPassword;
    user.token = null; // Clear the token after password update
    await this.userRepository.save(user);
	return {
		message:`password successfully updated.`
	}
  }
}
