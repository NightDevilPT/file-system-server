import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, GoneException, UnauthorizedException } from '@nestjs/common';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';
import { JwtAuthService } from 'src/services/jwt/jwt.service';
import { User } from '../../entities/user.entity';
import { loginUserResponse } from '../../interfaces/user.interface';
import { LoginUserCommand } from '../impl/login-user.command';
import { Logger } from '@nestjs/common';
import { CreateHistoryEvent } from 'src/modules/command-events/create-history.event';
import { SharedEvents } from 'src/modules/command-events/events';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  private readonly logger = new Logger(LoginUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashPasswordService: HashPasswordService,
    private readonly jwtService: JwtAuthService,
    private readonly eventBus:EventBus
  ) {}

  async execute({ payload }: LoginUserCommand): Promise<loginUserResponse> {
    try {
      const { email, password } = payload;
      this.logger.log(`Received loginUser command for email: ${email}`);

      const user = await this.userRepository.findOne({ where: { email },select:{
        isVerified:true,
        password:true,
        id:true
      } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.isVerified) {
        throw new GoneException('Email verification required before login');
      }

      const passwordMatch = await this.hashPasswordService.verifyPassword(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Password / Email not matched');
      }

      const jwtToken = await this.jwtService.generateToken({ id: user.id });

      this.eventBus.publish(
        new CreateHistoryEvent(
          user.id,
          SharedEvents.UserLoginEvent,
        ),
      );

      return {
        message: 'Login successful',
        data: { jwt: jwtToken, id: user.id },
      };
    } catch (error) {
      this.logger.error(`Error in loginUser command: ${error.message}`);
      throw error;
    }
  }
}
