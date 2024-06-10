import { CreateFileHandler } from "./handler/create-file.handler";
import { UpdateFilePermissionHandler } from "./handler/update-file-permission.handler";
import { UpdateFileHandler } from "./handler/update-file.handler";

export const FileCommands = [
	CreateFileHandler,
	UpdateFilePermissionHandler,
	UpdateFileHandler
]