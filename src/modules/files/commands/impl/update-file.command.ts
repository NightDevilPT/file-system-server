import { UpdateFileDto } from "../../dto/update-file.dto";

export class UpdateFileCommand {
  constructor(
    public readonly payload: UpdateFileDto,
    public readonly userId: string,
    public readonly fileId: string,
  ) {}
}
