import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Generate JWT token
  generateToken(payload: any): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIREIN');
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  // Verify JWT token
  verifyToken(token: string): any {
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.verify(token, { secret });
  }
}
