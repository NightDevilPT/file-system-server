import { ForgetPasswordUserDto } from '../../dto/forget-password-user.dto';

export class ForgetPasswordCommand {
  constructor(public readonly payload: ForgetPasswordUserDto) {}
}
