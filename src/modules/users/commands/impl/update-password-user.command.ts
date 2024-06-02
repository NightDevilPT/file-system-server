import { UpdatePasswordUserDto } from '../../dto/update-password-user.dto';

export class UpdatePasswordCommand {
  constructor(
    public readonly payload: UpdatePasswordUserDto,
    public readonly token: string,
  ) {}
}
