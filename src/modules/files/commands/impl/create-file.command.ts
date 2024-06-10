import { CreateFileDto } from '../../dto/create-file.dto';

export class CreateFileCommand {
  constructor(
    public readonly file: Express.Multer.File,
    public readonly createFileDto: CreateFileDto,
    public readonly userId: string,
  ) {}
}
