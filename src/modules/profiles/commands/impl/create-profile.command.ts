import { CreateProfileDto } from '../../dto/create-profile.dto';

export class CreateProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly payload: CreateProfileDto,
    public readonly file:Express.Multer.File
  ) {}
}
