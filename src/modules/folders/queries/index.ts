import { GetFoldersHandler } from "./handler/get-all-folder.handler";
import { GetFolderByIdHandler } from "./handler/get-folder-by-id.handler";

export const FoldersQueries = [
	GetFoldersHandler,
	GetFolderByIdHandler
]