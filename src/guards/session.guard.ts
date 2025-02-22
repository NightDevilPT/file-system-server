import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthService } from 'src/services/jwt/jwt.service';
import { RequestWithUser } from 'src/interfaces/request.interface';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const response = context.switchToHttp().getResponse<Response>();

    // Extract Access Token from cookies
    const accessToken = request.cookies?.accessToken;
    const refreshToken = request.cookies?.refreshToken;

    let decodedAccessToken = this.jwtAuthService.verifyToken(accessToken);
    console.log(
      decodedAccessToken,
      accessToken,
      refreshToken,
      request.cookies,
      'decodedAccessToken',
    );

    if (!decodedAccessToken) {
      console.log('Access Token expired. Checking Refresh Token...');

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh Token missing');
      }

      const decodedRefreshToken =
        this.jwtAuthService.verifyRefreshToken(refreshToken);

      if (!decodedRefreshToken) {
        throw new UnauthorizedException('Invalid or expired Refresh Token');
      }

      // Generate new Access Token using valid Refresh Token
      const newTokens = this.jwtAuthService.generateTokens({
        id: decodedRefreshToken.id,
      });

      // Set new tokens in response cookies
      response.cookie('accessToken', newTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 60 * 1000, // 10 minutes
      });

      response.cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      decodedAccessToken = this.jwtAuthService.verifyToken(
        newTokens.accessToken,
      );
    }

    // Attach decoded user to request
    request.user = decodedAccessToken;
    return true;
  }
}
