import { UpdateFolderDto } from '../../dto/update-folder.dto';

export class UpdateFolderCommand {
  constructor(
    public readonly payload: UpdateFolderDto,
    public readonly userId: string,
    public readonly folderId: string,
  ) {}
}
