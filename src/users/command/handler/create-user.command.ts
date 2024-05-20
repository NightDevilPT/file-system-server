import { ConflictException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Provider, User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { MailService } from 'src/services/mail/mail.service';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';

export class CreateUserCommand {
  constructor(public readonly payload: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  private readonly logger = new Logger(CreateUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly hashService: HashPasswordService,
  ) {}

  async execute({ payload }: CreateUserCommand) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: payload.email,
        },
      });

      if (existingUser) {
        throw new ConflictException('User already exists with that email');
      }

      const token = await this.hashService.hashPassword(`${Date.now()}`);

      const newUser = new User();
      newUser.username = payload.username;
      newUser.email = payload.email;
      newUser.password = await this.hashService.hashPassword(payload.password);
      newUser.token = token;
      newUser.provider = payload.provider || Provider.Local;

      await this.userRepository.save(newUser);
      const isMailSent = await this.mailService.sendMail(
        newUser.email,
        'Email-ID Verification',
        token,
      );

      if (isMailSent) {
        return {
          message: `Verification link sent to ${newUser.email}`,
        };
      } else {
        throw new Error('Unable to send verification mail');
      }
    } catch (error) {
      this.logger.error(`Error while creating user: ${error.message}`);
      throw error;
    }
  }
}
