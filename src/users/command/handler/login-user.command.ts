import { GoneException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { JwtAuthService } from 'src/services/jwt/jwt.service';
import { HashPasswordService } from 'src/services/hash-password/hash-password.service';

export class LoginUserCommand {
  constructor(public readonly payload: LoginUserDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtAuthService,
    private readonly hashService: HashPasswordService,
  ) {}

  async execute({
    payload,
  }: LoginUserCommand): Promise<{ token: string; id: string }> {
    const { email, password } = payload;

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found with that email');
    }

    // Check if password matches
    const passwordMatches = await this.hashService.verifyPassword(
      password,
      user.password,
    );
    if (!passwordMatches) {
      throw new GoneException('Invalid credentials');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new GoneException('Email not verified');
    }

    // Generate JWT token
    const token = this.jwtService.generateToken({ id: user.id });

    return { token, id: user.id };
  }
}
