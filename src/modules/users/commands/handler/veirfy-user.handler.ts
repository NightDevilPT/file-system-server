import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { VerifyUserCommand } from '../impl/verify-user.command';
import { Logger } from '@nestjs/common';
import { CreateHistoryEvent } from 'src/modules/command-events/create-history.event';
import { SharedEvents } from 'src/modules/command-events/events';

@CommandHandler(VerifyUserCommand)
export class VerifyUserHandler implements ICommandHandler<VerifyUserCommand> {
  private readonly logger = new Logger(VerifyUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventBus:EventBus
  ) {}

  async execute(command: VerifyUserCommand): Promise<any> {
    try {
      const { token } = command;
      this.logger.log(`Received verifyUser command with token: ${token}`);

      const user = await this.userRepository.findOne({ where: { token } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.isVerified = true;
      user.token = null;
      await this.userRepository.save(user);

      this.logger.log(`User ${user.id} verified successfully`);
      this.eventBus.publish(new CreateHistoryEvent(user.id,SharedEvents.UserVerifyEvent))
      return { message: 'User verified successfully' };
    } catch (error) {
      this.logger.error(`Error in verifyUser command: ${error.message}`);
      throw error;
    }
  }
}
