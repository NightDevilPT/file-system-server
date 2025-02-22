import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Generate Access & Refresh Tokens
  generateTokens(payload: any) {
    const secret = this.configService.get<string>('JWT_SECRET');
    const accessTokenExpire = '10m'; // Access Token Expires in 10 min
    const refreshTokenExpire = '15m'; // Refresh Token Expires in 15 min

    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: accessTokenExpire,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: refreshTokenExpire,
    });

    return { accessToken, refreshToken };
  }

  // Verify Token (Used for Access Token)
  verifyToken(token: string): any {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      return null; // Token is invalid or expired
    }
  }

  // Verify Refresh Token
  verifyRefreshToken(token: string): any {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      return null;
    }
  }
}
