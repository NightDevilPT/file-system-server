import { UpdateFolderPermissionDto } from "../../dto/update-user-permission.dto";

export class UpdateFolderPermissionCommand {
  constructor(
    public readonly payload: UpdateFolderPermissionDto,
    public readonly userId: string,
    public readonly folderId: string,
  ) {}
}
