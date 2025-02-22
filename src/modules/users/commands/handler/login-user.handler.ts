import {
  NotFoundException,
  GoneException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthService } from 'src/services/jwt/jwt.service';
import { LoginUserCommand } from '../impl/login-user.command';
import { SharedEvents } from 'src/modules/command-events/events';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateHistoryEvent } from 'src/modules/command-events/create-history.event';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  private readonly logger = new Logger(LoginUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashPasswordService: HashPasswordService,
    private readonly jwtService: JwtAuthService,
    private readonly eventBus: EventBus,
  ) {}

  async execute({ payload, res }: LoginUserCommand): Promise<void> {
    try {
      const { email, password } = payload;
      this.logger.log(`Received loginUser command for email: ${email}`);

      // ✅ Fetch User
      const user = await this.userRepository.findOne({
        where: { email },
        select: { isVerified: true, password: true, id: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.isVerified) {
        throw new GoneException('Email verification required before login');
      }

      // ✅ Verify Password
      const passwordMatch = await this.hashPasswordService.verifyPassword(
        password,
        user.password,
      );
      if (!passwordMatch) {
        throw new UnauthorizedException('Password / Email not matched');
      }

      // ✅ Generate Tokens
      const { accessToken, refreshToken } = this.jwtService.generateTokens({
        id: user.id,
      });

      // ✅ Set Secure Cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 10 * 60 * 1000, // 10 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      // ✅ Publish Event (Non-blocking)
      setImmediate(() => {
        this.eventBus.publish(
          new CreateHistoryEvent(user.id, SharedEvents.UserLoginEvent),
        );
      });

      // ✅ Send JSON Response
      res.status(200).json({
        message: 'Login successful',
        data: { id: user.id },
      });
    } catch (error) {
      this.logger.error(`Error in loginUser command: ${error.message}`);

      // Send Error Response
      res.status(error.getStatus ? error.getStatus() : 500).json({
        message: error.message || 'Internal Server Error',
      });
    }
  }
}
