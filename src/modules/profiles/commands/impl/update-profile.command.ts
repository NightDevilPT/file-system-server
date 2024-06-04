import { UpdateProfileDto } from '../../dto/update-profile.dto';

export class UpdateProfileCommand {
  constructor(
    public readonly profileId: string,
    public readonly payload: UpdateProfileDto,
  ) {}
}
