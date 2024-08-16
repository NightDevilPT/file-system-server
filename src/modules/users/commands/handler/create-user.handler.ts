import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { Logger } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from 'src/services/mails/mail.service';
import { ConflictException } from '@nestjs/common/exceptions';
import { CreateHistoryEvent } from 'src/modules/command-events/create-history.event';
import { SharedEvents } from 'src/modules/command-events/events';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  private readonly logger = new Logger(CreateUserHandler.name);

  constructor(
    private readonly hashPasswordService: HashPasswordService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly eventBus:EventBus
  ) {}

  async execute({ payload }: CreateUserCommand): Promise<any> {
    try {
      this.logger.log(
        `Received createUser command with payload: ${JSON.stringify(payload)}`,
      );

      const existingUser = await this.userRepository.findOne({
        where: { email: payload.email },
      });
      if (existingUser) {
        throw new ConflictException('This email is already in use');
      }

      const hashedPassword = await this.hashPasswordService.hashPassword(
        payload.password,
      );
      const token = await this.hashPasswordService.hashPassword(
        this.generateToken(),
      );

      const user = new User();
      user.username = payload.username;
      user.email = payload.email;
      user.password = hashedPassword;
      user.token = token;

      const savedUser = await this.userRepository.save(user);
      const emailSent = await this.mailService.sendVerificationMail(
        savedUser.email,
        'Welcome to our platform',
        savedUser.token,
      );

      this.eventBus.publish(new CreateHistoryEvent(savedUser.id,SharedEvents.UserCreatedEvent))
      if (emailSent) {
        return { message: 'User created successfully and email sent' };
      } else {
        return { message: 'User created successfully but failed to send email' };
      }
    } catch (error) {
      this.logger.error(`Error in createUser command: ${error.message}`);
      throw error;
    }
  }

  private generateToken(): string {
    const currentDate = new Date();
    return currentDate.getTime().toString(16);
  }
}
