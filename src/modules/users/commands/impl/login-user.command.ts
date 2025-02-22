import { Response } from 'express';
import { LoginUserDto } from '../../dto/login-user.dto';

export class LoginUserCommand {
  constructor(
    public readonly payload: LoginUserDto,
    public readonly res: Response, // ✅ Include Response object to set cookies
  ) {}
}
