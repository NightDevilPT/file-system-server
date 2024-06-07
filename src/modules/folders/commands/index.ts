import { CreateFolderHandler } from "./handler/create-folder.handler";
import { UpdateFolderPermissionHandler } from "./handler/update-folder-permission.handler";
import { UpdateFolderHandler } from "./handler/update-folder.handler";

export const FolderCommands = [
	CreateFolderHandler,
	UpdateFolderHandler,
	UpdateFolderPermissionHandler
]