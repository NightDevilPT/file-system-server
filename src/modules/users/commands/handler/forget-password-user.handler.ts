// forget-password.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { ForgetPasswordCommand } from '../impl/forget-password-user.command';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';
import { MailService } from 'src/services/mails/mail.service';
import { Logger } from '@nestjs/common';

@CommandHandler(ForgetPasswordCommand)
export class ForgetPasswordHandler implements ICommandHandler<ForgetPasswordCommand> {
  private readonly logger = new Logger(ForgetPasswordHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly hashPasswordService: HashPasswordService,
  ) {}

  async execute(command: ForgetPasswordCommand): Promise<any> {
    this.logger.log(`Executing ForgetPasswordCommand with payload: ${JSON.stringify(command.payload)}`);

    try {
      const { email } = command.payload;
      this.logger.log(`Searching for user with email: ${email}`);

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const token = await this.hashPasswordService.hashPassword(this.generateToken());
      user.token = token;
      await this.userRepository.save(user);

      const emailSent = await this.mailService.sendUpdatePasswordRequestMail(user.email, 'Request to Update Password', token);

      return { message: 'Reset password email sent successfully' };
    } catch (error) {
      this.logger.error(`Error executing ForgetPasswordCommand: ${error.message}`, error.stack);
      throw error;
    }
  }

  private generateToken(): string {
    const currentDate = new Date();
    return currentDate.getTime().toString(16);
  }
}
