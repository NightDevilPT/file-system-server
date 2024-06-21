// update-password-user.handler.ts
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';
import { UpdatePasswordCommand } from '../impl/update-password-user.command';
import { Logger } from '@nestjs/common';
import { CreateHistoryEvent } from 'src/modules/command-events/create-history.event';
import { SharedEvents } from 'src/modules/command-events/events';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler
  implements ICommandHandler<UpdatePasswordCommand>
{
  private readonly logger = new Logger(UpdatePasswordHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashPasswordService: HashPasswordService,
    private readonly eventBus:EventBus
  ) {}

  async execute(command: UpdatePasswordCommand): Promise<any> {
    try {
      this.logger.log(`Executing UpdatePasswordCommand with payload: ${JSON.stringify(command.payload)}`);
      
      const { token, payload } = command;

      const user = await this.userRepository.findOne({ where: { token } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.password = await this.hashPasswordService.hashPassword(
        payload.password,
      );
      user.token = null;
      await this.userRepository.save(user);

      this.eventBus.publish(
        new CreateHistoryEvent(
          user.id,
          SharedEvents.UserPasswordUpdatedEvent,
        ),
      );

      return { message: 'Password updated successfully' };
    } catch (error) {
      this.logger.error(`Error updating password: ${error.message}`);
      throw error;
    }
  }
}
