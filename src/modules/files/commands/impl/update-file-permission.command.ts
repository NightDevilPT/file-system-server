import { UpdateFilePermissionDto } from "../../dto/update-file-permission.dto";

export class UpdateFilePermissionCommand {
  constructor(
    public readonly payload: UpdateFilePermissionDto,
    public readonly userId: string,
    public readonly fileId: string,
  ) {}
}
