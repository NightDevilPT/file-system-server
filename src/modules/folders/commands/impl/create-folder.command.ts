import { CreateFolderDto } from '../../dto/create-folder.dto';

export class CreateFolderCommand {
  constructor(
    public readonly payload: CreateFolderDto,
    public readonly userId: string,
  ) {}
}
