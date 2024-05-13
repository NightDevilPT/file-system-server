import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { verificationSuccessResponse } from 'src/users/user.interface';

export class VerifyUserCommand {
  constructor(public readonly token: string) {}
}


@CommandHandler(VerifyUserCommand)
export class VerifyUserHandler implements ICommandHandler<VerifyUserCommand> {
  private readonly logger = new Logger(VerifyUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: VerifyUserCommand): Promise<verificationSuccessResponse> {
    try {
      const { token } = command;
      const user = await this.userRepository.findOne({ where: { token } });

      if (!user) {
        throw new NotFoundException('Invalid token');
      }

      user.isVerified = true;
      user.token = null;
      await this.userRepository.save(user);

      return { message: 'Email verification success' };
    } catch (error) {
      this.logger.error(`Error verifying user: ${error.message}`);
      throw error;
    }
  }
}
